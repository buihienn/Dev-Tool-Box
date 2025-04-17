import React, { createContext, useState, useContext, useEffect } from 'react';
import fetchToolsData from '../data/toolsData';

const ToolsContext = createContext();

export const useTools = () => useContext(ToolsContext);

export const ToolsProvider = ({ children }) => {
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTools = async () => {
      try {
        setIsLoading(true);
        const data = await fetchToolsData();
        setTools(data);
        setError(null);
      } catch (err) {
        console.error('Error loading tools:', err);
        setError('Không thể tải dữ liệu công cụ');
        setTools([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTools();
  }, []);

  // Kiểm tra tool có enabled không, dựa vào ID
  const isToolEnabled = (toolId) => {
    if (isLoading) return false; // Nếu đang tải, không cho phép truy cập
    const tool = tools.find(tool => tool.id === toolId);

    return tool && tool.isEnabled === true; 
  };

  return (
    <ToolsContext.Provider value={{ tools, isLoading, error, isToolEnabled }}>
      {children}
    </ToolsContext.Provider>
  );
};