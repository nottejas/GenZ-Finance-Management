import React from 'react';

const Home = () => {
  const currentTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <div className="container py-5">
      <div className="text-secondary mb-4">{currentTime}</div>
      
      <h1 className="h2 fw-bold text-gradient mb-4 hero-title">Welcome Back! 👋</h1>
      
      <div className="row g-4 stagger-fade">
        <div className="col-md-6">
          <div className="stat-card bg-dark border-custom">
            <div className="card-body">
              <h5 className="card-title text-primary">Quick Actions</h5>
              <div className="d-flex flex-column gap-2 mt-3">
                <button className="btn btn-primary">Add New Transaction</button>
                <button className="btn btn-dark">View Recent Activity</button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="stat-card bg-dark border-custom">
            <div className="card-body">
              <h5 className="card-title text-primary">Today's Overview</h5>
              <h2 className="text-white mt-3">₹25,000</h2>
              <p className="text-secondary">Available Balance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 