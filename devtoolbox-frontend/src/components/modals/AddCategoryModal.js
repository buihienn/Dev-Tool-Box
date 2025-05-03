import React from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';

const AddCategoryModal = ({
  show,
  onHide,
  onAddCategory,
  addingCategory,
  newCategoryName,
  setNewCategoryName,
  newCategoryDescription,
  setNewCategoryDescription
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm danh mục mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Tên danh mục <span className="text-danger">*</span></Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Nhập tên danh mục" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Mô tả (tùy chọn)</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3}
              placeholder="Nhập mô tả cho danh mục" 
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button 
          variant="primary" 
          onClick={onAddCategory}
          disabled={addingCategory}
        >
          {addingCategory ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Đang lưu...
            </>
          ) : 'Thêm danh mục'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCategoryModal;