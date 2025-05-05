import React, { useState, useEffect, useCallback } from "react";
import {
  Navbar,
  Nav,
  Form,
  InputGroup,
  Button,
  Dropdown,
} from "react-bootstrap";
import {
  List,
  House,
  Github,
  InfoCircle,
  Gem,
  Search,
  BoxArrowInRight,
  PersonCircle,
  BoxArrowRight,
} from "react-bootstrap-icons";
import { useSidebar } from "../context/SidebarContext";
import { useNavigate } from "react-router-dom";
import SearchModal from "./SearchModal";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css"; 

const Header = ({ hideSearch = false }) => {
  const { expanded, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { currentUser, userRole, logout, isAuthenticated, isPremium } = useAuth();

  const navigateToHome = () => {
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout(); // Sử dụng hàm logout từ AuthContext
    navigate("/");
  };

  // Xử lý phím tắt Ctrl + K để mở modal tìm kiếm
  const handleKeyPress = useCallback((event) => {
    // Mở modal tìm kiếm khi nhấn Ctrl + K
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      setShowSearchModal(true);
    }
  }, []);

  // Thêm event listener khi component mount
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    
    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <>
      <div className="header">
        <Navbar style={{ backgroundColor: "#FCF9F1", color: "#000" }} className="px-3 py-2">
          <div className="d-flex align-items-center">
            <Nav className="ms-2">
            {!hideSearch && (
              <Nav.Link style={{ color: "#000" }} onClick={toggleSidebar}>
                <List />
              </Nav.Link>
            )}
              <Nav.Link style={{ color: "#000" }} onClick={navigateToHome}>
                <House />
              </Nav.Link>
            </Nav>
          </div>

          {/* Thanh tìm kiếm có thể nhấn để mở modal */}
          {!hideSearch && (
            <div
              className="mx-3 cursor-pointer"
              style={{
                flex: "1 1 0%",
                minWidth: 0,    
                transition: "max-width 0.3s ease",
                maxWidth: "100%",
              }}
              onClick={() => setShowSearchModal(true)}
            >
              <InputGroup
                style={{
                  backgroundColor: "#E0E0E0",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                <InputGroup.Text
                  style={{
                    backgroundColor: "#E0E0E0",
                    color: "#000",
                    border: "none",
                  }}
                >
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Tìm kiếm công cụ..."
                  aria-label="Tìm kiếm"
                  style={{
                    backgroundColor: "#E0E0E0",
                    color: "#000",
                    border: "none",
                    cursor: "pointer",
                  }}
                  readOnly
                />
                <InputGroup.Text
                  style={{
                    backgroundColor: "#E0E0E0",
                    color: "#000",
                  }}
                >
                  Ctrl + K
                </InputGroup.Text>
              </InputGroup>
            </div>
          )}

          <div className="ms-auto d-flex align-items-center">
            {/* Premium Button - Hiển thị Premium nếu đã đăng nhập */}
            {!isPremium && (
              <Button
                variant="warning"
                className="d-flex align-items-center text-dark"
                onClick={() => navigate("/pricing")}
              >
                <Gem />
                <span className="d-none d-md-inline ms-1">Premium</span>
              </Button>
            )}

            <Nav className="ms-2">
            <Nav.Link
                href="https://github.com/buihienn/Dev-Tool-Box"
                style={{ color: "#000" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github />
              </Nav.Link>
              <Nav.Link href="/info" style={{ color: '#000' }}>
                <InfoCircle />
              </Nav.Link>
            </Nav>

            {/* Điều kiện render dựa trên trạng thái đăng nhập */}
            {isAuthenticated ? (
              // User Profile Dropdown khi đã đăng nhập
              <div className="ms-2">
                <Dropdown>
                  <Dropdown.Toggle
                    variant="outline-info"
                    id="profile-dropdown"
                    className="d-flex align-items-center"
                  >
                    <PersonCircle className="me-md-2" />
                    <span className="d-none d-md-inline">
                      {currentUser?.email?.split('@')[0]}
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    {userRole === 'ADMIN' && (
                      <Dropdown.Item onClick={() => navigate('/admin')}>Quản lý hệ thống</Dropdown.Item>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <span className="text-danger">
                        <BoxArrowRight className="me-2" />
                        Đăng xuất
                      </span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ) : (
              // Nút đăng nhập khi chưa đăng nhập
              <Button 
                style={{
                  backgroundColor: "#043A84",
                  color: "#fff",
                  border: "none"
                }}
                className="ms-2 d-flex align-items-center"
                onClick={handleLogin}
              >
                <BoxArrowInRight className="me-md-1" />
                <span className="d-none d-sm-inline">Đăng nhập</span>
              </Button>
            )}
          </div>
        </Navbar>
      </div>

      {/* Search Modal Component */}
      {!hideSearch && (
        <SearchModal 
          show={showSearchModal} 
          onHide={() => setShowSearchModal(false)} 
        />
      )}
    </>
  );
};

export default Header;