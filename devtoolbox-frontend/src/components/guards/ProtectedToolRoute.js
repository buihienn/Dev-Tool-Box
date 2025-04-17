import React from 'react';
import { useTools } from '../../context/ToolsContext';
import ToolDisabled from '../../pages/ToolDisabled';

const ProtectedToolRoute = ({ toolId, element }) => {
  const { isToolEnabled, isLoading } = useTools();

  // Nếu chưa tải xong dữ liệu công cụ, hiển thị loading
  if (isLoading) {
    return <div>Đang kiểm tra trạng thái công cụ...</div>;
  }

  // Nếu tool đã disabled, chuyển hướng đến trang thông báo
  if (!isToolEnabled(toolId)) {
    return <ToolDisabled toolId={toolId} />;
  }

  console.log("Tool ID:", toolId);
  console.log("Is tool enabled:", isToolEnabled(toolId));

  // Nếu tool enabled, render component tương ứng
  return element;
};

export default ProtectedToolRoute;