import { useState, useEffect } from 'react';

const MAX_RECENT_TOOLS = 3; // Số lượng công cụ gần đây tối đa
const STORAGE_KEY = 'recentTools';

export const useRecentTools = () => {
  const [recentTools, setRecentTools] = useState([]);
  
  // Load danh sách công cụ gần đây từ localStorage khi khởi tạo
  useEffect(() => {
    const loadRecentTools = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setRecentTools(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading recent tools:", error);
      }
    };
    
    loadRecentTools();
    
    // Lắng nghe sự kiện storage để đồng bộ giữa các tab/window
    const handleStorageChange = (event) => {
      if (event.key === STORAGE_KEY) {
        loadRecentTools();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Thêm một công cụ vào danh sách gần đây
  const addToRecentTools = (tool) => {
    if (!tool || !tool.id) return; // Validation
    
    // Tạo một phiên bản của tool an toàn để lưu vào localStorage
    const safeToolForStorage = {
      ...tool,
      // Lưu tên của icon thay vì component (nếu có)
      iconName: typeof tool.icon === 'function' ? tool.icon.name : 
               (typeof tool.icon === 'string' ? tool.icon : null)
    };
    
    // Xóa thuộc tính icon để tránh lỗi khi stringify
    const toolToSave = {...safeToolForStorage};
    delete toolToSave.icon;
    
    setRecentTools(prev => {
      // Loại bỏ tool này nếu đã tồn tại trong danh sách
      const filtered = prev.filter(t => t.id !== tool.id);
      
      // Thêm vào đầu danh sách và giới hạn số lượng
      const updated = [toolToSave, ...filtered].slice(0, MAX_RECENT_TOOLS);
      
      // Lưu vào localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      
      return updated;
    });
    
    // Kích hoạt custom event để thông báo các component khác
    const event = new Event('recentToolsUpdated');
    window.dispatchEvent(event);
  };
  
  // Xóa danh sách công cụ gần đây
  const clearRecentTools = () => {
    setRecentTools([]);
    localStorage.removeItem(STORAGE_KEY);
    
    // Kích hoạt custom event để thông báo các component khác
    const event = new Event('recentToolsUpdated');
    window.dispatchEvent(event);
  };
  
  return {
    recentTools,
    addToRecentTools,
    clearRecentTools
  };
};