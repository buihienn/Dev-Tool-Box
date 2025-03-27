import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useSidebar } from '../context/SidebarContext';

const ToolLayout = () => {
  const { expanded } = useSidebar();

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
      {/* Sidebar - grid area sidebar */}
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

      {/* Header - grid area header */}
      <div style={{ gridArea: 'header' }}>
        <Header />
      </div>

      {/* Content - grid area content */}
      <div style={{ 
        gridArea: 'content', 
        overflow: 'auto',
        padding: '1rem',
        background: '#FCF9F1'
      }}>
        <Outlet />
      </div>
    </div>
  );
};

export default ToolLayout;