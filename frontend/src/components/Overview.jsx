import React from 'react';

const Overview = () => {
  return (
    <div className="container py-5">
      <h1 className="h2 fw-bold text-primary mb-4">Financial Overview</h1>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card bg-dark border-custom">
            <div className="card-body">
              <h5 className="card-title text-primary">Total Balance</h5>
              <h2 className="text-white">₹25,000</h2>
              <p className="text-secondary mb-0">+₹2,500 this month</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card bg-dark border-custom">
            <div className="card-body">
              <h5 className="card-title text-primary">Monthly Savings</h5>
              <h2 className="text-white">₹5,000</h2>
              <p className="text-secondary mb-0">20% of income</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview; 