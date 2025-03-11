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
    className={`d-flex align-items-center px-4 py-3 text-decoration-none ${
      isActive ? 'bg-dark border-end border-5 border-primary text-primary' : 'text-secondary'
    }`}
  >
    <span className="me-3 fs-5">{item.label.split(' ')[0]}</span>
    <span>{item.label.split(' ').slice(1).join(' ')}</span>
  </Link>
));

// Memoize the stats section
const StatsSection = memo(() => (
  <div className="row g-4 mt-5 stagger-fade">
    <div className="col-md-3">
      <div className="stat-card bg-dark border-custom">
        <div className="card-body text-center">
          <div className="h2 fw-bold text-primary mb-2">50K+</div>
          <div className="text-secondary">Active Users</div>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="stat-card bg-dark border-custom">
        <div className="card-body text-center">
          <div className="h2 fw-bold text-primary mb-2">₹10M+</div>
          <div className="text-secondary">Money Saved</div>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="stat-card bg-dark border-custom">
        <div className="card-body text-center">
          <div className="h2 fw-bold text-primary mb-2">4.9/5</div>
          <div className="text-secondary">App Rating</div>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="stat-card bg-dark border-custom">
        <div className="card-body text-center">
          <div className="h2 fw-bold text-primary mb-2">100K+</div>
          <div className="text-secondary">Goals Achieved</div>
        </div>
      </div>
    </div>
  </div>
));

function Layout() {
  const location = useLocation();
  
  return (
    <div className="min-vh-100">
      <SignedIn>
        <div className="d-flex">
          {/* Sidebar */}
          <div className="bg-dark border-end border-custom" style={{ width: '250px', height: '100vh', position: 'fixed' }}>
            <div className="p-4">
              <h1 className="h4 fw-bold text-primary">GenZ Finance</h1>
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

            <div className="position-absolute bottom-0 w-100 p-4 border-top border-custom bg-dark">
              <div className="d-flex align-items-center gap-3">
                <UserButton afterSignOutUrl="/" />
                <span className="text-secondary small">Account</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="ms-5" style={{ marginLeft: '250px', flex: 1, padding: '2rem' }}>
            <Outlet />
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
          <div className="text-center" style={{ maxWidth: '600px' }}>
            <h1 className="display-4 fw-bold mb-4 hero-title">
              <span className="text-white">Level Up Your</span>
              <div className="text-gradient mt-2">Financial Game</div>
            </h1>
            <p className="text-secondary fs-5 mb-5 hero-subtitle">
              Join the next generation of money management. Real-time tracking,
              gamified savings, and smart insights designed for Gen Z.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Link
                to="/register"
                className="btn btn-primary btn-lg px-5 rounded-pill fw-semibold"
              >
                Start Your Journey
              </Link>
              <Link
                to="/login"
                className="btn btn-dark btn-lg px-5 rounded-pill fw-semibold"
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