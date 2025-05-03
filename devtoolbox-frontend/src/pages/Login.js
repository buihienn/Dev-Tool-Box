import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Card, Form, Button, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import illustration from "../assets/images/illustration.png"; 
import "../styles/Card.css";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

// Lấy trang đích từ state, nếu không có thì mặc định là trang chủ
  const from = location.state?.from?.pathname || "/";

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        if (result.role === 'ADMIN') {
          navigate('/admin', { replace: true });
        } else {
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
              <h2 className="font-monospace mb-3 fw-light fs-4">Welcome!</h2>
              <h4 className="mb-4">
                Sign in to
                <p className="small fw-bold fs-3" style={{ color: "#043A84" }}>Dev tool box</p>
              </h4>
              {error && <p className="error-message text-danger">{error}</p>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="py-2"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="py-2"
                    />
                    <InputGroup.Text
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? <EyeSlash /> : <Eye />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check
                    type="checkbox"
                    id="rememberMe"
                    label="Remember me"
                  />
                  <Link to="/forgot-password" className="text-decoration-none fw-bold" style={{ color: "#043A84" }}>
                    Forgot Password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  variant="dark"
                  className="w-100 py-2 mb-5"
                  style={{ backgroundColor: "#043A84", borderRadius: "8px" }}
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Login"}
                </Button>
                <div className="text-center">
                  <span className="text-muted">Don't have an Account? </span>
                  <Link to="/register" className="text-decoration-none fw-bold" style={{ color: "#043A84" }}>
                    Register
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

export default Login;