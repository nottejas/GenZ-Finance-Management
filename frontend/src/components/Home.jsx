import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
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
      
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-4">
          <span className="text-white">Level Up Your</span>
          <div className="text-primary mt-2">Financial Game</div>
        </h1>
        <p className="text-secondary fs-5 mb-5">
          Join thousands of Gen Z users managing their finances smarter
        </p>
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <button
            onClick={() => navigate('/register')}
            className="btn btn-primary btn-lg px-5 rounded-pill fw-semibold"
          >
            Start Your Journey
          </button>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-dark btn-lg px-5 rounded-pill fw-semibold"
          >
            Welcome Back
          </button>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="text-center">
            <div className="h2 fw-bold text-primary mb-2">50K+</div>
            <div className="text-secondary">Active Users</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="text-center">
            <div className="h2 fw-bold text-primary mb-2">₹10M+</div>
            <div className="text-secondary">Money Saved</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="text-center">
            <div className="h2 fw-bold text-primary mb-2">4.9/5</div>
            <div className="text-secondary">App Rating</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="text-center">
            <div className="h2 fw-bold text-primary mb-2">100K+</div>
            <div className="text-secondary">Goals Achieved</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 