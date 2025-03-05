import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Top-right buttons */}
      <div className="absolute top-6 right-6 space-x-4">
        <button 
          onClick={() => navigate('/login')} 
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Log In
        </button>
        <button 
          onClick={() => navigate('/signup')} 
          className="px-5 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
        >
          Sign Up
        </button>
      </div>

      {/* Page Heading */}
      <h1 className="text-4xl font-bold text-gray-800 mt-12">
        Welcome to GenZ Finance
      </h1>
    </div>
  );
}

export default Home;
