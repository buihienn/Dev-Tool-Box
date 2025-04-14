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
import MathEvaluator from './pages/MathEvaluator';
import ULID from './pages/UlidGenerator';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import IntegerBaseConverter from './pages/IntegerBaseConverter';
import TextToNatoAlphabet from './pages/TextToNatoAlphabet';
import XMLToJSON from './pages/XMLToJSON';
import URLParser from './pages/URLParser';

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
            <Route path="base-converter" element={<IntegerBaseConverter />} />
            <Route path="text-to-nato-alphabet" element={<TextToNatoAlphabet />} />
            <Route path="xml-to-json" element={<XMLToJSON />} />
            <Route path="url-parser" element={<URLParser />} />
          </Route>

          {/* Các route không cần ToolLayout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify" element={<VerifyEmail />} />
          {/* Route không tìm thấy */}
          <Route path="*" element={<div>Không tìm thấy trang!</div>} />
        </Routes>
      </BrowserRouter>
    </SidebarProvider>
  );
}

export default App;