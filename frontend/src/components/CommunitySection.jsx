import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, BookOpen, Video, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { mockCommunityPosts, mockLearningResources } from '../data/mock';

const CommunitySection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-blue-700 border-blue-200">
            Community & Learning
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Learn, Share & 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 block mt-2">
              Grow Together
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with our supportive community and access expert-curated resources 
            to accelerate your posture improvement journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Community Posts */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Community Highlights</h3>
              <Button asChild variant="ghost" className="text-blue-600 hover:text-blue-700">
                <Link to="/community">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              {mockCommunityPosts.map((post) => (
                <Card key={post.id} className="border-blue-100 hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12 ring-2 ring-blue-100">
                        <AvatarImage src={post.avatar} alt={post.author} />
                        <AvatarFallback className="bg-blue-500 text-white">
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-gray-900">{post.author}</span>
                          <span className="text-gray-500 text-sm">{post.timestamp}</span>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {post.content}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-gray-500">
                          <button className="flex items-center space-x-2 hover:text-red-500 transition-colors group">
                            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          
                          <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors group">
                            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-sm">{post.comments}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Community Stats */}
            <Card className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">50,000+</div>
                      <div className="text-gray-600">Community Members</div>
                    </div>
                  </div>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link to="/community/join">
                      Join Community
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Resources */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Learning Resources</h3>
              <Button asChild variant="ghost" className="text-blue-600 hover:text-blue-700">
                <Link to="/resources">
                  Browse All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              {mockLearningResources.map((resource) => (
                <Card key={resource.id} className="border-blue-100 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Thumbnail */}
                      <div className="w-24 h-24 bg-gray-200 rounded-l-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={resource.thumbnail} 
                          alt={resource.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {resource.title}
                          </h4>
                          
                          <Badge 
                            variant="secondary" 
                            className={`ml-2 text-xs ${
                              resource.type === 'Video' ? 'bg-red-100 text-red-700' :
                              resource.type === 'Article' ? 'bg-green-100 text-green-700' :
                              'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {resource.type === 'Video' && <Video className="w-3 h-3 mr-1" />}
                            {resource.type === 'Article' && <BookOpen className="w-3 h-3 mr-1" />}
                            {resource.type}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          {resource.duration}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Featured Learning Path */}
            <Card className="mt-8 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                  Featured Learning Path
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Complete beginner's guide to posture improvement
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Progress</span>
                    <span className="text-sm font-medium text-purple-600">3 of 8 completed</span>
                  </div>
                  
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full w-3/8"></div>
                  </div>
                  
                  <Button asChild size="sm" className="w-full bg-purple-600 hover:bg-purple-700 mt-4">
                    <Link to="/resources/learning-paths/beginner">
                      Continue Learning
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

export default CommunitySection;