import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ToolRenderer from '../pages/ToolRenderer';
import { useTools } from '../context/ToolsContext';
import { Spinner } from 'react-bootstrap';

const DynamicRoutes = () => {
  const { tools, loading, error } = useTools();

  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" variant="primary" />
        <p>Đang tải danh sách công cụ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-3">
        <p>Lỗi tải danh sách công cụ: {error}</p>
      </div>
    );
  }

  return (
    <Routes>
      {tools.map(tool => (
        <Route 
          key={tool.id}
          path={`/${tool.id}`} 
          element={<ToolRenderer toolId={tool.id} />} 
        />
      ))}
      {/* Route mặc định cho các tool không có trong danh sách */}
      <Route path="/:toolId" element={<ToolRenderer />} />
    </Routes>
  );
};

export default DynamicRoutes;