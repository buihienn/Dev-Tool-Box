import React, { useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import ToolHeader from '../components/ToolHeader';

const UrlEncoder = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('encode'); // 'encode' hoặc 'decode'

  const handleEncode = () => {
    try {
      const encoded = encodeURIComponent(inputText);
      setOutputText(encoded);
    } catch (error) {
      setOutputText('Lỗi khi mã hóa: ' + error.message);
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeURIComponent(inputText);
      setOutputText(decoded);
    } catch (error) {
      setOutputText('Lỗi khi giải mã: ' + error.message);
    }
  };

  const handleModeChange = (e) => {
    setMode(e.target.value);
    setOutputText(''); // Reset output khi chuyển chế độ
  };

  const handleProcess = () => {
    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const handleSwap = () => {
    setInputText(outputText);
    setOutputText('');
  };

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <ToolHeader toolId="urlencoder" />
      
      <Card className="bg-light text-dark" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card.Body>
          <h4 className="mb-4 text-center">URL Encoder/Decoder</h4>
          
          <Form.Group className="mb-3">
            <Form.Label>Chế độ:</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="Mã hóa URL"
                name="modeGroup"
                id="encode-mode"
                value="encode"
                checked={mode === 'encode'}
                onChange={handleModeChange}
              />
              <Form.Check
                inline
                type="radio"
                label="Giải mã URL"
                name="modeGroup"
                id="decode-mode"
                value="decode"
                checked={mode === 'decode'}
                onChange={handleModeChange}
              />
            </div>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Văn bản đầu vào:</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={mode === 'encode' ? 'Nhập văn bản cần mã hóa...' : 'Nhập văn bản đã mã hóa cần giải mã...'}
            />
          </Form.Group>
          
          <Row className="mb-3">
            <Col className="d-flex justify-content-center">
              <Button variant="primary" onClick={handleProcess} className="mx-2">
                {mode === 'encode' ? 'Mã hóa' : 'Giải mã'}
              </Button>
              <Button variant="secondary" onClick={handleSwap} className="mx-2">
                Hoán đổi
              </Button>
              <Button variant="outline-danger" onClick={() => {setInputText(''); setOutputText('')}} className="mx-2">
                Xóa
              </Button>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Kết quả:</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={outputText}
              readOnly
              placeholder="Kết quả sẽ hiển thị ở đây..."
            />
          </Form.Group>
          
          <div className="mt-4">
            <h5>Thông tin</h5>
            <p className="text-muted small">
              URL Encoding chuyển đổi các ký tự đặc biệt thành định dạng có thể sử dụng trong URL. 
              Ví dụ, khoảng trắng được chuyển đổi thành "%20", và các ký tự như "?", "&", "/" được mã hóa thành 
              các giá trị tương ứng.
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UrlEncoder;