import React, { useState } from "react";
import "../styles/ForgotPassword.css"; // Import file CSS

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
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
        setError(data.message || "Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại!");
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
        {message && <p className="success-message">{message}</p>}
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
          <button type="submit" className="forgot-password-button" disabled={loading}>
            {loading ? "Đang xử lý..." : "Gửi yêu cầu"}
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