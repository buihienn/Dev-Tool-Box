import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SidebarProvider } from './context/SidebarContext';
import ToolLayout from './pages/ToolLayout';
import UserDashboard from './pages/UserDashboard';

// Import các công cụ
import TokenGeneratorTool from './pages/TokenGeneratorTool';
import HashText from './pages/HashText';
import Bcrypt from './pages/Bcrypt';

function App() {
  return (
    <SidebarProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ToolLayout />}>
            {/* UserDashboard/Trang chủ */}
            <Route index element={<UserDashboard />} />
            
            {/* Các công cụ */}
            <Route path="/token-generator" element={<TokenGeneratorTool />} />
            <Route path="/hash-text" element={<HashText />} />
            <Route path="/bcrypt" element={<Bcrypt />} />
            {/* Thêm các công cụ khác */}
            
            {/* Route cho trường hợp không tìm thấy */}
            <Route path="*" element={<div>Không tìm thấy trang!</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SidebarProvider>
  );
}

export default App;