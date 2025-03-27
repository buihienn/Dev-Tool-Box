import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { House, ArrowLeft } from 'react-bootstrap-icons';

const NotFound = () => {
  return (
    <div className="text-center py-5">
      <h2 className="mb-4">Không tìm thấy trang</h2>
      <p className="mb-4">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      
      <div className="d-flex justify-content-center gap-3">
        <Button as={Link} to="/" variant="primary">
          <House className="me-2" />
          Về trang chủ
        </Button>
        <Button variant="outline-secondary" onClick={() => window.history.back()}>
          <ArrowLeft className="me-2" />
          Quay lại
        </Button>
      </div>
    </div>
  );
};

export default NotFound;