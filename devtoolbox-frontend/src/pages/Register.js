import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert(data.message || "Đăng ký thành công!");
        navigate("/login"); // Chuyển hướng đến trang đăng nhập
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        </div>
        <div>
          <label>Mật khẩu:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Xác nhận mật khẩu:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Đăng ký</button>
      </form>
      <p>
        Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
      </p>
    </div>
  );
};

export default Register;