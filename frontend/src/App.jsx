import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Lazy load route components
const Home = lazy(() => import('./components/Home'));
const Overview = lazy(() => import('./components/dashboard/FinancialOverview'));
const Challenges = lazy(() => import('./components/Challenges'));
const Education = lazy(() => import('./components/Education'));
const Settings = lazy(() => import('./components/settings/Settings'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <Suspense fallback={<div className="text-center p-5"><div className="spinner-border text-primary" role="status" /></div>}>
              <Home />
            </Suspense>
          } />
          <Route path="overview" element={
            <Suspense fallback={<div className="text-center p-5"><div className="spinner-border text-primary" role="status" /></div>}>
              <Overview />
            </Suspense>
          } />
          <Route path="challenges" element={
            <Suspense fallback={<div className="text-center p-5"><div className="spinner-border text-primary" role="status" /></div>}>
              <Challenges />
            </Suspense>
          } />
          <Route path="education" element={
            <Suspense fallback={<div className="text-center p-5"><div className="spinner-border text-primary" role="status" /></div>}>
              <Education />
            </Suspense>
          } />
          <Route path="settings" element={
            <Suspense fallback={<div className="text-center p-5"><div className="spinner-border text-primary" role="status" /></div>}>
              <Settings />
            </Suspense>
          } />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/sso-callback" element={<Register />} />
        <Route path="/login/sso-callback" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
