import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="text-gray-300 text-lg">
                Get the latest posture tips, exercises, and health insights delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">PhysioLens</span>
                <span className="text-xs text-blue-400 -mt-1">Smart Posture Care</span>
              </div>
            </Link>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              Revolutionizing posture health through AI-powered analysis and personalized care. 
              Join thousands of users improving their well-being every day.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <Button size="sm" variant="ghost" className="p-2 hover:bg-gray-700">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 hover:bg-gray-700">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 hover:bg-gray-700">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 hover:bg-gray-700">
                <Linkedin className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Platform</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/analysis/realtime" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Real-time Analysis
                </Link>
              </li>
              <li>
                <Link to="/analysis/3d" className="text-gray-300 hover:text-blue-400 transition-colors">
                  3D Analysis
                </Link>
              </li>
              <li>
                <Link to="/exercises/recommended" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Exercise Plans
                </Link>
              </li>
              <li>
                <Link to="/doctor/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Doctor Dashboard
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Learning Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/guides" className="text-gray-300 hover:text-blue-400 transition-colors">
                  User Guides
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-blue-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/system-status" className="text-gray-300 hover:text-blue-400 transition-colors">
                  System Status
                </Link>
              </li>
              <li>
                <Link to="/api-docs" className="text-gray-300 hover:text-blue-400 transition-colors">
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-gray-300">Email Support</div>
                  <a href="mailto:support@physiolens.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                    support@physiolens.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-gray-300">Phone Support</div>
                  <a href="tel:+1-555-0123" className="text-blue-400 hover:text-blue-300 transition-colors">
                    +1 (555) 012-3456
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-gray-300">Office</div>
                  <div className="text-gray-400">
                    123 Health Street<br />
                    San Francisco, CA 94102
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 PhysioLens. All rights reserved.
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-blue-400 transition-colors">
                Cookie Policy
              </Link>
              <Link to="/accessibility" className="text-gray-400 hover:text-blue-400 transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;