import React from 'react';

const Education = () => {
  return (
    <div className="container py-5">
      <h1 className="h2 fw-bold text-primary mb-4">Financial Education</h1>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card bg-dark border-custom">
            <div className="card-body">
              <h5 className="card-title text-primary">Budgeting Basics</h5>
              <p className="text-secondary">Learn how to create and stick to a budget</p>
              <button className="btn btn-primary">Start Learning</button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card bg-dark border-custom">
            <div className="card-body">
              <h5 className="card-title text-primary">Investment 101</h5>
              <p className="text-secondary">Understanding stocks, bonds, and mutual funds</p>
              <button className="btn btn-primary">Start Learning</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education; 