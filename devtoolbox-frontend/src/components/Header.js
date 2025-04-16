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
  Heart,
  Github,
  InfoCircle,
  Sun,
  Person,
  DiamondFill,
  Search,
} from "react-bootstrap-icons";
import { useSidebar } from "../context/SidebarContext";
import { useNavigate } from "react-router-dom";
import SearchModal from "./SearchModal";

const Header = () => {
  const { expanded, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const [showSearchModal, setShowSearchModal] = useState(false);

  const navigateToHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/login");
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
              <Nav.Link style={{ color: "#000" }} onClick={toggleSidebar}>
                <List />
              </Nav.Link>
              <Nav.Link style={{ color: "#000" }} onClick={navigateToHome}>
                <House />
              </Nav.Link>
            </Nav>
          </div>

          {/* Thanh tìm kiếm có thể nhấn để mở modal */}
          <div
            className="mx-3 cursor-pointer"
            style={{
              maxWidth: expanded ? "500px" : "600px",
              transition: "max-width 0.3s ease",
              flexGrow: 1,
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
                  border: "none",
                }}
              >
                Ctrl + K
              </InputGroup.Text>
            </InputGroup>
          </div>

          <div className="ms-auto d-flex align-items-center">
            {/* Premium Button */}
            <Button variant="warning" className="d-flex align-items-center text-dark">
              <DiamondFill />
              <span className="d-none d-md-inline ms-1">Premium</span>
            </Button>

            {/* Favorites button */}
            <Button variant="danger" className="d-flex align-items-center ms-2">
              <Heart />
              <span className="d-none d-md-inline ms-1">Yêu thích</span>
            </Button>

            <Nav className="ms-2">
              <Nav.Link href="#github" style={{ color: "#000" }}>
                <Github />
              </Nav.Link>
              <Nav.Link href="#info" style={{ color: '#000' }}>
                <InfoCircle />
              </Nav.Link>
              <Nav.Link href="#theme" style={{ color: "#000" }}>
                <Sun />
              </Nav.Link>
            </Nav>

            {/* User Profile Button */}
            <div className="ms-2 border">
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-info"
                  id="profile-dropdown"
                  className="d-flex align-items-center"
                >
                  <Person className="me-md-2" />
                  <span className="d-none d-md-inline">Hồ sơ</span>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item href="#profile">Xem hồ sơ</Dropdown.Item>
                  <Dropdown.Item href="#settings">Cài đặt</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Navbar>
      </div>

      {/* Search Modal Component */}
      <SearchModal 
        show={showSearchModal} 
        onHide={() => setShowSearchModal(false)} 
      />
    </>
  );
};

export default Header;