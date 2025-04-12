import React, { useState } from "react";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!validateEmail(email)) {
      setError("Email không hợp lệ. Vui lòng nhập đúng định dạng email.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.");
      } else {
        if (response.status === 400) {
          setError(data.message || "Email không tồn tại hoặc chưa được đăng ký.");
        } else if (response.status === 500) {
          setError("Lỗi máy chủ. Vui lòng thử lại sau!");
        } else {
          setError(data.message || "Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại!");
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
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Quên mật khẩu</h2>
        {/* Hiển thị thông báo thành công */}
        {message && <p className="success-message">{message}</p>}
        {/* Hiển thị thông báo lỗi */}
        {error && <p className="error-message">{error}</p>}
        {/* Hiển thị spinner khi đang loading */}
        {loading && <div className="loading-spinner">Đang xử lý...</div>}
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
          <button type="submit" className="forgot-password-button" disabled={loading}>
            Gửi yêu cầu
          </button>
        </form>
        <div className="back-to-login">
          <a href="/login">Quay lại trang đăng nhập</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;