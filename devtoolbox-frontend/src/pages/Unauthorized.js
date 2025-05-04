import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const Unauthorized = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="container-fluid vh-100" style={{ backgroundColor: "#FCF9F1" }}>
      <Header hideSearch />
      <div
        className="container py-5 d-flex flex-column justify-content-center align-items-center"
      >
        <h1 className="text-center text-danger mb-4">Không có quyền truy cập</h1>
        <p className="mb-4 text-center">Bạn không có quyền truy cập vào trang này.</p>
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
    </div>
  );
};

export default Unauthorized;