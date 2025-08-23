from fastapi import FastAPI, APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.responses import StreamingResponse, JSONResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import cv2
import numpy as np
import time
from collections import deque
from copy import deepcopy
import os
import logging
from pathlib import Path
from dotenv import load_dotenv
from typing import List, Optional
from contextlib import asynccontextmanager

from posture_analyzer import PostureAnalyzer
from database import Database
from schemas import (
    PostureAnalysisResult, AnalysisResponse, User, Session, 
    Appointment, CommunityPost, LearningResource, SessionStats
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
db_name = os.environ.get('DB_NAME', 'physiolens')

# Initialize database
database = Database(mongo_url, db_name)

# Lifespan handler replacing deprecated @app.on_event
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup tasks
    try:
        await database.init_sample_data()
        logging.getLogger(__name__).info("Database initialized with sample data")
    except Exception as e:
        logging.getLogger(__name__).warning(f"Database initialization failed: {e}. Running without database.")
    
    try:
        yield
    except Exception as e:
        logging.getLogger(__name__).error(f"Lifespan error: {e}")
    finally:
        # Shutdown tasks
        try:
            await database.close()
            logging.getLogger(__name__).info("Database connection closed")
        except Exception as e:
            logging.getLogger(__name__).warning(f"Database shutdown failed: {e}")

# Create the main app (with lifespan)
app = FastAPI(title="PhysioLens API", description="AI-Powered Posture Analysis Platform", version="1.0.0", lifespan=lifespan)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Initialize posture analyzer
analyzer = PostureAnalyzer()

# Simple performance tracking for UI
_fps_counter = deque(maxlen=30)
_frame_count = 0

# Sample user ID for demo (in production, this would come from authentication)
DEMO_USER_ID = "demo-user-123"

@api_router.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok", "message": "PhysioLens API is running"}

@api_router.get("/")
async def root():
    """Root endpoint."""
    return {"message": "PhysioLens API - Transform Your Posture Health"}

@api_router.post("/analyze", response_model=PostureAnalysisResult)
async def analyze_posture(file: UploadFile = File(...)):
    """Analyze posture from a single image."""
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image format")
        
        height, width = image.shape[:2]
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = analyzer.pose.process(image_rgb)
        
        if not results.pose_landmarks:
            return PostureAnalysisResult(
                score=0,
                grade="F",
                issues=["No pose detected"],
                detailed_issues={},
                angles={},
                measurements={},
                recommendations=["Ensure full body is visible and well-lit"]
            )
        
        landmarks = analyzer.extract_landmarks(results.pose_landmarks, width, height)
        analysis = analyzer.analyze_posture_comprehensive(landmarks)
        
        if analysis is None:
            raise HTTPException(status_code=500, detail="Analysis failed")
        
        return analysis
        
    except Exception as e:
        logging.error(f"Error in analyze_posture: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/analyze_frame")
async def analyze_frame(file: UploadFile = File(...)):
    """Analyze posture from frame and return annotated image."""
    global _frame_count
    frame_start_time = time.time()

    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image format")

        height, width = image.shape[:2]
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = analyzer.pose.process(image_rgb)

        if not results.pose_landmarks:
            cv2.putText(image, "No pose detected", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 255), 2)
            _, img_encoded = cv2.imencode('.jpg', image)
            return StreamingResponse(iter([img_encoded.tobytes()]), media_type="image/jpeg")

        # Extract landmarks and analyze
        landmarks = analyzer.extract_landmarks(results.pose_landmarks, width, height)
        analysis = analyzer.analyze_posture_comprehensive(landmarks)

        if analysis is not None:
            # Update tracking data
            analyzer.posture_history.append(analysis.score)
            analyzer.update_session_stats(analysis)

        # Draw skeleton and enhanced UI
        analyzer.draw_enhanced_skeleton(image, landmarks)

        frame_end_time = time.time()
        frame_fps = 1.0 / (frame_end_time - frame_start_time) if frame_end_time > frame_start_time else 0
        _fps_counter.append(frame_fps)
        _frame_count += 1
        avg_fps = sum(_fps_counter) / len(_fps_counter)
        frame_stats = {"fps": avg_fps, "frame_count": _frame_count}

        if analysis is not None:
            analyzer.draw_enhanced_ui(image, analysis, frame_stats)

        _, img_encoded = cv2.imencode('.jpg', image)
        return StreamingResponse(iter([img_encoded.tobytes()]), media_type="image/jpeg")
        
    except Exception as e:
        logging.error(f"Error in analyze_frame: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/analyze_frame_json", response_model=AnalysisResponse)
async def analyze_frame_json(file: UploadFile = File(...)):
    """Analyze posture from frame and return JSON results."""
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image format")

        height, width = image.shape[:2]
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = analyzer.pose.process(image_rgb)

        if not results.pose_landmarks:
            return AnalysisResponse(
                analysis=PostureAnalysisResult(
                    score=0,
                    grade="F",
                    issues=["No pose detected"],
                    detailed_issues={},
                    angles={},
                    measurements={},
                    recommendations=["Ensure full body is visible and well-lit"]
                ),
                session_stats=SessionStats(),
                posture_history=[],
                angle_history={}
            )

        landmarks = analyzer.extract_landmarks(results.pose_landmarks, width, height)
        analysis = analyzer.analyze_posture_comprehensive(landmarks)

        if analysis is not None:
            analyzer.posture_history.append(analysis.score)
            analyzer.update_session_stats(analysis)

        # Prepare session stats
        session_stats = SessionStats(
            duration=analyzer.session_stats.get('duration', '00:00:00'),
            average_score=analyzer.session_stats.get('average_score', 0.0),
            improvement_trend=analyzer.session_stats.get('improvement_trend', '0%'),
            start_time=analyzer.session_stats.get('start_time'),
            frame_count=analyzer.session_stats.get('frame_count', 0)
        )

        return AnalysisResponse(
            analysis=analysis,
            session_stats=session_stats,
            posture_history=list(analyzer.posture_history),
            angle_history={k: list(v) for k, v in analyzer.angle_history.items()}
        )
        
    except Exception as e:
        logging.error(f"Error in analyze_frame_json: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# User Management Endpoints
@api_router.get("/user/profile", response_model=User)
async def get_user_profile():
    """Get user profile information."""
    try:
        user = await database.get_user(DEMO_USER_ID)
        if not user:
            # Create demo user if doesn't exist
            demo_user = User(
                id=DEMO_USER_ID,
                name="Sarah Johnson",
                email="sarah@example.com",
                avatar="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
                notifications=3,
                current_streak=12,
                total_sessions=48
            )
            user = await database.create_user(demo_user)
        return user
    except Exception as e:
        logging.error(f"Database error in get_user_profile: {e}")
        # Return demo user data without database
        return User(
            id=DEMO_USER_ID,
            name="Sarah Johnson",
            email="sarah@example.com",
            avatar="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
            notifications=3,
            current_streak=12,
            total_sessions=48
        )

@api_router.get("/user/stats")
async def get_user_stats():
    """Get user statistics."""
    try:
        user = await database.get_user(DEMO_USER_ID)
        if not user:
            return {"error": "User not found"}
        
        sessions = await database.get_user_sessions(DEMO_USER_ID, days=30)
        
        return {
            "total_sessions": len(sessions),
            "current_streak": user.current_streak,
            "average_score": sum(s.score for s in sessions) / len(sessions) if sessions else 0,
            "best_score": max(s.score for s in sessions) if sessions else 0,
            "member_since": user.member_since
        }
    except Exception as e:
        logging.error(f"Database error in get_user_stats: {e}")
        # Return demo stats without database
        return {
            "total_sessions": 48,
            "current_streak": 12,
            "average_score": 85.5,
            "best_score": 95,
            "member_since": "2024-01-15"
        }

# Session Management Endpoints
@api_router.get("/sessions/history", response_model=List[Session])
async def get_session_history(days: int = 7):
    """Get user's session history."""
    return await database.get_user_sessions(DEMO_USER_ID, days)

@api_router.get("/sessions/latest", response_model=Optional[Session])
async def get_latest_session():
    """Get user's latest session."""
    return await database.get_latest_session(DEMO_USER_ID)

@api_router.post("/sessions", response_model=Session)
async def create_session(session_data: dict):
    """Create a new session record."""
    session = Session(
        user_id=DEMO_USER_ID,
        **session_data
    )
    return await database.create_session(session)

# Appointment Endpoints
@api_router.get("/appointments/upcoming", response_model=List[Appointment])
async def get_upcoming_appointments():
    """Get user's upcoming appointments."""
    return await database.get_user_appointments(DEMO_USER_ID)

@api_router.post("/appointments", response_model=Appointment)
async def create_appointment(appointment_data: dict):
    """Create a new appointment."""
    appointment = Appointment(
        user_id=DEMO_USER_ID,
        **appointment_data
    )
    return await database.create_appointment(appointment)

# Community Endpoints
@api_router.get("/community/posts", response_model=List[CommunityPost])
async def get_community_posts(limit: int = 20):
    """Get community posts."""
    return await database.get_community_posts(limit)

@api_router.post("/community/posts", response_model=CommunityPost)
async def create_community_post(post_data: dict):
    """Create a new community post."""
    post = CommunityPost(
        user_id=DEMO_USER_ID,
        **post_data
    )
    return await database.create_post(post)

@api_router.post("/community/posts/{post_id}/like")
async def like_post(post_id: str):
    """Like a community post."""
    success = await database.like_post(post_id)
    return {"success": success}

# Learning Resources Endpoints
@api_router.get("/resources", response_model=List[LearningResource])
async def get_learning_resources(resource_type: Optional[str] = None):
    """Get learning resources."""
    return await database.get_learning_resources(resource_type)

@api_router.get("/progress/chart")
async def get_progress_chart(days: int = 7):
    """Get progress chart data."""
    sessions = await database.get_user_sessions(DEMO_USER_ID, days)
    
    progress_data = []
    for session in sessions:
        progress_data.append({
            "date": session.date.isoformat(),
            "score": session.score,
            "session": session.session_type,
            "duration": session.duration,
            "grade": session.grade
        })
    
    return {
        "progress_data": progress_data,
        "summary": {
            "total_sessions": len(sessions),
            "average_score": sum(s.score for s in sessions) / len(sessions) if sessions else 0,
            "best_score": max(s.score for s in sessions) if sessions else 0,
            "improvement": "Positive" if len(sessions) >= 2 and sessions[0].score > sessions[-1].score else "Stable"
        }
    }

# Include the router in the main app
app.include_router(api_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )