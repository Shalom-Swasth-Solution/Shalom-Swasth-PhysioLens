import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Square, Play, Pause, RotateCcw, ArrowLeft, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { mockAnalysisResults } from '../data/mock';

const CameraAnalysisPage = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);
  const [cameraStatus, setCameraStatus] = useState('requesting'); // requesting, active, error
  const [showSkeleton, setShowSkeleton] = useState(true); // Toggle for skeleton overlay
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // For displaying skeleton overlay
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const skeletonIntervalRef = useRef(null);

  const BACKEND_URL = 'http://localhost:8000';

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      console.log('Initializing camera...');
      setCameraStatus('requesting');
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      console.log('Camera stream obtained:', stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          setCameraStatus('active');
        };
        
        videoRef.current.onerror = (e) => {
          console.error('Video error:', e);
          setError('Video playback error');
          setCameraStatus('error');
        };
      } else {
        console.error('Video ref not available');
        setError('Video element not found');
        setCameraStatus('error');
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError(`Unable to access camera: ${err.message}`);
      setCameraStatus('error');
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraStatus('requesting');
  }, []);

  // Capture and display skeleton overlay
  const updateSkeletonOverlay = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || cameraStatus !== 'active') return;

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (showSkeleton) {
        // Create blob for analysis
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(video, 0, 0);
        
        tempCanvas.toBlob(async (blob) => {
          if (!blob) return;
          
          const formData = new FormData();
          formData.append('file', blob, 'frame.jpg');
          
          try {
            // Get annotated image with skeleton from backend
            const response = await fetch(`${BACKEND_URL}/api/analyze_frame`, {
              method: 'POST',
              body: formData,
            });
            
            if (response.ok) {
              const imageBlob = await response.blob();
              const imageUrl = URL.createObjectURL(imageBlob);
              const img = new Image();
              
              img.onload = () => {
                // Draw the annotated image (with skeleton) on canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                URL.revokeObjectURL(imageUrl);
              };
              
              img.src = imageUrl;
            }
          } catch (err) {
            console.error('Skeleton overlay error:', err);
          }
        }, 'image/jpeg', 0.8);
      }
    } catch (err) {
      console.error('Skeleton update error:', err);
    }
  }, [cameraStatus, BACKEND_URL, showSkeleton]);

  // Start skeleton overlay updates
  const startSkeletonOverlay = useCallback(() => {
    if (cameraStatus !== 'active') return;
    
    // Update skeleton overlay every 200ms for smooth visualization
    skeletonIntervalRef.current = setInterval(updateSkeletonOverlay, 200);
  }, [cameraStatus, updateSkeletonOverlay]);

  // Stop skeleton overlay updates
  const stopSkeletonOverlay = useCallback(() => {
    if (skeletonIntervalRef.current) {
      clearInterval(skeletonIntervalRef.current);
      skeletonIntervalRef.current = null;
    }
    
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, []);
  const analyzeFrame = useCallback(async () => {
    if (!videoRef.current || cameraStatus !== 'active') return;

    try {
      // Create canvas to capture frame
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const formData = new FormData();
        formData.append('file', blob, 'frame.jpg');
        
        try {
          // Connect to real backend API
          const response = await fetch(`${BACKEND_URL}/api/analyze_frame_json`, {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
          }
          
          const data = await response.json();
          setAnalysisData(data);
          setError(null);
        } catch (err) {
          console.error('Analysis error:', err);
          // Fallback to mock data if API fails
          const mockData = {
            analysis: mockAnalysisResults,
            session_stats: mockAnalysisResults.sessionStats,
            posture_history: [85, 87, 89, 88, 90, 89],
            angle_history: {
              neck: [15, 14, 12, 13, 12],
              shoulder: [165, 167, 168, 166, 168],
              hip: [175, 176, 175, 177, 175]
            }
          };
          setAnalysisData(mockData);
          setError('Using demo data - Backend connection failed');
        }
      }, 'image/jpeg', 0.8);
      
    } catch (err) {
      console.error('Frame capture error:', err);
      setError('Failed to capture frame for analysis.');
    }
  }, [cameraStatus, BACKEND_URL]);

  // Start real-time analysis
  const startAnalysis = useCallback(() => {
    if (cameraStatus !== 'active') return;
    
    setIsAnalyzing(true);
    setError(null);
    
    // Start skeleton overlay
    startSkeletonOverlay();
    
    // Analyze every 2 seconds to avoid overwhelming the API
    intervalRef.current = setInterval(analyzeFrame, 2000);
  }, [cameraStatus, analyzeFrame, startSkeletonOverlay]);

  // Stop analysis
  const stopAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Stop skeleton overlay
    stopSkeletonOverlay();
  }, [stopSkeletonOverlay]);

  // Reset session
  const resetSession = useCallback(() => {
    stopAnalysis();
    setAnalysisData(null);
    setError(null);
  }, [stopAnalysis]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAnalysis();
      stopCamera();
    };
  }, [stopAnalysis, stopCamera]);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Real-time Posture Analysis</h1>
            </div>
            
            <Badge variant={cameraStatus === 'active' ? 'default' : 'secondary'} className="text-sm">
              {cameraStatus === 'active' ? 'Camera Active' : 'Camera Inactive'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Live Camera Feed</span>
                </CardTitle>
                <CardDescription>
                  Position yourself in front of the camera for real-time posture analysis
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Camera Display with Skeleton Overlay */}
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                  {/* Video Element - Always render but control visibility */}
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-full h-full object-cover ${cameraStatus === 'active' ? 'block' : 'hidden'}`}
                  />
                  
                  {/* Skeleton Overlay Canvas */}
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{ 
                      mixBlendMode: showSkeleton ? 'normal' : 'multiply',
                      opacity: showSkeleton ? 1 : 0 
                    }}
                  />
                  
                  {/* Placeholder - Show when camera is not active */}
                  {cameraStatus !== 'active' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Camera not active</p>
                        <p className="text-sm">Click "Start Camera" to begin</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Analysis Status Overlay */}
                  {isAnalyzing && (
                    <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Analyzing...</span>
                    </div>
                  )}
                  
                  {/* Score Overlay */}
                  {analysisData?.analysis && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(analysisData.analysis.score).split(' ')[0]}`}>
                          {analysisData.analysis.score}
                        </div>
                        <div className="text-xs text-gray-600">Posture Score</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Display */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Camera Controls */}
                <div className="flex flex-wrap gap-3">
                  {cameraStatus !== 'active' ? (
                    <Button onClick={initializeCamera} className="bg-blue-600 hover:bg-blue-700">
                      <Camera className="w-4 h-4 mr-2" />
                      Start Camera
                    </Button>
                  ) : (
                    <>
                      <Button onClick={stopCamera} variant="outline">
                        <Square className="w-4 h-4 mr-2" />
                        Stop Camera
                      </Button>
                      
                      {!isAnalyzing ? (
                        <Button onClick={startAnalysis} className="bg-green-600 hover:bg-green-700">
                          <Play className="w-4 h-4 mr-2" />
                          Start Analysis
                        </Button>
                      ) : (
                        <Button onClick={stopAnalysis} variant="outline">
                          <Pause className="w-4 h-4 mr-2" />
                          Pause Analysis
                        </Button>
                      )}
                      
                      <Button onClick={resetSession} variant="outline">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset Session
                      </Button>
                      
                      {/* Skeleton Toggle */}
                      <Button 
                        onClick={() => setShowSkeleton(!showSkeleton)} 
                        variant={showSkeleton ? "default" : "outline"}
                        className={showSkeleton ? "bg-purple-600 hover:bg-purple-700" : ""}
                      >
                        {showSkeleton ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                        {showSkeleton ? 'Hide' : 'Show'} Skeleton
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">
            {/* Current Score */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Current Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {analysisData?.analysis ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${getScoreColor(analysisData.analysis.score).split(' ')[0]}`}>
                        {analysisData.analysis.score}
                      </div>
                      <Badge className={getScoreColor(analysisData.analysis.score)}>
                        Grade: {analysisData.analysis.grade}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Issues Detected:</h4>
                        <ul className="space-y-1">
                          {analysisData.analysis.issues.map((issue, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <span className="text-orange-500 mr-2">•</span>
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Recommendations:</h4>
                        <ul className="space-y-1">
                          {analysisData.analysis.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start analysis to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Session Stats */}
            {analysisData?.session_stats && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Session Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Duration</span>
                      <span className="font-medium">{analysisData.session_stats.duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Score</span>
                      <span className="font-medium">{analysisData.session_stats.averageScore}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Improvement</span>
                      <span className={`font-medium ${
                        analysisData.session_stats.improvementTrend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {analysisData.session_stats.improvementTrend}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Angle Measurements */}
            {analysisData?.analysis?.angles && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Angle Measurements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analysisData.analysis.angles).map(([angle, value]) => (
                      <div key={angle} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 capitalize">{angle.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-medium">{value}°</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraAnalysisPage;