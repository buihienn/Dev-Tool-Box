import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../styles/Login.css";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Lấy trang đích từ state, nếu không có thì mặc định là trang chủ
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Kiểm tra vai trò và điều hướng
        if (result.role === 'ADMIN') {
          // Nếu là admin, điều hướng đến trang quản trị
          navigate('/admin', { replace: true });
        } else {
          // Không phải admin thì điều hướng đến trang trước đó hoặc trang chủ
          navigate(from, { replace: true });
        }
      } else {
        if (result.needVerification) {
          const resend = window.confirm(
            "Tài khoản của bạn chưa được xác minh. Bạn có muốn gửi lại email xác minh không?"
          );
          if (resend) {
            try {
              const resendResponse = await fetch("http://localhost:8080/api/auth/resend-verification", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
              });
        
              const resendData = await resendResponse.json();
              if (resendResponse.ok) {
                alert(resendData.message || "Email xác minh đã được gửi lại!");
              } else {
                setError(resendData.message || "Không thể gửi lại email xác minh!");
              }
            } catch (error) {
              console.error("Lỗi khi gửi lại email xác minh:", error);
              setError("Đã xảy ra lỗi, vui lòng thử lại sau!");
            }
          }
        } else {
          setError(result.message);
        }
      }
    } catch (error) {
      console.error("Lỗi khi xử lý đăng nhập:", error);
      setError("Đã xảy ra lỗi, vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Đăng nhập</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Nhập email của bạn"
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu"
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
        <div className="register-link">
          <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
        </div>
        <div className="forgot-password">
          <Link to="/forgot-password">Quên mật khẩu?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;