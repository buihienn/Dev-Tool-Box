import './App.css';

import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SidebarProvider } from './context/SidebarContext';
import ToolLayout from './pages/ToolLayout';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import TokenGeneratorTool from './pages/TokenGeneratorTool';
import HashText from './pages/HashText';
import Bcrypt from './pages/Bcrypt';

function App() {
  return (
    <SidebarProvider>
      <BrowserRouter>
        <Routes>
          {/* Đặt ToolLayout làm layout chính */}
          <Route path="/" element={<ToolLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="token-generator" element={<TokenGeneratorTool />} />
            <Route path="hash-text" element={<HashText />} />
            <Route path="bcrypt" element={<Bcrypt />} />
          </Route>

          {/* Các route không cần ToolLayout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<div>Không tìm thấy trang!</div>} />
        </Routes>
      </BrowserRouter>
    </SidebarProvider>
  );
}

export default App;