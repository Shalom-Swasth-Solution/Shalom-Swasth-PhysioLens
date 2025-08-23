import cv2
import numpy as np
import mediapipe as mp
import math
from collections import deque
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
from schemas import PostureAnalysisResult, SessionStats

class PostureAnalyzer:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            enable_segmentation=False,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Session tracking
        self.posture_history = deque(maxlen=100)
        self.angle_history = {
            'neck': deque(maxlen=50),
            'shoulder': deque(maxlen=50),
            'hip': deque(maxlen=50),
            'knee': deque(maxlen=50)
        }
        
        self.session_stats = {
            'start_time': datetime.utcnow(),
            'frame_count': 0,
            'average_score': 0.0,
            'improvement_trend': 0.0,
            'duration': '00:00:00'
        }

    def extract_landmarks(self, pose_landmarks, width: int, height: int) -> Dict[str, Tuple[float, float]]:
        """Extract key landmarks from MediaPipe pose detection."""
        landmarks = {}
        
        # Define key landmarks
        key_points = {
            'nose': self.mp_pose.PoseLandmark.NOSE,
            'left_ear': self.mp_pose.PoseLandmark.LEFT_EAR,
            'right_ear': self.mp_pose.PoseLandmark.RIGHT_EAR,
            'left_shoulder': self.mp_pose.PoseLandmark.LEFT_SHOULDER,
            'right_shoulder': self.mp_pose.PoseLandmark.RIGHT_SHOULDER,
            'left_elbow': self.mp_pose.PoseLandmark.LEFT_ELBOW,
            'right_elbow': self.mp_pose.PoseLandmark.RIGHT_ELBOW,
            'left_hip': self.mp_pose.PoseLandmark.LEFT_HIP,
            'right_hip': self.mp_pose.PoseLandmark.RIGHT_HIP,
            'left_knee': self.mp_pose.PoseLandmark.LEFT_KNEE,
            'right_knee': self.mp_pose.PoseLandmark.RIGHT_KNEE,
            'left_ankle': self.mp_pose.PoseLandmark.LEFT_ANKLE,
            'right_ankle': self.mp_pose.PoseLandmark.RIGHT_ANKLE
        }
        
        for name, landmark_id in key_points.items():
            landmark = pose_landmarks.landmark[landmark_id.value]
            landmarks[name] = (landmark.x * width, landmark.y * height)
            
        return landmarks

    def calculate_angle(self, point1: Tuple[float, float], point2: Tuple[float, float], 
                       point3: Tuple[float, float]) -> float:
        """Calculate angle between three points."""
        # Calculate vectors
        vector1 = np.array([point1[0] - point2[0], point1[1] - point2[1]])
        vector2 = np.array([point3[0] - point2[0], point3[1] - point2[1]])
        
        # Calculate angle using dot product
        dot_product = np.dot(vector1, vector2)
        magnitude1 = np.linalg.norm(vector1)
        magnitude2 = np.linalg.norm(vector2)
        
        if magnitude1 == 0 or magnitude2 == 0:
            return 0
            
        cos_angle = dot_product / (magnitude1 * magnitude2)
        cos_angle = np.clip(cos_angle, -1, 1)
        angle = np.arccos(cos_angle)
        
        return math.degrees(angle)

    def analyze_posture_comprehensive(self, landmarks: Dict[str, Tuple[float, float]]) -> Optional[PostureAnalysisResult]:
        """Comprehensive posture analysis."""
        try:
            issues = []
            detailed_issues = {}
            recommendations = []
            angles = {}
            measurements = {}
            
            # Calculate key angles
            # Neck angle (head tilt)
            if all(k in landmarks for k in ['nose', 'left_ear', 'right_ear', 'left_shoulder', 'right_shoulder']):
                ear_center = ((landmarks['left_ear'][0] + landmarks['right_ear'][0]) / 2,
                             (landmarks['left_ear'][1] + landmarks['right_ear'][1]) / 2)
                shoulder_center = ((landmarks['left_shoulder'][0] + landmarks['right_shoulder'][0]) / 2,
                                 (landmarks['left_shoulder'][1] + landmarks['right_shoulder'][1]) / 2)
                
                # Calculate forward head posture
                head_forward = abs(ear_center[0] - shoulder_center[0])
                vertical_distance = abs(ear_center[1] - shoulder_center[1])
                
                if vertical_distance > 0:
                    neck_angle = math.degrees(math.atan(head_forward / vertical_distance))
                    angles['neck_angle'] = round(neck_angle, 1)
                    
                    if neck_angle > 15:
                        issues.append("Forward head posture detected")
                        detailed_issues['forward_head'] = f"Head is {neck_angle:.1f}° forward"
                        recommendations.append("Practice chin tucks and neck strengthening exercises")

            # Shoulder alignment
            if 'left_shoulder' in landmarks and 'right_shoulder' in landmarks:
                shoulder_diff = abs(landmarks['left_shoulder'][1] - landmarks['right_shoulder'][1])
                shoulder_angle = math.degrees(math.atan2(shoulder_diff, 
                    abs(landmarks['left_shoulder'][0] - landmarks['right_shoulder'][0])))
                angles['shoulder_angle'] = round(180 - shoulder_angle, 1)
                
                if shoulder_diff > 20:  # pixels
                    issues.append("Uneven shoulder height")
                    detailed_issues['shoulder_imbalance'] = f"Shoulder height difference: {shoulder_diff:.1f}px"
                    recommendations.append("Focus on shoulder blade exercises and posture awareness")

            # Hip alignment
            if 'left_hip' in landmarks and 'right_hip' in landmarks:
                hip_diff = abs(landmarks['left_hip'][1] - landmarks['right_hip'][1])
                hip_angle = 180 - math.degrees(math.atan2(hip_diff,
                    abs(landmarks['left_hip'][0] - landmarks['right_hip'][0])))
                angles['hip_angle'] = round(hip_angle, 1)
                
                if hip_diff > 15:
                    issues.append("Hip misalignment detected")
                    detailed_issues['hip_tilt'] = f"Hip height difference: {hip_diff:.1f}px"
                    recommendations.append("Strengthen core muscles and practice pelvic tilts")

            # Knee alignment
            if all(k in landmarks for k in ['left_hip', 'left_knee', 'left_ankle']):
                knee_angle = self.calculate_angle(landmarks['left_hip'], landmarks['left_knee'], landmarks['left_ankle'])
                angles['knee_angle'] = round(knee_angle, 1)
                
                if knee_angle < 160:
                    issues.append("Knee flexion while standing")
                    detailed_issues['knee_bend'] = f"Knee angle: {knee_angle:.1f}°"
                    recommendations.append("Focus on standing posture and leg strengthening")

            # Overall spinal alignment
            if all(k in landmarks for k in ['nose', 'left_shoulder', 'right_shoulder', 'left_hip', 'right_hip']):
                head_center = landmarks['nose']
                shoulder_center = ((landmarks['left_shoulder'][0] + landmarks['right_shoulder'][0]) / 2,
                                 (landmarks['left_shoulder'][1] + landmarks['right_shoulder'][1]) / 2)
                hip_center = ((landmarks['left_hip'][0] + landmarks['right_hip'][0]) / 2,
                             (landmarks['left_hip'][1] + landmarks['right_hip'][1]) / 2)
                
                # Check vertical alignment
                head_hip_offset = abs(head_center[0] - hip_center[0])
                shoulder_hip_offset = abs(shoulder_center[0] - hip_center[0])
                
                measurements['head_hip_offset'] = head_hip_offset
                measurements['shoulder_hip_offset'] = shoulder_hip_offset
                
                if head_hip_offset > 30:
                    issues.append("Poor overall spinal alignment")
                    recommendations.append("Focus on whole-body postural awareness")

            # Calculate overall score
            score = self.calculate_posture_score(angles, measurements, len(issues))
            grade = self.get_posture_grade(score)
            
            # Update tracking data
            self.posture_history.append(score)
            for angle_name, angle_value in angles.items():
                if angle_name.replace('_angle', '') in self.angle_history:
                    self.angle_history[angle_name.replace('_angle', '')].append(angle_value)
            
            # Add generic recommendations if no specific issues found
            if not recommendations:
                recommendations = [
                    "Maintain current good posture",
                    "Regular movement breaks recommended",
                    "Continue monitoring posture throughout the day"
                ]

            return PostureAnalysisResult(
                score=score,
                grade=grade,
                issues=issues,
                detailed_issues=detailed_issues,
                angles=angles,
                measurements=measurements,
                recommendations=recommendations
            )
            
        except Exception as e:
            print(f"Error in posture analysis: {e}")
            return None

    def calculate_posture_score(self, angles: Dict[str, float], measurements: Dict[str, float], 
                               issue_count: int) -> int:
        """Calculate overall posture score based on measurements and issues."""
        base_score = 100
        
        # Deduct points for issues
        base_score -= (issue_count * 15)
        
        # Angle-based deductions
        if 'neck_angle' in angles:
            neck_penalty = max(0, (angles['neck_angle'] - 10) * 2)
            base_score -= neck_penalty
            
        if 'shoulder_angle' in angles:
            shoulder_penalty = max(0, abs(angles['shoulder_angle'] - 180) * 0.5)
            base_score -= shoulder_penalty
            
        if 'knee_angle' in angles and angles['knee_angle'] < 170:
            knee_penalty = (170 - angles['knee_angle']) * 0.5
            base_score -= knee_penalty
        
        # Ensure score is within valid range
        return max(0, min(100, int(base_score)))

    def get_posture_grade(self, score: int) -> str:
        """Convert numeric score to letter grade."""
        if score >= 95:
            return "A+"
        elif score >= 90:
            return "A"
        elif score >= 85:
            return "B+"
        elif score >= 80:
            return "B"
        elif score >= 75:
            return "C+"
        elif score >= 70:
            return "C"
        elif score >= 60:
            return "D"
        else:
            return "F"

    def update_session_stats(self, analysis_result: PostureAnalysisResult):
        """Update session statistics."""
        self.session_stats['frame_count'] += 1
        
        # Calculate average score
        if self.posture_history:
            self.session_stats['average_score'] = sum(self.posture_history) / len(self.posture_history)
        
        # Calculate duration
        current_time = datetime.utcnow()
        duration = current_time - self.session_stats['start_time']
        self.session_stats['duration'] = str(duration).split('.')[0]  # Remove microseconds
        
        # Calculate improvement trend
        if len(self.posture_history) >= 10:
            recent_avg = sum(list(self.posture_history)[-5:]) / 5
            earlier_avg = sum(list(self.posture_history)[-10:-5]) / 5
            improvement = ((recent_avg - earlier_avg) / earlier_avg) * 100
            self.session_stats['improvement_trend'] = f"{improvement:+.1f}%"

    def draw_enhanced_skeleton(self, image: np.ndarray, landmarks: Dict[str, Tuple[float, float]]):
        """Draw enhanced skeleton with posture indicators."""
        # Define connections with different colors for different body parts
        head_connections = [
            ('nose', 'left_ear'),
            ('nose', 'right_ear')
        ]
        
        torso_connections = [
            ('left_shoulder', 'right_shoulder'),
            ('left_shoulder', 'left_hip'),
            ('right_shoulder', 'right_hip'),
            ('left_hip', 'right_hip')
        ]
        
        arm_connections = [
            ('left_shoulder', 'left_elbow'),
            ('right_shoulder', 'right_elbow'),
            ('left_elbow', 'left_wrist') if 'left_wrist' in landmarks else None,
            ('right_elbow', 'right_wrist') if 'right_wrist' in landmarks else None
        ]
        
        leg_connections = [
            ('left_hip', 'left_knee'),
            ('right_hip', 'right_knee'),
            ('left_knee', 'left_ankle'),
            ('right_knee', 'right_ankle')
        ]
        
        # Draw connections with different colors
        def draw_connections(connections, color, thickness=3):
            for connection in connections:
                if connection is None:
                    continue
                start, end = connection
                if start in landmarks and end in landmarks:
                    start_point = tuple(map(int, landmarks[start]))
                    end_point = tuple(map(int, landmarks[end]))
                    cv2.line(image, start_point, end_point, color, thickness)
        
        # Draw different body parts with different colors
        draw_connections(head_connections, (255, 255, 0), 2)  # Yellow for head
        draw_connections(torso_connections, (0, 255, 0), 4)   # Green for torso
        draw_connections(arm_connections, (255, 0, 255), 3)   # Magenta for arms  
        draw_connections(leg_connections, (0, 255, 255), 3)   # Cyan for legs
        
        # Draw key points with different sizes and colors
        key_points = {
            'nose': ((255, 255, 255), 6),           # White nose
            'left_ear': ((255, 255, 0), 5),        # Yellow ears
            'right_ear': ((255, 255, 0), 5),
            'left_shoulder': ((0, 255, 0), 8),     # Green shoulders
            'right_shoulder': ((0, 255, 0), 8),
            'left_elbow': ((255, 0, 255), 6),      # Magenta elbows
            'right_elbow': ((255, 0, 255), 6),
            'left_hip': ((0, 255, 255), 8),        # Cyan hips
            'right_hip': ((0, 255, 255), 8),
            'left_knee': ((0, 255, 255), 6),       # Cyan knees
            'right_knee': ((0, 255, 255), 6),
            'left_ankle': ((0, 255, 255), 6),      # Cyan ankles
            'right_ankle': ((0, 255, 255), 6)
        }
        
        for name, (x, y) in landmarks.items():
            if name in key_points:
                color, radius = key_points[name]
                cv2.circle(image, (int(x), int(y)), radius, color, -1)
                # Add small black outline for better visibility
                cv2.circle(image, (int(x), int(y)), radius + 1, (0, 0, 0), 2)

    def draw_enhanced_ui(self, image: np.ndarray, analysis_result: PostureAnalysisResult, 
                        frame_stats: Dict):
        """Draw enhanced UI overlay on the image."""
        height, width = image.shape[:2]
        
        # Create semi-transparent overlays
        overlay = image.copy()
        
        # Draw main score display (top-left)
        score_text = f"POSTURE SCORE: {analysis_result.score}/100"
        grade_text = f"GRADE: {analysis_result.grade}"
        
        # Score background - larger and more prominent
        cv2.rectangle(overlay, (10, 10), (400, 120), (0, 0, 0), -1)
        cv2.addWeighted(overlay, 0.8, image, 0.2, 0, image)
        
        # Score text - larger and brighter
        cv2.putText(image, score_text, (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 0), 3)
        cv2.putText(image, grade_text, (20, 90), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 255), 2)
        
        # Draw detailed measurements (left side)
        if analysis_result.angles:
            y_offset = 140
            cv2.rectangle(overlay, (10, y_offset - 10), (320, y_offset + len(analysis_result.angles) * 35 + 10), (0, 0, 0), -1)
            cv2.addWeighted(overlay, 0.7, image, 0.3, 0, image)
            
            for angle_name, angle_value in analysis_result.angles.items():
                display_name = angle_name.replace('_', ' ').title()
                angle_text = f"{display_name}: {angle_value} deg"
                cv2.putText(image, angle_text, (20, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
                y_offset += 30
        
        # Draw issues on the right side - more prominent
        if analysis_result.issues:
            issues_title = "POSTURE ISSUES:"
            cv2.rectangle(overlay, (width - 350, 10), (width - 10, 60), (0, 0, 0), -1)
            cv2.addWeighted(overlay, 0.8, image, 0.2, 0, image)
            cv2.putText(image, issues_title, (width - 340, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
            
            y_offset = 80
            for i, issue in enumerate(analysis_result.issues[:4]):  # Show up to 4 issues
                # Issue background
                text_size = cv2.getTextSize(issue, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2)[0]
                cv2.rectangle(overlay, (width - 350, y_offset - 15), (width - 10, y_offset + 15), (0, 0, 100), -1)
                cv2.addWeighted(overlay, 0.7, image, 0.3, 0, image)
                
                cv2.putText(image, f"• {issue}", (width - 340, y_offset), 
                          cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
                y_offset += 35
        else:
            # Show excellent posture message
            excellent_text = "??? EXCELLENT POSTURE!"
            cv2.rectangle(overlay, (width - 300, 10), (width - 10, 50), (0, 100, 0), -1)
            cv2.addWeighted(overlay, 0.8, image, 0.2, 0, image)
            cv2.putText(image, excellent_text, (width - 290, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        
        # Session statistics (bottom-left)
        if hasattr(self, 'session_stats') and self.session_stats:
            stats_bg_height = 120
            cv2.rectangle(overlay, (10, height - stats_bg_height - 10), (300, height - 10), (0, 0, 0), -1)
            cv2.addWeighted(overlay, 0.7, image, 0.3, 0, image)
            
            cv2.putText(image, "SESSION STATS:", (20, height - 90), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
            
            duration = self.session_stats.get('duration', '00:00:00')
            frames = self.session_stats.get('frame_count', 0)
            avg_score = self.session_stats.get('average_score', 0)
            
            cv2.putText(image, f"Session Time: {duration}", (20, height - 65), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
            cv2.putText(image, f"Frames: {frames}", (20, height - 45), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
            cv2.putText(image, f"Avg Score: {avg_score:.0f}", (20, height - 25), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        
        # FPS display (top-right corner)
        if 'fps' in frame_stats:
            fps_text = f"FPS: {frame_stats['fps']:.1f}"
            fps_size = cv2.getTextSize(fps_text, cv2.FONT_HERSHEY_SIMPLEX, 0.8, 2)[0]
            cv2.rectangle(overlay, (width - fps_size[0] - 20, 10), (width - 10, 50), (0, 0, 0), -1)
            cv2.addWeighted(overlay, 0.8, image, 0.2, 0, image)
            cv2.putText(image, fps_text, (width - fps_size[0] - 15, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)