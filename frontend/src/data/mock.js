// Mock data for physiotherapy platform

export const mockUser = {
  name: "Sarah Johnson",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
  notifications: 3,
  currentStreak: 12,
  totalSessions: 48
};

export const mockProgressData = [
  { date: "2025-01-15", score: 75, session: "Morning Routine" },
  { date: "2025-01-16", score: 82, session: "Back Strengthening" },
  { date: "2025-01-17", score: 78, session: "Posture Check" },
  { date: "2025-01-18", score: 85, session: "Core Stability" },
  { date: "2025-01-19", score: 88, session: "Full Body Assessment" },
  { date: "2025-01-20", score: 91, session: "Balance Training" },
  { date: "2025-01-21", score: 89, session: "Flexibility Focus" }
];

export const mockRecentActivity = {
  lastSession: {
    date: "2025-01-21",
    duration: "25 minutes",
    score: 89,
    grade: "B+",
    improvements: ["Better shoulder alignment", "Improved core stability"],
    issues: ["Slight forward head posture"]
  },
  upcomingAppointments: [
    {
      id: 1,
      date: "2025-01-23",
      time: "10:00 AM",
      doctor: "Dr. Emily Chen",
      type: "Follow-up Consultation",
      location: "Virtual"
    },
    {
      id: 2,
      date: "2025-01-25", 
      time: "2:30 PM",
      doctor: "Dr. Michael Rodriguez",
      type: "Physical Assessment",
      location: "Clinic Room 3A"
    }
  ]
};

export const mockCommunityPosts = [
  {
    id: 1,
    author: "Alex Thompson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    content: "Just completed my 30-day posture challenge! My back pain has reduced significantly.",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 8
  },
  {
    id: 2,
    author: "Maria Garcia",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content: "The 3D analysis feature helped me identify issues I never knew I had. Game changer!",
    timestamp: "5 hours ago", 
    likes: 18,
    comments: 12
  }
];

export const mockLearningResources = [
  {
    id: 1,
    title: "Understanding Forward Head Posture",
    type: "Article",
    duration: "5 min read",
    thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop"
  },
  {
    id: 2,
    title: "Daily Desk Stretches",
    type: "Video",
    duration: "12 minutes",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop"
  },
  {
    id: 3,
    title: "Core Strengthening Basics",
    type: "Exercise Plan",
    duration: "Week program",
    thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=200&fit=crop"
  }
];

export const mockAnalysisResults = {
  score: 89,
  grade: "B+",
  issues: ["Slight forward head posture", "Minor shoulder elevation"],
  recommendations: [
    "Practice chin tucks throughout the day",
    "Strengthen neck extensors",
    "Regular shoulder blade squeezes"
  ],
  angles: {
    neckAngle: 12,
    shoulderAngle: 168,
    hipAngle: 175,
    kneeAngle: 180
  },
  sessionStats: {
    duration: "00:05:32",
    averageScore: 87,
    improvementTrend: "+3.2%"
  }
};