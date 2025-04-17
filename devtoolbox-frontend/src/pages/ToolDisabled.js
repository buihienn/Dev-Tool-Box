import React from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { XCircleFill } from 'react-bootstrap-icons';

const ToolDisabled = ({ toolId }) => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Alert variant="warning" className="text-center p-5 shadow-sm">
            <XCircleFill size={48} className="text-warning mb-3" />
            <Alert.Heading>Công cụ không khả dụng</Alert.Heading>
            <p className="mb-4">
              Rất tiếc, công cụ <strong>{toolId}</strong> hiện đã bị vô hiệu hóa hoặc đang trong quá trình bảo trì.
            </p>
            <p className="mb-4">
              Vui lòng thử lại sau hoặc chọn một công cụ khác từ sidebar.
            </p>
            <div className="d-flex justify-content-center">
              <Button as={Link} to="/" variant="secondary">
                Quay về Trang chủ
              </Button>
            </div>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default ToolDisabled;