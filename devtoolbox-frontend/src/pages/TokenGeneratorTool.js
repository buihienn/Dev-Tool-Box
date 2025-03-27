import React from 'react';
import { Card, Form, Button, InputGroup, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import '../styles/ToolLayout.css'; // Import CSS

const TokenGeneratorTool = () => {
  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <div className="tool-header">
        <h3>Trình tạo mã thông báo</h3>
        <p>
          Tạo chuỗi ngẫu nhiên với các ký tự bạn muốn, chữ hoa hoặc chữ thường, số và/hoặc ký tự đặc biệt.
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4">
          <Card.Body>
            <div className="mb-4">
              <ToggleButtonGroup type="checkbox" className="mb-3">
                <ToggleButton id="uppercase" type="checkbox" variant="outline-dark" value="uppercase">
                  Chữ hoa (ABC...)
                </ToggleButton>
                <ToggleButton id="lowercase" type="checkbox" variant="outline-dark" value="lowercase">
                  Chữ thường (abc...)
                </ToggleButton>
                <ToggleButton id="numbers" type="checkbox" variant="outline-dark" value="numbers">
                  Số (123...)
                </ToggleButton>
                <ToggleButton id="specialChars" type="checkbox" variant="outline-dark" value="specialChars">
                  Ký tự đặc biệt (!@#...)
                </ToggleButton>
              </ToggleButtonGroup>
            </div>

            <Form.Group className="mb-4">
              <Form.Label>Độ dài (64)</Form.Label>
              <Form.Range min={8} max={128} value={64} />
            </Form.Group>

            <InputGroup className="mb-4">
              <Form.Control as="textarea" rows={2} readOnly value="Generated token will appear here..." />
            </InputGroup>

            <div className="d-flex gap-2">
              <Button variant="success">Sao chép</Button>
              <Button variant="primary">Làm mới</Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default TokenGeneratorTool;