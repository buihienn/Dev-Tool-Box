import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Component bảo vệ route dựa trên quyền
const ProtectedRoute = ({ requiredRole }) => {
  const { hasPermission, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    // Hiển thị spinner hoặc loading khi đang kiểm tra trạng thái
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  // Kiểm tra quyền truy cập
  if (!hasPermission(requiredRole)) {
    // Nếu yêu cầu đăng nhập nhưng chưa đăng nhập, chuyển hướng đến trang đăng nhập
    if (!isAuthenticated && requiredRole !== 'anonymous') {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // Nếu không có quyền, chuyển hướng đến trang không có quyền truy cập
    return <Navigate to="/unauthorized" replace />;
  }

  // Nếu có quyền, hiển thị nội dung của route
  return <Outlet />;
};

export default ProtectedRoute;