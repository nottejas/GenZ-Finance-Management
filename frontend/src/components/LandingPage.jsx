import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaLock, FaGamepad, FaMobileAlt } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center py-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500">
              Level Up Your<br />Financial Game
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl">
              Join the next generation of money management. Real-time tracking, gamified savings, and smart insights designed for Gen Z.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link 
                to="/register" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full text-lg transition-all transform hover:scale-105 w-64 text-center"
              >
                Start Your Journey
              </Link>
              
              <Link 
                to="/login" 
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-10 rounded-full text-lg transition-all w-64 text-center"
              >
                Welcome Back
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center bg-gray-800 p-6 rounded-xl">
              <h3 className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">50K+</h3>
              <p className="text-gray-400">Active Users</p>
            </div>
            
            <div className="flex flex-col items-center text-center bg-gray-800 p-6 rounded-xl">
              <h3 className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">₹10M+</h3>
              <p className="text-gray-400">Money Saved</p>
            </div>
            
            <div className="flex flex-col items-center text-center bg-gray-800 p-6 rounded-xl">
              <h3 className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">4.9/5</h3>
              <p className="text-gray-400">App Rating</p>
            </div>
            
            <div className="flex flex-col items-center text-center bg-gray-800 p-6 rounded-xl">
              <h3 className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">100K+</h3>
              <p className="text-gray-400">Goals Achieved</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What Makes Us Different</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="bg-orange-500 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <FaChartLine className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-3">Smart Analytics</h3>
            <p className="text-gray-400">AI-powered insights to help you understand and improve your spending habits.</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="bg-orange-500 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <FaGamepad className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-3">Gamified Savings</h3>
            <p className="text-gray-400">Turn saving money into a game with challenges, rewards, and achievements.</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="bg-orange-500 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <FaLock className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-3">Privacy First</h3>
            <p className="text-gray-400">Your financial data stays yours with advanced encryption and privacy controls.</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="bg-orange-500 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <FaMobileAlt className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-3">Mobile Optimized</h3>
            <p className="text-gray-400">Access your finances anytime, anywhere with our responsive interface.</p>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Take Control of Your Finances?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of Gen Z users who are changing the way they manage money.</p>
          <Link 
            to="/register" 
            className="bg-white text-orange-600 font-bold py-4 px-12 rounded-full text-lg transition-all transform hover:scale-105 hover:bg-gray-100 inline-block"
          >
            Get Started Now
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-black py-6">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} GenZ Finance. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 