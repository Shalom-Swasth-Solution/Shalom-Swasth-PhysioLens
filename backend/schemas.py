from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime

class PostureAnalysisResult(BaseModel):
    score: int = Field(..., ge=0, le=100, description="Posture score from 0-100")
    grade: str = Field(..., description="Letter grade (A+, A, B+, B, C+, C, D, F)")
    issues: List[str] = Field(default=[], description="List of detected posture issues")
    detailed_issues: Dict[str, Any] = Field(default={}, description="Detailed analysis of issues")
    angles: Dict[str, float] = Field(default={}, description="Body angle measurements")
    measurements: Dict[str, Any] = Field(default={}, description="Body measurements")
    recommendations: List[str] = Field(default=[], description="Improvement recommendations")

class SessionStats(BaseModel):
    duration: str = Field(default="00:00:00", description="Session duration")
    average_score: float = Field(default=0.0, description="Average posture score")
    improvement_trend: str = Field(default="0%", description="Improvement percentage")
    start_time: Optional[datetime] = Field(default=None, description="Session start time")
    frame_count: int = Field(default=0, description="Number of frames analyzed")

class AnalysisResponse(BaseModel):
    analysis: PostureAnalysisResult
    session_stats: SessionStats
    posture_history: List[float] = Field(default=[], description="Historical posture scores")
    angle_history: Dict[str, List[float]] = Field(default={}, description="Historical angle measurements")

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    avatar: Optional[str] = None
    notifications: int = Field(default=0)
    current_streak: int = Field(default=0)
    total_sessions: int = Field(default=0)
    member_since: datetime = Field(default_factory=datetime.utcnow)

class Session(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    date: datetime = Field(default_factory=datetime.utcnow)
    duration: str
    score: int
    grade: str
    improvements: List[str] = Field(default=[])
    issues: List[str] = Field(default=[])
    angles: Dict[str, float] = Field(default={})
    session_type: str = Field(default="Real-time Analysis")

class Appointment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    date: str
    time: str
    doctor: str
    appointment_type: str
    location: str
    status: str = Field(default="scheduled")

class CommunityPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    author: str
    avatar: str
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    likes: int = Field(default=0)
    comments: int = Field(default=0)

class LearningResource(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    resource_type: str
    duration: str
    thumbnail: str
    description: Optional[str] = None
    content_url: Optional[str] = None