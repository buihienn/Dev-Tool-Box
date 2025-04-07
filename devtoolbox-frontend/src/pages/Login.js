import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import "../styles/Card.css";
import illustration from "../assets/images/illustration.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        alert(data.message || "Đăng nhập thành công!");
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        alert(data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert(error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#FCF9F1" }}>
      {/* Background Image */}
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
                <p className="small fw-bold fs-3" style={{color: "#043A84"}}>Dev tool box</p>
              </h4>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your username"
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
                  <a href="/forgot-password" className="text-decoration-none fw-bold" style={{ color: "#043A84" }}>
                    Forgot Password?
                  </a>
                </div>
                
                <Button 
                  type="submit" 
                  variant="dark" 
                  className="w-100 py-2 mb-5"
                  style={{ backgroundColor: "#043A84", borderRadius: "8px"}}
                >
                  Login
                </Button>
                
                <div className="text-center">
                  <span className="text-muted">Don't have an Account? </span>
                  <a href="/register" className="text-decoration-none fw-bold" style={{ color: "#043A84" }}>
                    Register
                  </a>
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