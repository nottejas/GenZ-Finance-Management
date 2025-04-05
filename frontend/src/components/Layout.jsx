import React, { memo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { useSettings } from '../context/SettingsContext';

const navItems = [
  { path: '/', label: '🏠 Dashboard', id: 'dashboard' },
  { path: '/overview', label: '📊 Financial Overview', id: 'overview' },
  { path: '/challenges', label: '🎮 Challenges', id: 'challenges' },
  { path: '/education', label: '📚 Learn', id: 'education' },
  { path: '/settings', label: '⚙️ Settings', id: 'settings' },
];

// Memoize the navigation item to prevent unnecessary re-renders
const NavItem = memo(({ item, isActive, isDarkMode }) => (
  <Link
    to={item.path}
    className={`flex items-center px-4 py-3 no-underline ${
      isActive 
        ? 'bg-gray-900 border-r-4 border-orange-500 text-orange-500 dark:bg-gray-800' 
        : `text-gray-700 hover:text-black hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800`
    }`}
  >
    <span className="mr-3 text-xl">{item.label.split(' ')[0]}</span>
    <span>{item.label.split(' ').slice(1).join(' ')}</span>
  </Link>
));

// Memoize the stats section
const StatsSection = memo(({ isDarkMode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 animate-fade-in-up">
    <div className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-300'} rounded-xl border shadow-lg`}>
      <div className="p-6 text-center">
        <div className="text-2xl font-bold text-orange-500 mb-2">50K+</div>
        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Users</div>
      </div>
    </div>
    <div className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-300'} rounded-xl border shadow-lg`}>
      <div className="p-6 text-center">
        <div className="text-2xl font-bold text-orange-500 mb-2">₹10M+</div>
        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Money Saved</div>
      </div>
    </div>
    <div className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-300'} rounded-xl border shadow-lg`}>
      <div className="p-6 text-center">
        <div className="text-2xl font-bold text-orange-500 mb-2">4.9/5</div>
        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>App Rating</div>
      </div>
    </div>
    <div className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-300'} rounded-xl border shadow-lg`}>
      <div className="p-6 text-center">
        <div className="text-2xl font-bold text-orange-500 mb-2">100K+</div>
        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Goals Achieved</div>
      </div>
    </div>
  </div>
));

function Layout() {
  const location = useLocation();
  const { settings } = useSettings();
  const isDarkMode = settings?.profile?.darkMode ?? true;
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <SignedIn>
        <div className="flex">
          {/* Sidebar */}
          <div className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-300'} border-r w-64 h-screen fixed`}>
            <div className="p-4">
              <h1 className="text-xl font-bold text-orange-500">GenZ Finance</h1>
            </div>
            
            <nav className="mt-4">
              {navItems.map((item) => (
                <NavItem 
                  key={item.id} 
                  item={item} 
                  isActive={location.pathname === item.path}
                  isDarkMode={isDarkMode}
                />
              ))}
            </nav>

            <div className={`absolute bottom-0 w-full p-4 border-t ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-300 bg-gray-100'}`}>
              <div className="flex items-center gap-3">
                <UserButton afterSignOutUrl="/" />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Account</span>
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
              <span className={isDarkMode ? 'text-white' : 'text-black'}>Level Up Your</span>
              <div className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent mt-2">Financial Game</div>
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-lg mb-8`}>
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
                className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} py-3 px-8 rounded-full font-semibold transition-colors`}
              >
                Welcome Back
              </Link>
            </div>
            <StatsSection isDarkMode={isDarkMode} />
          </div>
        </div>
      </SignedOut>
    </div>
  );
}

export default memo(Layout); 