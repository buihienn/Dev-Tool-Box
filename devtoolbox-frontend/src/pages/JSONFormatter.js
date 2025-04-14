import React, { useState } from 'react';
import { Card, Form, Alert } from 'react-bootstrap';
import '../styles/ToolLayout.css';

const JSONFormatter = () => {
  const [rawJson, setRawJson] = useState('{"group": "11", "Hien": "Vinh"}'); 
  const [formattedJson, setFormattedJson] = useState('{\n  "group": "11",\n  "Hien": "Vinh"\n}'); // JSON đã được định dạng
  const [errorMessage, setErrorMessage] = useState(''); // Thông báo lỗi
  const [indentSize, setIndentSize] = useState(2); // Kích thước thụt lề (mặc định là 2)

  // Hàm xử lý định dạng JSON
  const handleFormatJSON = (inputJson) => {
    try {
      const parsedJson = JSON.parse(inputJson);
      const prettyJson = JSON.stringify(parsedJson, null, indentSize); // Định dạng JSON với thụt lề
      setFormattedJson(prettyJson); // Lưu JSON đã định dạng
      setErrorMessage(''); // Xóa thông báo lỗi
    } catch (error) {
      setFormattedJson(''); // Xóa JSON đã định dạng nếu có lỗi
      setErrorMessage('Provided JSON is not valid'); // Hiển thị thông báo lỗi
    }
  };

  // Hàm xử lý khi người dùng thay đổi JSON thô
  const handleRawJsonChange = (e) => {
    const inputJson = e.target.value;
    setRawJson(inputJson); // Lưu JSON thô
    handleFormatJSON(inputJson); // Tự động định dạng JSON
  };

  // Hàm xử lý khi thay đổi kích thước thụt lề
  const handleIndentSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    setIndentSize(size); // Lưu kích thước thụt lề
    if (rawJson) {
      handleFormatJSON(rawJson); // Cập nhật JSON đã định dạng với kích thước thụt lề mới
    }
  };

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <div className="tool-header">
        <h3>JSON Prettify and Format</h3>
        <p>Prettify your JSON string into a friendly, human-readable format.</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4">
          <Card.Body>
            {/* Hiển thị thông báo lỗi nếu có */}
            {errorMessage && (
              <Alert variant="danger" className="mb-4">
                {errorMessage}
              </Alert>
            )}

            {/* Chọn kích thước thụt lề */}
            <Form.Group className="mb-4" style={{ maxWidth: '200px' }}>
              <Form.Label>Indent size:</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="10"
                value={indentSize}
                onChange={handleIndentSizeChange} // Thay đổi kích thước thụt lề
              />
            </Form.Group>

            {/* Bố cục 2 cột */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              {/* Nhập JSON thô */}
              <Form.Group style={{ flex: 1 }}>
                <Form.Label>Your raw JSON:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={15}
                  placeholder="Enter your JSON here..."
                  value={rawJson}
                  onChange={handleRawJsonChange} // Tự động định dạng khi thay đổi
                />
              </Form.Group>

              {/* Hiển thị JSON đã định dạng */}
              <Form.Group style={{ flex: 1 }}>
                <Form.Label>Prettified version of your JSON:</Form.Label>
                <Form.Control as="textarea" rows={15} readOnly value={formattedJson} />
              </Form.Group>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default JSONFormatter;