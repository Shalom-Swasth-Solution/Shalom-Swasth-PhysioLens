import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Camera, Square, AlertCircle, CheckCircle } from 'lucide-react';

const CameraTest = () => {
  const [cameraStatus, setCameraStatus] = useState('idle'); // idle, requesting, active, error
  const [error, setError] = useState(null);
  const [streamInfo, setStreamInfo] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      setCameraStatus('requesting');
      setError(null);
      
      console.log('Requesting camera access...');
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
        setCameraStatus('active');
        
        // Get stream info
        const videoTrack = stream.getVideoTracks()[0];
        const settings = videoTrack.getSettings();
        setStreamInfo({
          width: settings.width,
          height: settings.height,
          frameRate: settings.frameRate,
          deviceId: settings.deviceId
        });
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError(`Camera error: ${err.message}`);
      setCameraStatus('error');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log('Stopping track:', track);
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraStatus('idle');
    setStreamInfo(null);
  };

  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/health');
      const data = await response.json();
      alert(`Backend Status: ${JSON.stringify(data, null, 2)}`);
    } catch (err) {
      alert(`Backend Error: ${err.message}`);
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Camera Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Display */}
          <div className="flex items-center gap-2">
            {cameraStatus === 'active' && <CheckCircle className="h-5 w-5 text-green-600" />}
            {cameraStatus === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
            <span className="font-medium">
              Status: {cameraStatus.charAt(0).toUpperCase() + cameraStatus.slice(1)}
            </span>
          </div>

          {/* Error Display */}
          {error && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Stream Info */}
          {streamInfo && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium mb-2">Stream Information:</h4>
              <div className="text-sm space-y-1">
                <p>Resolution: {streamInfo.width} x {streamInfo.height}</p>
                <p>Frame Rate: {streamInfo.frameRate} fps</p>
                <p>Device ID: {streamInfo.deviceId?.substring(0, 20)}...</p>
              </div>
            </div>
          )}

          {/* Video Element */}
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full max-w-md mx-auto border rounded-lg"
              style={{ display: cameraStatus === 'active' ? 'block' : 'none' }}
            />
            {cameraStatus !== 'active' && (
              <div className="w-full max-w-md mx-auto h-64 bg-gray-100 border rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Camera preview will appear here</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button
              onClick={startCamera}
              disabled={cameraStatus === 'requesting'}
              className="flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Start Camera
            </Button>
            
            <Button
              onClick={stopCamera}
              disabled={cameraStatus !== 'active'}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              Stop Camera
            </Button>

            <Button
              onClick={testBackendConnection}
              variant="outline"
            >
              Test Backend
            </Button>
          </div>

          {/* Debug Info */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium mb-2">Debug Information:</h4>
            <div className="text-sm space-y-1">
              <p>User Agent: {navigator.userAgent}</p>
              <p>HTTPS: {window.location.protocol === 'https:' ? 'Yes' : 'No'}</p>
              <p>MediaDevices: {navigator.mediaDevices ? 'Available' : 'Not Available'}</p>
              <p>getUserMedia: {navigator.mediaDevices?.getUserMedia ? 'Available' : 'Not Available'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraTest; 