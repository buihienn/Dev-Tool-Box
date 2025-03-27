import React from 'react';
import { Card, Form, InputGroup, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import '../styles/ToolLayout.css'; // Import CSS

const HashText = () => {
  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <div className="tool-header">
        <h3>Mã hóa văn bản</h3>
        <p>
          Mã hóa một chuỗi văn bản bằng cách sử dụng các hàm bạn cần: MD5, SHA1, SHA256, SHA224, SHA512, SHA384, SHA3 hoặc RIPEMD160.
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4">
          <Card.Body>
            <Form.Group className="mb-4">
              <Form.Label>Your text to hash:</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Your string to hash..." />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Digest encoding</Form.Label>
              <DropdownButton id="encoding-dropdown" title="Binary (base 2)" variant="outline-dark">
                <Dropdown.Item>Binary (base 2)</Dropdown.Item>
                <Dropdown.Item>Hexadecimal (base 16)</Dropdown.Item>
                <Dropdown.Item>Base64 (base 64)</Dropdown.Item>
                <Dropdown.Item>Base64url (base 64 with url safe chars)</Dropdown.Item>
              </DropdownButton>
            </Form.Group>

            <InputGroup className="mb-3">
              <InputGroup.Text>MD5</InputGroup.Text>
              <Form.Control type="text" readOnly value="Hash result will appear here..." />
              <Button variant="outline-dark">Copy</Button>
            </InputGroup>

            <Button variant="primary">Tạo mã hóa</Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default HashText;