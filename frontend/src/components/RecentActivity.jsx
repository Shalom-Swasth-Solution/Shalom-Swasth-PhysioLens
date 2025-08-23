import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, MapPin, Video, Award, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { mockRecentActivity } from '../data/mock';

const RecentActivity = () => {
  const { lastSession, upcomingAppointments } = mockRecentActivity;

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A': case 'A+': return 'bg-green-100 text-green-800';
      case 'B': case 'B+': return 'bg-blue-100 text-blue-800';
      case 'C': case 'C+': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-blue-700 border-blue-200">
            Recent Activity
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Your Latest
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 block mt-2">
              Progress & Schedule
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Last Session Summary */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Latest Session</h3>
              <Button asChild variant="ghost" className="text-blue-600 hover:text-blue-700">
                <Link to="/sessions/history">
                  View All Sessions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        Session Summary
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {new Date(lastSession.date).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <Badge className={`text-lg font-bold px-3 py-1 ${getGradeColor(lastSession.grade)}`}>
                    {lastSession.grade}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Session Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{lastSession.score}</div>
                    <div className="text-sm text-gray-600">Posture Score</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{lastSession.duration}</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                </div>

                {/* Improvements */}
                {lastSession.improvements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                      Improvements
                    </h4>
                    <div className="space-y-2">
                      {lastSession.improvements.map((improvement, index) => (
                        <div key={index} className="flex items-center space-x-3 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">{improvement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Issues to Work On */}
                {lastSession.issues.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-orange-500" />
                      Areas to Focus
                    </h4>
                    <div className="space-y-2">
                      {lastSession.issues.map((issue, index) => (
                        <div key={index} className="flex items-center space-x-3 text-sm">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-700">{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-blue-700">
                  <Link to="/analysis/realtime">
                    Start New Session
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Appointments */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Upcoming Appointments</h3>
              <Button asChild variant="ghost" className="text-blue-600 hover:text-blue-700">
                <Link to="/appointments">
                  Manage All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="border-blue-100 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {appointment.type}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          with {appointment.doctor}
                        </p>
                      </div>
                      
                      <Badge 
                        variant={appointment.location === 'Virtual' ? 'default' : 'secondary'}
                        className={appointment.location === 'Virtual' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {appointment.location}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(appointment.date).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                      </div>
                      
                      {appointment.location !== 'Virtual' && (
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{appointment.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-3 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        Reschedule
                      </Button>
                      {appointment.location === 'Virtual' ? (
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                          Join Call
                        </Button>
                      ) : (
                        <Button size="sm" className="flex-1">
                          View Details
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="mt-8 bg-gradient-to-r from-teal-50 to-teal-100 border-teal-200">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
                <div className="grid grid-cols-1 gap-3">
                  <Button asChild variant="outline" size="sm" className="justify-start">
                    <Link to="/appointments/book">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book New Appointment
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="justify-start">
                    <Link to="/doctor/message">
                      <Video className="w-4 h-4 mr-2" />
                      Message Doctor
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentActivity;