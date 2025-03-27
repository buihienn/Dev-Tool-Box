import React, { createContext, useState, useContext } from 'react';

// Tạo context cho sidebar
const SidebarContext = createContext();

// Provider component quản lý state sidebar
export const SidebarProvider = ({ children }) => {
  const [expanded, setExpanded] = useState(true);

  const toggleSidebar = () => {
    setExpanded(prevState => !prevState);
  };

  return (
    <SidebarContext.Provider value={{ expanded, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook để sử dụng SidebarContext
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};