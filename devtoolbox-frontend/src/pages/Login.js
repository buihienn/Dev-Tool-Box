import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css"; // Import file CSS
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Lưu token vào localStorage
        localStorage.setItem("token", data.token);
  
        // Giải mã token để lấy email
        const decodedToken = jwtDecode(data.token); // Giải mã token
        const userEmail = decodedToken.sub; // Lấy email từ subject
        const userRole = decodedToken.role; // Lấy vai trò từ payload
        localStorage.setItem("email", userEmail); // Lưu email vào localStorage
        localStorage.setItem("role", userRole); // Lưu vai trò vào localStorage
  
        // Hiển thị thông báo thành công
        alert(`Đăng nhập thành công! Xin chào ${userEmail} (${decodedToken.role})`);
  
        // Chuyển hướng đến trang chủ
        navigate("/");
      } else {
        if (data.message === "Please verify your email before logging in!") {
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
          setError(data.message || "Đăng nhập thất bại!");
        }
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
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