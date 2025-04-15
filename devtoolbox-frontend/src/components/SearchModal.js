import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, InputGroup, ListGroup } from 'react-bootstrap';
import { Search, X, ArrowRight } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import toolsData from '../data/toolsData';
import '../styles/SearchModal.css'; 

const SearchModal = ({ show, onHide }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Focus vào input khi modal mở
  useEffect(() => {
    if (show && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [show]);

  // Reset search state khi đóng modal
  useEffect(() => {
    if (!show) {
      setSearchTerm('');
      setSearchResults([]);
      setSelectedIndex(0);
    }
  }, [show]);

  // Thực hiện tìm kiếm khi searchTerm thay đổi
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const normalizedSearchTerm = searchTerm.toLowerCase();
    
    const results = toolsData
      .filter(tool => tool.isEnabled)
      .filter(tool => 
        tool.name.toLowerCase().includes(normalizedSearchTerm) ||
        tool.description.toLowerCase().includes(normalizedSearchTerm)
      )
      .slice(0, 8); // Giới hạn kết quả tìm kiếm
    
    setSearchResults(results);
    setSelectedIndex(0); // Reset selected index khi kết quả tìm kiếm thay đổi
  }, [searchTerm]);

  // Xử lý navigation bằng phím mũi tên
  const handleKeyDown = (e) => {
    // Đóng modal khi nhấn Escape
    if (e.key === 'Escape') {
      onHide();
      return;
    }

    if (searchResults.length === 0) return;

    // Di chuyển lên
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prevIndex) => 
        prevIndex > 0 ? prevIndex - 1 : searchResults.length - 1
      );
    }
    
    // Di chuyển xuống
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prevIndex) => 
        prevIndex < searchResults.length - 1 ? prevIndex + 1 : 0
      );
    }
    
    // Nhấn Enter để chọn
    else if (e.key === 'Enter' && searchResults.length > 0) {
      e.preventDefault();
      navigateTo(searchResults[selectedIndex].id);
    }
  };

  // Điều hướng đến trang công cụ và đóng modal
  const navigateTo = (toolId) => {
    navigate(`/${toolId}`);
    onHide();
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      dialogClassName="search-modal"
      contentClassName="border-0 shadow"
    >
      <Modal.Header className="bg-light border-0">
        <InputGroup className="w-100">
          <InputGroup.Text className="bg-light border-0">
            <Search />
          </InputGroup.Text>
          <Form.Control
            ref={inputRef}
            placeholder="Tìm kiếm công cụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-light border-0 shadow-none"
            autoFocus
          />
          {searchTerm && (
            <InputGroup.Text 
              className="bg-light border-0 cursor-pointer" 
              onClick={() => setSearchTerm('')}
            >
              <X />
            </InputGroup.Text>
          )}
        </InputGroup>
        <button 
          className="btn-close ms-2" 
          onClick={onHide}
          aria-label="Close"
        ></button>
      </Modal.Header>
      
      <Modal.Body className="p-0">
        {searchResults.length > 0 ? (
          <ListGroup variant="flush">
            {searchResults.map((tool, index) => (
              <ListGroup.Item
                key={tool.id}
                action
                className={`d-flex align-items-center p-3 ${
                  index === selectedIndex ? 'selected-item' : ''
                }`}
                onClick={() => navigateTo(tool.id)}
              >
                <div className="me-2">
                  {React.createElement(tool.icon, { 
                    size: 20,
                    color: index === selectedIndex ? "white" : undefined
                  })}
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>{tool.name}</strong>
                  </div>
                  <small className={index === selectedIndex ? "text-white" : "text-muted"}>
                    {tool.description}
                  </small>
                </div>
                <ArrowRight className="ms-2" color={index === selectedIndex ? "white" : undefined} />
            </ListGroup.Item>
            ))}
          </ListGroup>
        ) : searchTerm ? (
          <div className="p-4 text-center text-muted">
            <p>Không tìm thấy công cụ nào phù hợp với "{searchTerm}"</p>
          </div>
        ) : null}
      </Modal.Body>
      
      <Modal.Footer className="border-0 bg-light">
        <div className="d-flex w-100 justify-content-between align-items-center text-muted">
          <small>
            <span className="me-2"><kbd>↑</kbd> <kbd>↓</kbd> để điều hướng</span>
            <span className="me-2"><kbd>Enter</kbd> để chọn</span>
            <span><kbd>Esc</kbd> để đóng</span>
          </small>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default SearchModal;