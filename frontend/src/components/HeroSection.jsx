import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Activity, Users, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50/30 pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          {/* Left Column - Content */}
          <div className="mb-12 lg:mb-0">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <Activity className="w-4 h-4 mr-2" />
              AI-Powered Posture Analysis
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Transform Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 block">
                Posture Health
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
              Experience real-time posture analysis with AI precision. Get personalized exercises, 
              track your progress, and connect with healthcare professionals.
            </p>

            {/* Statistics */}
            <div className="flex items-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">50K+</div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">95%</div>
                <div className="text-sm text-gray-500">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-gray-500">Support</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Link to="/analysis/realtime" className="flex items-center">
                  Start Analysis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-blue-100">
              <p className="text-sm text-gray-500 mb-4">Trusted by healthcare professionals</p>
              <div className="flex items-center space-x-6 opacity-60">
                <div className="text-gray-400 font-semibold">Mayo Clinic</div>
                <div className="text-gray-400 font-semibold">Johns Hopkins</div>
                <div className="text-gray-400 font-semibold">Cleveland Clinic</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Main Demo Card */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-blue-100 shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-4 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-4 border-blue-400 rounded-full flex items-center justify-center">
                    <Activity className="w-20 h-20 text-blue-600 animate-pulse" />
                  </div>
                </div>
                
                {/* Overlay UI Elements */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-800">Live Analysis</span>
                  </div>
                </div>
                
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                  <div className="text-2xl font-bold text-blue-600">89</div>
                  <div className="text-xs text-gray-600">Posture Score</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Analysis Status</span>
                  <span className="text-sm font-medium text-green-600">Excellent</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full w-4/5"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">89%</span>
                </div>
              </div>
            </Card>

            {/* Floating Feature Cards */}
            <div className="absolute -top-4 -left-4 w-32 h-20 bg-white rounded-lg shadow-xl border border-blue-100 p-3 hidden lg:block">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-xs text-gray-500">Community</div>
                  <div className="text-sm font-semibold">50K+</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 w-32 h-20 bg-white rounded-lg shadow-xl border border-blue-100 p-3 hidden lg:block">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-xs text-gray-500">Accuracy</div>
                  <div className="text-sm font-semibold">95%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;