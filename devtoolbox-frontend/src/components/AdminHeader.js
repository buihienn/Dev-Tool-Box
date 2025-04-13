import React from "react";
import { Container, Navbar, Button } from "react-bootstrap";
import { BoxArrowRight } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import '../styles/Admin.css';

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/admin" className="fw-bold">
          <img 
            src="/logo.png" 
            alt="DevToolBox Logo" 
            height="30" 
            className="d-inline-block align-top me-2"
          />
          DevToolBox Admin
        </Navbar.Brand>
        <Button variant="outline-light" onClick={handleLogout}>
          <BoxArrowRight className="me-2" />
          Đăng xuất
        </Button>
      </Container>
    </Navbar>
  );
};

export default AdminHeader;