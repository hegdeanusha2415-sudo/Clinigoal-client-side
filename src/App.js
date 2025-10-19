// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import UserLogin from "./components/UserLogin/UserLogin";
import AdminLogin from "./components/AdminLogin/AdminLogin";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import UserDashboard from "./components/UserDashboard/UserDashboard";
import ClinicalResearchPage from "./components/Course/ClinicalResearchPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Login Routes */}
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        
        {/* Dashboards */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        
        {/* Course Pages */}
        <Route path="/clinical-research" element={<ClinicalResearchPage />} />

        {/* Optional: Redirect unknown routes to Home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
