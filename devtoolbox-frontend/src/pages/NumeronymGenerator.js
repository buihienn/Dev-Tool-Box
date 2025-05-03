import React, { useState, useRef } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import { Clipboard, ArrowClockwise } from 'react-bootstrap-icons';
import ToolHeader from '../components/ToolHeader';
import '../styles/ToolLayout.css';
import '../styles/Card.css';

const NumeronymGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [numeronym, setNumeronym] = useState('');
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const resultInputRef = useRef(null);
  
  // Tạo numeronym từ văn bản nhập vào
  const generateNumeronym = async () => {
    if (!inputText.trim()) {
      setNumeronym('');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/tool/numeronym/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText })
      });
      
      if (response.ok) {
        const data = await response.json();
        setNumeronym(data.result);
      } else {
        console.error('Có lỗi xảy ra khi tạo numeronym');
        setNumeronym('Có lỗi xảy ra. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      setNumeronym('Lỗi kết nối đến server. Vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };
  
  // Xử lý khi người dùng thay đổi văn bản đầu vào
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };
  
  // Xử lý khi người dùng nhấn nút tạo
  const handleGenerate = (e) => {
    e.preventDefault();
    generateNumeronym();
  };
  
  // Sao chép kết quả vào clipboard
  const handleCopy = () => {
    if (!numeronym) return;
    
    navigator.clipboard.writeText(numeronym);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
  
  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <ToolHeader toolId="numeronym"/>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4 no-hover">
          <Card.Body>
            <Form onSubmit={handleGenerate}>
              <Form.Group className="mb-4">
                <Form.Label>
                  <strong>Nhập văn bản</strong>
                </Form.Label>
                <Form.Control
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder="Nhập văn bản để tạo numeronym..."
                  style={{ 
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontSize: '16px'
                  }}
                />
              </Form.Group>
              
              <div className="d-grid mb-4">
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={loading || !inputText.trim()}
                >
                  {loading ? 'Đang xử lý...' : (
                    <>
                      <ArrowClockwise className="me-2" /> Tạo Numeronym
                    </>
                  )}
                </Button>
              </div>
              
              <Form.Group>
                <Form.Label>
                    <strong>Kết quả Numeronym</strong>
                </Form.Label>
                
                <InputGroup>
                    <Form.Control
                    ref={resultInputRef}
                    type="text"
                    value={numeronym}
                    readOnly
                    placeholder="Kết quả sẽ hiển thị ở đây..."
                    style={{ 
                        fontFamily: 'monospace',
                        fontSize: '16px',
                        backgroundColor: numeronym ? '#f8f9fa' : '#e9ecef'
                    }}
                    />
                    <Button 
                    variant="outline-dark" 
                    onClick={handleCopy}
                    disabled={!numeronym}
                    >
                    {copySuccess ? 'Copied!' : 'Copy'}
                    </Button>
                </InputGroup>
                </Form.Group>
            </Form>
            
            <hr className="my-4" />
            
            <div>
              <h5>Ví dụ các Numeronym phổ biến:</h5>
              <table className="table table-bordered mt-3">
                <thead>
                  <tr>
                    <th>Numeronym</th>
                    <th>Từ gốc</th>
                    <th>Giải thích</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>i18n</code></td>
                    <td>internationalization</td>
                    <td>i + 18 chữ cái + n</td>
                  </tr>
                  <tr>
                    <td><code>l10n</code></td>
                    <td>localization</td>
                    <td>l + 10 chữ cái + n</td>
                  </tr>
                  <tr>
                    <td><code>a11y</code></td>
                    <td>accessibility</td>
                    <td>a + 11 chữ cái + y</td>
                  </tr>
                  <tr>
                    <td><code>k8s</code></td>
                    <td>kubernetes</td>
                    <td>k + 8 chữ cái + s</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default NumeronymGenerator;