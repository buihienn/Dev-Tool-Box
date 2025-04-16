import React, { useState, useEffect } from 'react';
import fetchToolsData from '../data/toolsData';

const ToolHeader = ({ toolId, defaultName = '', defaultDescription = '' }) => {
  const [toolInfo, setToolInfo] = useState({ name: defaultName, description: defaultDescription });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Tìm thông tin tool từ toolsData nếu có toolId
    if (toolId) {
      const fetchTool = async () => {
        try {
          setLoading(true);
          // Gọi hàm fetchToolsData để lấy danh sách công cụ
          const tools = await fetchToolsData();
          // Tìm công cụ cần hiển thị
          const tool = tools.find(t => t.id === toolId);
          if (tool) {
            setToolInfo({
              name: tool.name || defaultName,
              description: tool.description || defaultDescription
            });
          }
        } catch (error) {
          console.error("Error fetching tool data:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchTool();
    }
  }, [toolId, defaultName, defaultDescription]);

  return (
    <div className="tool-header">
      <h3>{loading ? "Đang tải..." : toolInfo.name}</h3>
      <p>{loading ? "" : toolInfo.description}</p>
    </div>
  );
};

export default ToolHeader;