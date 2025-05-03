import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="container-fluid vh-100" style={{ backgroundColor: "#FCF9F1" }}>
      <h1 className="text-danger mb-4">Không có quyền truy cập</h1>
      <p className="mb-4">Bạn không có quyền truy cập vào trang này.</p>
      <div>
        {isAuthenticated ? (
          <>
            <Link to="/" className="btn btn-primary me-3">Về trang chủ</Link>
            <button onClick={logout} className="btn btn-outline-danger">Đăng xuất</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-primary me-3">Đăng nhập</Link>
            <Link to="/" className="btn btn-secondary">Về trang chủ</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Unauthorized;