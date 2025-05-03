import './App.css';

import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SidebarProvider } from './context/SidebarContext';
import ToolLayout from './pages/ToolLayout';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/guards/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import { ToolsProvider } from './context/ToolsContext';
import ToolRenderer from './pages/ToolRenderer';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import AdminLayout from './pages/AdminLayout';
import PricingPlan from './pages/PricingPlan';

function App() {
  return (
    <AuthProvider>
      <ToolsProvider>
        <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoute requiredRole="anonymous" />}>
              <Route path="/" element={<ToolLayout />}>
                <Route index element={<UserDashboard />} />
                
                {/* Thay tất cả các route riêng lẻ bằng một route động duy nhất */}
                <Route path=":toolId" element={<ToolRenderer />} />
              </Route>
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin/*" element={<AdminLayout />} />
            </Route>
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<div>Không tìm thấy trang!</div>} />
            <Route path="/pricing" element={<PricingPlan />} />
          </Routes>
        </BrowserRouter>
        </SidebarProvider>
      </ToolsProvider>
    </AuthProvider>
  );
}

export default App;