import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Brain, Dumbbell, FileText, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const FeatureCards = () => {
  const features = [
    {
      icon: Activity,
      title: 'Real-time Analysis',
      description: 'Get instant feedback on your posture with AI-powered computer vision technology.',
      badge: 'Live',
      link: '/analysis/realtime',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100/50'
    },
    {
      icon: Brain,
      title: '3D Analysis',
      description: 'Comprehensive 3D body mapping for detailed postural assessment and insights.',
      badge: 'Advanced',
      link: '/analysis/3d',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100/50'
    },
    {
      icon: Dumbbell,
      title: 'Exercise Recommendation',
      description: 'Personalized exercise plans based on your specific postural needs and goals.',
      badge: 'Custom',
      link: '/exercises/recommended',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100/50'
    },
    {
      icon: FileText,
      title: 'Session Reports',
      description: 'Detailed progress reports and analytics to track your improvement over time.',
      badge: 'Reports',
      link: '/reports',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100/50'
    },
    {
      icon: Users,
      title: 'Doctor Dashboard',
      description: 'Healthcare professional interface for patient monitoring and treatment planning.',
      badge: 'Pro',
      link: '/doctor/dashboard',
      gradient: 'from-teal-500 to-teal-600',
      bgGradient: 'from-teal-50 to-teal-100/50'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-blue-700 border-blue-200">
            Platform Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Everything You Need for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 block mt-2">
              Better Posture Health
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform combines cutting-edge AI technology with expert healthcare knowledge 
            to provide you with the most effective posture improvement solutions.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className={`group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br ${feature.bgGradient} hover:-translate-y-2 cursor-pointer`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-white/80 text-gray-700">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pb-6">
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button 
                    asChild 
                    variant="ghost" 
                    className="w-full justify-between group-hover:bg-white/50 transition-colors"
                  >
                    <Link to={feature.link}>
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of users who have already improved their posture and reduced pain with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              variant="secondary" 
              className="bg-white text-blue-600 hover:bg-gray-50"
            >
              <Link to="/analysis/realtime">
                Start Free Analysis
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="border-blue-300 text-white hover:bg-blue-600"
            >
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;