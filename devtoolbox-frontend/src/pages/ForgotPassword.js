import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import illustration from "../assets/images/illustration.png";
import "../styles/Card.css";

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
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#FCF9F1" }}>
      <div className="row w-100">
        {/* Left Section */}
        <div className="col-md-6 d-flex flex-column align-items-start justify-content-center ps-5">
          <div className="d-flex justify-content-center w-100">
            <img
              src={illustration}
              alt="People communicating"
              className="img-fluid"
              style={{ maxWidth: "80%" }}
            />
          </div>
        </div>
        {/* Right Section */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <Card className="shadow no-hover" style={{ width: "450px", borderRadius: "12px" }}>
            <Card.Body className="p-4">
              <h2 className="font-monospace mb-3 fw-light fs-4">Forgot Password</h2>
              <h4 className="mb-4">
                <span>Reset your password for</span>
                <p className="small fw-bold fs-3" style={{ color: "#043A84" }}>Dev tool box</p>
              </h4>
              {message && <p className="success-message text-success">{message}</p>}
              {error && <p className="error-message text-danger">{error}</p>}
              {loading && <div className="loading-spinner">Đang xử lý...</div>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="py-2"
                  />
                </Form.Group>
                <Button
                  type="submit"
                  variant="dark"
                  className="w-100 py-2 mb-4"
                  style={{ backgroundColor: "#043A84", borderRadius: "8px" }}
                  disabled={loading}
                >
                  Send request
                </Button>
                <div className="text-center">
                  <Link to="/login" className="text-decoration-none fw-bold" style={{ color: "#043A84" }}>
                    Back to sign in
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;