import React, { useState } from 'react';
import { Button, InputGroup, Form, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import '../styles/ToolLayout.css';
import ToolHeader from '../components/ToolHeader';

const UlidGenerator = () => {
  const [generatedUlid, setGeneratedUlid] = useState('');
  const [quantity, setQuantity] = useState(1); // Số lượng ULID cần tạo
  const [format, setFormat] = useState('Raw'); // Định dạng ULID (Raw hoặc JSON)

  // Hàm để tạo ULID
  const handleGenerateUlid = async () => {
    try {
      const response = await fetch(`http://localhost:8080/tool/ulid/generate?quantity=${quantity}&format=${format}`, {
        method: 'GET',
      });

      if (response.ok) {
        const ulid = await response.text(); // Backend trả về ULID dưới dạng chuỗi
        setGeneratedUlid(ulid);
      } else {
        alert('Không thể tạo ULID. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      alert('Đã xảy ra lỗi, vui lòng thử lại sau!');
    }
  };

  // Hàm để sao chép ULID vào clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUlid);
    alert('Copied to clipboard!');
  };

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <ToolHeader toolId="ulid" />

      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        {/* Quantity */}
        <InputGroup className="mb-3">
          <InputGroup.Text>Quantity</InputGroup.Text>
          <Form.Control
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            style={{ textAlign: 'center', flex: 1 }}
          />
          <Button variant="outline-dark" onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}>-</Button>
          <Button variant="outline-dark" onClick={() => setQuantity((prev) => prev + 1)}>+</Button>
        </InputGroup>

        {/* Format */}
        <div className="mb-3">
          <span className="me-2">Format:</span>
          <ToggleButtonGroup type="radio" name="format" value={format} onChange={setFormat}>
            <ToggleButton id="format-raw" value="Raw" variant="outline-success">
              Raw
            </ToggleButton>
            <ToggleButton id="format-json" value="JSON" variant="outline-secondary">
              JSON
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        {/* Hiển thị ULID đã tạo */}
        <InputGroup className="mb-4">
          <Form.Control
            as="textarea"
            rows={3}
            readOnly
            value={generatedUlid}
            placeholder="Generated ULID will appear here..."
          />
        </InputGroup>

        {/* Nút Refresh và Copy */}
        <div className="d-flex justify-content-end">
          <Button variant="primary" className="me-2" onClick={handleGenerateUlid}>
            Refresh
          </Button>
          <Button variant="outline-dark" onClick={handleCopy} disabled={!generatedUlid}>
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UlidGenerator;