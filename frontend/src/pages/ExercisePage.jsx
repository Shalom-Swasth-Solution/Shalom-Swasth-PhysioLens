import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Play, Pause, ArrowLeft, Youtube } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const exercises = {
  shoulder_squeeze: {
    name: "Shoulder Blade Squeeze",
    videoId: "zwa7jKdtLAQ", 
  },
  neck_stretch: {
    name: "Neck Stretch",
    videoId: "H5h54Q0wpps",
  },
  squat: {
    name: "Squat",
    videoId: "xqvCmoLULNY"
  },
};

const ExercisePage = () => {
  const [selectedExercise, setSelectedExercise] = useState('shoulder_squeeze');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [feedback, setFeedback] = useState("Start the exercise to get feedback.");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setFeedback("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const currentExercise = exercises[selectedExercise];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Exercises</h1>
          <Button asChild variant="outline">
            <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Select onValueChange={setSelectedExercise} defaultValue={selectedExercise}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select an exercise" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(exercises).map(([key, { name }]) => (
                <SelectItem key={key} value={key}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: YouTube Tutorial */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Youtube className="w-5 h-5 mr-2 text-red-600" /> 
                Tutorial: {currentExercise.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentExercise.videoId}?autoplay=1&mute=1&loop=1&playlist=${currentExercise.videoId}&controls=0&modestbranding=1&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </CardContent>
          </Card>

          {/* Right Panel: Camera and Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="w-5 h-5 mr-2" /> Your Turn
              </CardTitle>
              <CardDescription>Follow the tutorial. We'll provide feedback on your form.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-black rounded-lg mb-4 relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full" />
                {!isCameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    Camera is off
                  </div>
                )}
              </div>
              <div className="flex gap-4 mb-4">
                {!isCameraActive ? (
                  <Button onClick={startCamera}><Play className="w-4 h-4 mr-2" /> Start Camera</Button>
                ) : (
                  <Button onClick={stopCamera} variant="destructive"><Pause className="w-4 h-4 mr-2" /> Stop Camera</Button>
                )}
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Feedback</h3>
                <p className="text-sm text-blue-800">{feedback}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ExercisePage;
