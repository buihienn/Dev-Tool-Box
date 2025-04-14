import React, { useState, useEffect } from 'react';
import toolsData from '../data/toolsData';

const ToolHeader = ({ toolId, defaultName = '', defaultDescription = '' }) => {
  const [toolInfo, setToolInfo] = useState({ name: defaultName, description: defaultDescription });

  useEffect(() => {
    // Tìm thông tin tool từ toolsData nếu có toolId
    if (toolId) {
      const tool = toolsData.find(tool => tool.id === toolId);
      if (tool) {
        setToolInfo({
          name: tool.name || defaultName,
          description: tool.description || defaultDescription
        });
      }
    }
  }, [toolId, defaultName, defaultDescription]);

  return (
    <div className="tool-header">
      <h3>{toolInfo.name}</h3>
      <p>{toolInfo.description}</p>
    </div>
  );
};

export default ToolHeader;