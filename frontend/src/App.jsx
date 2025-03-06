import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home'
import Dashboard from "./components/dashboard/Dashboard";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes> 
      </BrowserRouter>

      <h1>Hey there</h1>
    </div>
  );
}   

export default App;
