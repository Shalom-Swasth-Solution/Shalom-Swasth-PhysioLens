import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CameraAnalysisPage from "./pages/CameraAnalysisPage";
import ApiTestPage from "./pages/ApiTestPage";
import CameraTest from "./components/CameraTest";
import { Toaster } from "./components/ui/toaster";
import ApiStatus from "./components/ApiStatus";
import ExercisePage from "./pages/ExercisePage"; // Added import

function App() {
  return (
    <div className="App">
      <ApiStatus />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analysis/realtime" element={<CameraAnalysisPage />} />
          <Route path="/api-test" element={<ApiTestPage />} />
          <Route path="/camera-test" element={<CameraTest />} />
          {/* Add the route for the new exercise page */}
          <Route path="/exercises" element={<ExercisePage />} />
          {/* Placeholder routes for other pages */}
          <Route path="/community" element={<div className="p-8 text-center">Community Page - Coming Soon</div>} />
          <Route path="/about" element={<div className="p-8 text-center">About Page - Coming Soon</div>} />
          <Route path="/analysis/3d" element={<div className="p-8 text-center">3D Analysis - Coming Soon</div>} />
          <Route path="/doctor/*" element={<div className="p-8 text-center">Doctor Panel - Coming Soon</div>} />
          <Route path="/resources/*" element={<div className="p-8 text-center">Resources - Coming Soon</div>} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;