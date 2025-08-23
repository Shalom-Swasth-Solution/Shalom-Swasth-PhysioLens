from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Dict, Any, Optional
import os
from datetime import datetime, timedelta
from schemas import User, Session, Appointment, CommunityPost, LearningResource
import logging

class Database:
    def __init__(self, mongo_url: str, db_name: str):
        self.client = AsyncIOMotorClient(mongo_url)
        self.db = self.client[db_name]
        
    async def close(self):
        self.client.close()
    
    # User operations
    async def create_user(self, user: User) -> User:
        try:
            await self.db.users.insert_one(user.dict())
            return user
        except Exception as e:
            logging.error(f"Database error in create_user: {e}")
            return user  # Return user even if database fails
    
    async def get_user(self, user_id: str) -> Optional[User]:
        try:
            user_data = await self.db.users.find_one({"id": user_id})
            return User(**user_data) if user_data else None
        except Exception as e:
            logging.error(f"Database error in get_user: {e}")
            return None
    
    async def update_user(self, user_id: str, updates: Dict[str, Any]) -> bool:
        try:
            result = await self.db.users.update_one({"id": user_id}, {"$set": updates})
            return result.modified_count > 0
        except Exception as e:
            logging.error(f"Database error in update_user: {e}")
            return False
    
    # Session operations
    async def create_session(self, session: Session) -> Session:
        try:
            await self.db.sessions.insert_one(session.dict())
            return session
        except Exception as e:
            logging.error(f"Database error in create_session: {e}")
            return session
    
    async def get_user_sessions(self, user_id: str, days: int = 7) -> List[Session]:
        try:
            start_date = datetime.utcnow() - timedelta(days=days)
            sessions_data = await self.db.sessions.find({
                "user_id": user_id,
                "date": {"$gte": start_date}
            }).sort("date", -1).to_list(100)
            return [Session(**session) for session in sessions_data]
        except Exception as e:
            logging.error(f"Database error in get_user_sessions: {e}")
            return []
    
    async def get_latest_session(self, user_id: str) -> Optional[Session]:
        try:
            session_data = await self.db.sessions.find_one(
                {"user_id": user_id},
                sort=[("date", -1)]
            )
            return Session(**session_data) if session_data else None
        except Exception as e:
            logging.error(f"Database error in get_latest_session: {e}")
            return None
    
    # Appointment operations
    async def create_appointment(self, appointment: Appointment) -> Appointment:
        await self.db.appointments.insert_one(appointment.dict())
        return appointment
    
    async def get_user_appointments(self, user_id: str) -> List[Appointment]:
        appointments_data = await self.db.appointments.find({
            "user_id": user_id,
            "status": {"$ne": "cancelled"}
        }).sort("date", 1).to_list(50)
        return [Appointment(**appointment) for appointment in appointments_data]
    
    # Community operations
    async def create_post(self, post: CommunityPost) -> CommunityPost:
        await self.db.community_posts.insert_one(post.dict())
        return post
    
    async def get_community_posts(self, limit: int = 20) -> List[CommunityPost]:
        posts_data = await self.db.community_posts.find().sort("timestamp", -1).limit(limit).to_list(limit)
        return [CommunityPost(**post) for post in posts_data]
    
    async def like_post(self, post_id: str) -> bool:
        result = await self.db.community_posts.update_one(
            {"id": post_id},
            {"$inc": {"likes": 1}}
        )
        return result.modified_count > 0
    
    # Learning resources operations
    async def get_learning_resources(self, resource_type: Optional[str] = None) -> List[LearningResource]:
        query = {"resource_type": resource_type} if resource_type else {}
        resources_data = await self.db.learning_resources.find(query).to_list(50)
        return [LearningResource(**resource) for resource in resources_data]
    
    async def create_learning_resource(self, resource: LearningResource) -> LearningResource:
        await self.db.learning_resources.insert_one(resource.dict())
        return resource

    # Initialize sample data
    async def init_sample_data(self):
        """Initialize database with sample data."""
        # Check if data already exists
        existing_users = await self.db.users.count_documents({})
        if existing_users > 0:
            return
        
        # Create sample user
        sample_user = User(
            name="Sarah Johnson",
            email="sarah@example.com",
            avatar="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
            notifications=3,
            current_streak=12,
            total_sessions=48
        )
        await self.create_user(sample_user)
        
        # Create sample sessions
        sample_sessions = [
            Session(
                user_id=sample_user.id,
                date=datetime.utcnow() - timedelta(days=i),
                duration=f"00:{15+i*2}:00",
                score=75 + i * 2,
                grade="B+" if 75 + i * 2 >= 80 else "B",
                improvements=["Better shoulder alignment"] if i % 2 == 0 else ["Improved core stability"],
                issues=["Slight forward head posture"] if i % 3 == 0 else [],
                angles={"neck_angle": 12 + i, "shoulder_angle": 168 + i},
                session_type="Real-time Analysis"
            ) for i in range(7)
        ]
        
        for session in sample_sessions:
            await self.create_session(session)
        
        # Create sample appointments
        sample_appointments = [
            Appointment(
                user_id=sample_user.id,
                date="2025-01-23",
                time="10:00 AM",
                doctor="Dr. Emily Chen",
                appointment_type="Follow-up Consultation",
                location="Virtual"
            ),
            Appointment(
                user_id=sample_user.id,
                date="2025-01-25",
                time="2:30 PM",
                doctor="Dr. Michael Rodriguez",
                appointment_type="Physical Assessment",
                location="Clinic Room 3A"
            )
        ]
        
        for appointment in sample_appointments:
            await self.create_appointment(appointment)
        
        # Create sample community posts
        sample_posts = [
            CommunityPost(
                user_id=sample_user.id,
                author="Alex Thompson",
                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                content="Just completed my 30-day posture challenge! My back pain has reduced significantly.",
                likes=24,
                comments=8
            ),
            CommunityPost(
                user_id=sample_user.id,
                author="Maria Garcia",
                avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
                content="The 3D analysis feature helped me identify issues I never knew I had. Game changer!",
                likes=18,
                comments=12
            )
        ]
        
        for post in sample_posts:
            await self.create_post(post)
        
        # Create sample learning resources
        sample_resources = [
            LearningResource(
                title="Understanding Forward Head Posture",
                resource_type="Article",
                duration="5 min read",
                thumbnail="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
                description="Learn about the causes and effects of forward head posture."
            ),
            LearningResource(
                title="Daily Desk Stretches",
                resource_type="Video",
                duration="12 minutes",
                thumbnail="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
                description="Simple stretches you can do at your desk."
            ),
            LearningResource(
                title="Core Strengthening Basics",
                resource_type="Exercise Plan",
                duration="Week program",
                thumbnail="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=200&fit=crop",
                description="Build a strong core for better posture."
            )
        ]
        
        for resource in sample_resources:
            await self.create_learning_resource(resource)