import React from 'react';
import { Modal, Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import { PlusLg } from 'react-bootstrap-icons';

const AddToolModal = ({ 
  show, 
  onHide, 
  onAddTool, 
  onShowCategoryModal,
  uploading,
  newToolId,
  setNewToolId,
  newToolName,
  setNewToolName,
  newToolCategory,
  setNewToolCategory,
  setNewToolFile,
  categories
}) => {
  // Xử lý khi chọn file
  const handleFileChange = (e) => {
    setNewToolFile(e.target.files[0]);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm công cụ mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>ID công cụ</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Nhập ID của công cụ (ví dụ: bcrypt)" 
              value={newToolId}
              onChange={(e) => setNewToolId(e.target.value)}
            />
            <Form.Text className="text-muted">
              ID này sẽ được sử dụng để định danh công cụ trong hệ thống
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Tên công cụ</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Nhập tên công cụ" 
              value={newToolName}
              onChange={(e) => setNewToolName(e.target.value)}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Danh mục</Form.Label>
            <InputGroup>
              <Form.Select 
                value={newToolCategory}
                onChange={(e) => setNewToolCategory(e.target.value)}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
              <Button 
                variant="outline-primary" 
                onClick={onShowCategoryModal}
              >
                <PlusLg /> Danh mục mới
              </Button>
            </InputGroup>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>File JavaScript (.js)</Form.Label>
            <Form.Control 
              type="file" 
              accept=".js"
              onChange={handleFileChange}
            />
            <Form.Text className="text-muted">
              Chỉ chấp nhận file JavaScript (.js)
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button 
          variant="primary" 
          onClick={onAddTool}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Đang tải lên...
            </>
          ) : 'Thêm công cụ'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddToolModal;