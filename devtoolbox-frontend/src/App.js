import './App.css';

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from './context/SidebarContext';
import ToolLayout from './pages/ToolLayout';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import TokenGeneratorTool from './pages/TokenGeneratorTool';
import HashText from './pages/HashText';
import Bcrypt from './pages/Bcrypt';
import MathEvaluator from './pages/MathEvaluator';
import ULID from './pages/UlidGenerator';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import AdminLayout from './pages/AdminLayout';

// const AdminGuard = ({ children }) => {
//   const role = localStorage.getItem('role');
  
//   if (role === 'ADMIN') {
//     return children;
//   }
  
//   return <Navigate to="/login" replace />;
// };

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
            <Route path="math-evaluator" element={<MathEvaluator />} />
            <Route path="ulid-generator" element={<ULID />} />
          </Route>

          {/* Các route không cần ToolLayout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/admin" element={
          // <AdminGuard>
            <AdminLayout />
          // </AdminGuard>
        } />
          {/* Route không tìm thấy */}
          <Route path="*" element={<div>Không tìm thấy trang!</div>} />
        </Routes>
      </BrowserRouter>
    </SidebarProvider>
  );
}

export default App;