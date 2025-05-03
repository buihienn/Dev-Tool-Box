import React, { createContext, useState, useContext, useEffect } from 'react';
import fetchToolsData from '../data/toolsData';
import fetchCategories from '../data/categoriesData'; 

const ToolsContext = createContext();

export const useTools = () => useContext(ToolsContext);

export const ToolsProvider = ({ children }) => {
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const [toolsData, categoriesData] = await Promise.all([
          fetchToolsData(),
          fetchCategories()
        ]);
        
        setTools(toolsData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Không thể tải dữ liệu');
        setTools([]);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Kiểm tra tool có enabled không, dựa vào ID
  const isToolEnabled = (toolId) => {
    if (isLoading) return false; // Nếu đang tải, không cho phép truy cập
    const tool = tools.find(tool => tool.id === toolId);
    return tool && tool.isEnabled === true; 
  };

  // Lấy tool theo ID
  const getToolById = (toolId) => {
    return tools.find(tool => tool.id === toolId);
  };

  // Lấy tất cả công cụ trong một danh mục
  const getToolsByCategory = (categoryId) => {
    return tools.filter(tool => 
      tool.category && (
        (typeof tool.category === 'object' && tool.category.id === categoryId) || 
        (typeof tool.category === 'string' && tool.category === categoryId)
      ) && tool.isEnabled
    );
  };

  // Lấy danh mục theo ID
  const getCategoryById = (categoryId) => {
    return categories.find(category => category.id === categoryId);
  };

  return (
    <ToolsContext.Provider value={{ 
      tools, 
      categories, 
      isLoading, 
      error, 
      isToolEnabled,
      getToolById,
      getToolsByCategory,
      getCategoryById
    }}>
      {children}
    </ToolsContext.Provider>
  );
};

export default ToolsContext;