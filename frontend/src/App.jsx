import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import FinancialOverview from './components/dashboard/FinancialOverview';
import Challenges from './components/gamification/Challenges';
import Education from './components/education/Education';
import Settings from './components/settings/Settings';
import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="overview" element={<FinancialOverview />} />
          <Route path="challenges" element={<Challenges />} />
          <Route path="education" element={<Education />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
