import './App.css';

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from './context/SidebarContext';
import ToolLayout from './pages/ToolLayout';
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ToolLayout />}/>

        <Route path="/login" element={<Login />} />       
        <Route path="/register" element={<Register />} />
        <Route index element={<UserDashboard />} />
            
        {/* Các công cụ */}
        <Route path="/token-generator" element={<TokenGeneratorTool />} />
        <Route path="/hash-text" element={<HashText />} />
        <Route path="/bcrypt" element={<Bcrypt />} />
        <Route path="*" element={<div>Không tìm thấy trang!</div>} />
      </Routes>
    </Router>
  );
}

export default App;