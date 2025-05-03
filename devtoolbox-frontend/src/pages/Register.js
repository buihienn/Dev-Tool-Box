import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Button, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import illustration from "../assets/images/illustration.png"; 
import "../styles/Card.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateEmail(email)) {
      setError("Email không hợp lệ!");
      return;
    }

    if (!username.trim()) {
      setError("Vui lòng nhập tên người dùng!");
      return;
    }

    if (!validatePassword(password)) {
      setError("Mật khẩu phải có ít nhất 8 ký tự!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(data.message || "Đăng ký thành công!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Đăng ký thất bại!");
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
              <h2 className="font-monospace mb-3 fw-light fs-4">Welcome!</h2>
              <h4 className="mb-4">
                Sign up to
                <p className="small fw-bold fs-3" style={{ color: "#043A84" }}>Dev tool box</p>
              </h4>
              {error && <p className="error-message text-danger">{error}</p>}
              {success && <p className="success-message text-success">{success}</p>}
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
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="py-2"
                    />
                    <InputGroup.Text
                      onClick={toggleConfirmPasswordVisibility}
                      style={{ cursor: "pointer" }}
                    >
                      {showConfirmPassword ? <EyeSlash /> : <Eye />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Button
                  type="submit"
                  variant="dark"
                  className="w-100 py-2 mb-5"
                  style={{ backgroundColor: "#043A84", borderRadius: "8px" }}
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Register"}
                </Button>
                <div className="text-center">
                  <span className="text-muted">Already have an Account? </span>
                  <Link to="/login" className="text-decoration-none fw-bold" style={{ color: "#043A84" }}>
                    Login
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

export default Register;