import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Overview from './components/Overview';
import Challenges from './components/Challenges';
import Education from './components/Education';
import Settings from './components/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="overview" element={<Overview />} />
          <Route path="challenges" element={<Challenges />} />
          <Route path="education" element={<Education />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/sso-callback" element={<Register />} />
        <Route path="/login/sso-callback" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
