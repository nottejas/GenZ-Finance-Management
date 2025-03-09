import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

function Layout() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: '🏠 Dashboard', id: 'dashboard' },
    { path: '/overview', label: '📊 Financial Overview', id: 'overview' },
    { path: '/challenges', label: '🎮 Challenges', id: 'challenges' },
    { path: '/education', label: '📚 Learn', id: 'education' },
    { path: '/settings', label: '⚙️ Settings', id: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SignedIn>
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white dark:bg-gray-800 h-screen fixed left-0 border-r border-gray-200 dark:border-gray-700">
            <div className="p-4">
              <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">GenZ Finance</h1>
            </div>
            
            <nav className="mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-400 transition-colors ${
                    location.pathname === item.path ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-r-4 border-purple-500' : ''
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <UserButton />
                <span className="text-sm text-gray-700 dark:text-gray-300">Account</span>
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
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to GenZ Finance</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Please sign in to continue</p>
            <div className="space-x-4">
              <Link
                to="/login"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 px-6 py-2 rounded-lg border border-purple-600 dark:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}

export default Layout; 