import React from 'react';

const Challenges = () => {
  return (
    <div className="container py-5">
      <h1 className="h2 fw-bold text-primary mb-4">Financial Challenges</h1>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card bg-dark border-custom">
            <div className="card-body">
              <h5 className="card-title text-primary">No-Spend Week</h5>
              <p className="text-secondary">Save money by avoiding unnecessary purchases for a week</p>
              <button className="btn btn-primary w-100">Start Challenge</button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-dark border-custom">
            <div className="card-body">
              <h5 className="card-title text-primary">Budget Master</h5>
              <p className="text-secondary">Stick to your budget for 30 days</p>
              <button className="btn btn-primary w-100">Start Challenge</button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-dark border-custom">
            <div className="card-body">
              <h5 className="card-title text-primary">Investment Explorer</h5>
              <p className="text-secondary">Learn about and start investing</p>
              <button className="btn btn-primary w-100">Start Challenge</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges; 