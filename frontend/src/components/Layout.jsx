import React, { memo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const navItems = [
  { path: '/', label: '🏠 Dashboard', id: 'dashboard' },
  { path: '/overview', label: '📊 Financial Overview', id: 'overview' },
  { path: '/challenges', label: '🎮 Challenges', id: 'challenges' },
  { path: '/education', label: '📚 Learn', id: 'education' },
  { path: '/settings', label: '⚙️ Settings', id: 'settings' },
];

// Memoize the navigation item to prevent unnecessary re-renders
const NavItem = memo(({ item, isActive }) => (
  <Link
    to={item.path}
    className={`flex items-center px-4 py-3 no-underline ${
      isActive 
        ? 'bg-gray-900 border-r-4 border-orange-500 text-orange-500' 
        : 'text-gray-400 hover:text-white hover:bg-gray-800'
    }`}
  >
    <span className="mr-3 text-xl">{item.label.split(' ')[0]}</span>
    <span>{item.label.split(' ').slice(1).join(' ')}</span>
  </Link>
));

// Memoize the stats section
const StatsSection = memo(() => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 animate-fade-in-up">
    <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg">
      <div className="p-6 text-center">
        <div className="text-2xl font-bold text-orange-500 mb-2">50K+</div>
        <div className="text-gray-400">Active Users</div>
      </div>
    </div>
    <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg">
      <div className="p-6 text-center">
        <div className="text-2xl font-bold text-orange-500 mb-2">₹10M+</div>
        <div className="text-gray-400">Money Saved</div>
      </div>
    </div>
    <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg">
      <div className="p-6 text-center">
        <div className="text-2xl font-bold text-orange-500 mb-2">4.9/5</div>
        <div className="text-gray-400">App Rating</div>
      </div>
    </div>
    <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg">
      <div className="p-6 text-center">
        <div className="text-2xl font-bold text-orange-500 mb-2">100K+</div>
        <div className="text-gray-400">Goals Achieved</div>
      </div>
    </div>
  </div>
));

function Layout() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-black text-white">
      <SignedIn>
        <div className="flex">
          {/* Sidebar */}
          <div className="bg-gray-900 border-r border-gray-800 w-64 h-screen fixed">
            <div className="p-4">
              <h1 className="text-xl font-bold text-orange-500">GenZ Finance</h1>
            </div>
            
            <nav className="mt-4">
              {navItems.map((item) => (
                <NavItem 
                  key={item.id} 
                  item={item} 
                  isActive={location.pathname === item.path}
                />
              ))}
            </nav>

            <div className="absolute bottom-0 w-full p-4 border-t border-gray-800 bg-gray-900">
              <div className="flex items-center gap-3">
                <UserButton afterSignOutUrl="/" />
                <span className="text-gray-400 text-sm">Account</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="ml-64 flex-1 p-8">
            <Outlet />
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="container min-h-screen flex items-center justify-center py-12">
          <div className="text-center max-w-2xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Level Up Your</span>
              <div className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent mt-2">Financial Game</div>
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Join the next generation of money management. Real-time tracking,
              gamified savings, and smart insights designed for Gen Z.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-orange-500 text-white py-3 px-8 rounded-full font-semibold hover:bg-orange-600 transition-colors"
              >
                Start Your Journey
              </Link>
              <Link
                to="/login"
                className="bg-gray-800 text-white py-3 px-8 rounded-full font-semibold hover:bg-gray-700 transition-colors"
              >
                Welcome Back
              </Link>
            </div>
            <StatsSection />
          </div>
        </div>
      </SignedOut>
    </div>
  );
}

export default memo(Layout); 