import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { FaSpinner } from 'react-icons/fa';

// Lazy load route components
const Home = lazy(() => import('./components/Home'));
const Overview = lazy(() => import('./components/dashboard/FinancialOverview'));
const Challenges = lazy(() => import('./components/Challenges'));
const Education = lazy(() => import('./components/education/Education'));
const Settings = lazy(() => import('./components/settings/Settings'));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full min-h-[200px]">
    <FaSpinner className="animate-spin text-orange-500 text-4xl" />
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={
          <Suspense fallback={<LoadingSpinner />}>
            <Home />
          </Suspense>
        } />
        <Route path="overview" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Overview />
          </Suspense>
        } />
        <Route path="challenges" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Challenges />
          </Suspense>
        } />
        <Route path="education" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Education />
          </Suspense>
        } />
        <Route path="settings" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Settings />
          </Suspense>
        } />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/sso-callback" element={<Register />} />
      <Route path="/login/sso-callback" element={<Login />} />
    </Routes>
  );
}

export default App;
