import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useSidebar } from '../context/SidebarContext';
import { useTools } from '../context/ToolsContext';
import ToolDisabled from './ToolDisabled';

const ToolLayout = () => {
  const location = useLocation();
  const path = location.pathname.slice(1); 
  const { expanded } = useSidebar();
  const { isToolEnabled, isLoading } = useTools();
  
  // Layout luôn được render
  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: expanded ? '250px 1fr' : '0 1fr',
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: `
          "sidebar header"
          "sidebar content"
        `,
        minHeight: '100vh',
        transition: 'grid-template-columns 0.3s ease'
      }}
    >
      {/* Sidebar */}
      <div style={{ 
        gridArea: 'sidebar', 
        background: '#FCF9F1', 
        boxShadow: expanded ? '4px 0 10px rgba(0, 0, 0, 0.1)' : 'none',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        }}>
        <Sidebar />
      </div>

      {/* Header */}
      <div style={{ gridArea: 'header' }}>
        <Header />
      </div>

      {/* Content - Điều kiện nằm trong phần nội dung */}
      <div style={{ 
        gridArea: 'content', 
        overflow: 'auto',
        padding: '1rem',
        background: '#FCF9F1'
      }}>
        {/* Nếu là trang chủ, hiển thị bình thường */}
        {path === "" ? (
          <Outlet />
        ) : isLoading ? (
          // Nếu đang tải dữ liệu
          <div className="d-flex justify-content-center align-items-center" style={{minHeight: '70vh'}}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang kiểm tra trạng thái công cụ...</span>
            </div>
            <span className="ms-2">Đang kiểm tra trạng thái công cụ...</span>
          </div>
        ) : !isToolEnabled(path) ? (
          // Nếu tool bị disabled
          <ToolDisabled toolId={path} />
        ) : (
          // Tool bình thường
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default ToolLayout;