import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Button, Container, Alert } from "react-bootstrap";


const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  if (token) {
    fetch(`http://localhost:8080/api/auth/verify?token=${token}`, {
      method: "GET", // Sử dụng GET thay vì POST
    })
      .then((response) => {
        if (response.ok) {
          return response.json().then((data) => {
            setMessage(data.message || "Email verified successfully!");
            setError(""); // Đảm bảo xóa trạng thái lỗi
          });
        } else {
          return response.json().then((data) => {
            setError(data.message || "Verification failed!");
            setMessage(""); // Đảm bảo xóa trạng thái thành công
          });
        }
      })
      .catch((err) => {
        console.error("Error during verification:", err);
        setError("An error occurred. Please try again later.");
        setMessage(""); // Đảm bảo xóa trạng thái thành công
      });
  } else {
    setError("Invalid token!");
    setMessage(""); // Đảm bảo xóa trạng thái thành công
  }
}, [location]);

  return (
    <div className="container-fluid vh-100" style={{ backgroundColor: "#FCF9F1" }}>
      <Header hideSearch />
      <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        {message && (
          <Alert variant="success" className="w-100 text-center">
            {message}
          </Alert>
        )}
        {error && (
          <Alert variant="danger" className="w-100 text-center">
            {error}
          </Alert>
        )}
        <Button
          variant="primary"
          style={{ backgroundColor: "#043A84", border: "none", marginTop: "1rem" }}
          onClick={() => navigate("/login")}
        >
          Quay về trang đăng nhập
        </Button>
      </Container>
    </div>
  );
};

export default VerifyEmail;