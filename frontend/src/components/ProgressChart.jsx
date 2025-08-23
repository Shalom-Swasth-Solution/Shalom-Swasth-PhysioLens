import React from 'react';
import { TrendingUp, Calendar, Award, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { mockProgressData, mockUser } from '../data/mock';

const ProgressChart = () => {
  // Calculate some stats from mock data
  const latestScore = mockProgressData[mockProgressData.length - 1]?.score || 0;
  const previousScore = mockProgressData[mockProgressData.length - 2]?.score || 0;
  const improvement = latestScore - previousScore;
  const averageScore = Math.round(mockProgressData.reduce((sum, item) => sum + item.score, 0) / mockProgressData.length);
  const maxScore = Math.max(...mockProgressData.map(item => item.score));

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Chart Card */}
          <Card className="lg:col-span-2 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    Progress Overview
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Your posture improvement journey over the last 7 days
                  </CardDescription>
                </div>
                <Badge 
                  variant={improvement >= 0 ? "default" : "secondary"} 
                  className={improvement >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {improvement >= 0 ? '+' : ''}{improvement} pts
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Simple Chart Visualization */}
              <div className="space-y-4">
                {mockProgressData.map((item, index) => {
                  const barWidth = (item.score / 100) * 100;
                  const isLatest = index === mockProgressData.length - 1;
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg ${isLatest ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="text-sm font-medium text-gray-700">
                            {new Date(item.date).toLocaleDateString('en-US', { 
                              weekday: 'short',
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                          <div className="text-sm text-gray-500">{item.session}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">{item.score}</span>
                          <span className="text-sm text-gray-500">/ 100</span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            item.score >= 90 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                            item.score >= 75 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                            item.score >= 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                            'bg-gradient-to-r from-red-500 to-red-600'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Chart Legend */}
              <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Excellent (90+)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Good (75-89)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Fair (60-74)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Needs Work (&lt;60)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="space-y-6">
            {/* Current Score */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Target className="w-8 h-8 text-blue-100" />
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    Latest
                  </Badge>
                </div>
                <div className="text-3xl font-bold mb-2">{latestScore}</div>
                <div className="text-blue-100 text-sm">Current Posture Score</div>
              </CardContent>
            </Card>

            {/* Average Score */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    7-Day Avg
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{averageScore}</div>
                <div className="text-gray-600 text-sm">Average Score</div>
                <div className="mt-3 text-sm text-green-600 font-medium">
                  {improvement >= 0 ? '↗' : '↘'} {Math.abs(improvement)} pts from yesterday
                </div>
              </CardContent>
            </Card>

            {/* Best Score */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Award className="w-8 h-8 text-yellow-500" />
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                    Best
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{maxScore}</div>
                <div className="text-gray-600 text-sm">Personal Best</div>
                <div className="mt-3 text-sm text-gray-500">
                  🎯 Goal: Maintain 90+ score
                </div>
              </CardContent>
            </Card>

            {/* Streak Counter */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="w-8 h-8 text-purple-500" />
                  <Badge variant="outline" className="text-purple-600 border-purple-200">
                    Streak
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{mockUser.currentStreak}</div>
                <div className="text-gray-600 text-sm">Days Active</div>
                <div className="mt-3 text-sm text-purple-600 font-medium">
                  🔥 Keep it up!
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressChart;