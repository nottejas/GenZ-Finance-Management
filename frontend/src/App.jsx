import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import Home from './Home'; // Import Home Page

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} /> {/* Home Page */}
        <Route path='/login'element={
          <div className='flex items-center justify-center h-screen'>
            <SignIn /> 
            </div>}
            /> {/* Login Page */}
        <Route path='/signup' element={
          <div className='flex items-center justify-center h-screen'>
            <SignUp /> 
            </div>}
            /> {/* Signup Page */}
      </Routes>
    </Router>
  );
}

export default App;
