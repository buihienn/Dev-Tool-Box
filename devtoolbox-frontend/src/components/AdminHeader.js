import React from "react";
import { Container, Navbar, Dropdown } from "react-bootstrap";
import { PersonCircle, BoxArrowRight } from "react-bootstrap-icons";
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

  const handleBackToUser = () => {
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/admin" className="fw-bold">
          DevToolBox Admin
        </Navbar.Brand>
        <Dropdown align="end">
          <Dropdown.Toggle variant="outline-light" id="dropdown-admin-user">
            <PersonCircle className="me-2" />
            Admin
          </Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.Item onClick={handleBackToUser}>
              Về phân hệ người dùng
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>
              <span className="text-danger">
                <BoxArrowRight className="me-2" />
                Đăng xuất
              </span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </Navbar>
  );
};

export default AdminHeader;