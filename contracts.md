# API Contracts & Integration Plan

## Overview
This document outlines the API contracts, mock data replacements, and backend integration strategy for the PhysioLens physiotherapy platform.

## Frontend Mock Data (Currently Implemented)
The frontend currently uses mock data from `/app/frontend/src/data/mock.js` for:
- User profile information
- Progress tracking data 
- Recent activity and session history
- Community posts and learning resources
- Real-time analysis results

## API Endpoints Required

### 1. Real-time Posture Analysis
**Existing Backend Endpoints:**
```
POST /api/analyze_frame
POST /api/analyze_frame_json
POST /api/analyze
```

**Frontend Integration:**
- Camera feed will send frames to `/api/analyze_frame_json`
- Results will replace `mockAnalysisResults` in real-time
- Session statistics will be updated continuously

### 2. User Management
**Required Endpoints:**
```
GET /api/user/profile
PUT /api/user/profile
GET /api/user/stats
```

**Mock Data to Replace:**
- `mockUser` object (name, avatar, notifications, streak, total sessions)

### 3. Progress Tracking
**Required Endpoints:**
```
GET /api/sessions/history?days=7
POST /api/sessions
GET /api/progress/stats
```

**Mock Data to Replace:**
- `mockProgressData` array (7-day posture scores)
- Session statistics and improvement trends

### 4. Recent Activity
**Required Endpoints:**
```
GET /api/sessions/latest
GET /api/appointments/upcoming
POST /api/appointments
```

**Mock Data to Replace:**
- `mockRecentActivity.lastSession` (latest session summary)
- `mockRecentActivity.upcomingAppointments` (scheduled appointments)

### 5. Community Features  
**Required Endpoints:**
```
GET /api/community/posts
POST /api/community/posts
GET /api/community/posts/:id/like
GET /api/community/posts/:id/comments
```

**Mock Data to Replace:**
- `mockCommunityPosts` array (user posts and interactions)

### 6. Learning Resources
**Required Endpoints:**
```
GET /api/resources/articles
GET /api/resources/videos
GET /api/resources/learning-paths
```

**Mock Data to Replace:**
- `mockLearningResources` array (articles, videos, exercise plans)

## Camera Integration Strategy

### Current Implementation
The camera page (`/app/frontend/src/pages/CameraAnalysisPage.jsx`) includes:
- WebRTC camera access using `navigator.mediaDevices.getUserMedia()`
- Frame capture using HTML5 Canvas
- Mock data simulation for analysis results
- Real-time analysis loop (every 2 seconds)

### Backend Integration Steps
1. Replace mock analysis with actual API calls to existing endpoints
2. Handle file upload for frame analysis 
3. Process streaming responses for real-time updates
4. Implement session management and statistics tracking

## Environment Variables
**Frontend (.env):**
```
REACT_APP_BACKEND_URL=<configured_backend_url>
```

**Backend (.env):**
```
MONGO_URL=<configured_mongodb_url>
```

## Data Models

### PostureAnalysis
```javascript
{
  score: number,           // 0-100 posture score
  grade: string,          // A+, A, B+, B, C+, C, D, F
  issues: string[],       // Detected posture problems
  recommendations: string[], // Improvement suggestions
  angles: {               // Body angle measurements
    neckAngle: number,
    shoulderAngle: number,
    hipAngle: number,
    kneeAngle: number
  },
  sessionStats: {
    duration: string,
    averageScore: number,
    improvementTrend: string
  }
}
```

### User
```javascript
{
  id: string,
  name: string,
  avatar: string,
  email: string,
  notifications: number,
  currentStreak: number,
  totalSessions: number,
  memberSince: date
}
```

### Session
```javascript
{
  id: string,
  userId: string,
  date: date,
  duration: string,
  score: number,
  grade: string,
  improvements: string[],
  issues: string[],
  angles: object,
  type: string // "Real-time Analysis", "3D Analysis", etc.
}
```

## Integration Priority
1. **Phase 1:** Real-time camera analysis integration
2. **Phase 2:** User authentication and profile management
3. **Phase 3:** Progress tracking and session history
4. **Phase 4:** Community features and learning resources

## Testing Requirements
- Backend API endpoint testing
- Camera functionality across different browsers
- Real-time analysis performance optimization
- Mobile responsiveness validation