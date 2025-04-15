import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, InputGroup, ButtonGroup, ToggleButton, Spinner } from 'react-bootstrap';
import { Clipboard, ArrowRepeat } from 'react-bootstrap-icons';
import ToolHeader from '../components/ToolHeader';
import '../styles/ToolLayout.css';
import '../styles/Card.css';

const MacAddressGenerator = () => {
  const [quantity, setQuantity] = useState(1);
  const [prefix, setPrefix] = useState('');
  const [uppercase, setUppercase] = useState(true);
  const [separator, setSeparator] = useState(':');
  const [macAddresses, setMacAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [prefixError, setPrefixError] = useState('');
  
  // Cấu hình các tùy chọn dấu phân cách
  const separatorOptions = [
    { name: 'Dấu hai chấm (:)', value: ':' },
    { name: 'Dấu gạch ngang (-)', value: '-' },
    { name: 'Dấu chấm (.)', value: '.' },
    { name: 'Không dấu', value: 'none' },
  ];
  
  // Tự động tạo địa chỉ MAC khi trang tải
  useEffect(() => {
    generateMacAddresses();
  }, []);
  
  // Validate tiền tố khi người dùng nhập
  const validatePrefix = (value) => {
    // Kiểm tra nếu rỗng
    if (!value || value.trim() === '') {
      setPrefixError('');
      return true;
    }
    
    // Kiểm tra định dạng
    const regex = /^([0-9A-Fa-f]{2}[:\-\.]?){0,5}$/;
    if (!regex.test(value)) {
      setPrefixError('Tiền tố không hợp lệ. Sử dụng định dạng như XX:XX:XX');
      return false;
    }
    
    // Kiểm tra độ dài
    const normalizedPrefix = value.replace(/[:\-\.]/g, '');
    if (normalizedPrefix.length > 10) { // Tối đa 5 octet (10 ký tự hex)
      setPrefixError('Tiền tố quá dài. Tối đa 5 octet');
      return false;
    }
    
    setPrefixError('');
    return true;
  };
  
  // Xử lý khi người dùng thay đổi tiền tố
  const handlePrefixChange = (e) => {
    const value = e.target.value;
    setPrefix(value);
    validatePrefix(value);
  };
  
  // Xử lý khi người dùng thay đổi số lượng
  const handleQuantityChange = (value) => {
    // Đảm bảo số lượng nằm trong khoảng từ 1-100
    const newQuantity = Math.max(1, Math.min(100, value));
    setQuantity(newQuantity);
  };
  
  // Tạo địa chỉ MAC
  const generateMacAddresses = async () => {
    if (!validatePrefix(prefix)) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:8080/tool/mac-address/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity,
          prefix,
          uppercase,
          separator,
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setMacAddresses(data.macAddresses || []);
      } else {
        const errorData = await response.json();
        setPrefixError(errorData.error || 'Có lỗi xảy ra khi tạo địa chỉ MAC');
        setMacAddresses([]);
      }
    } catch (error) {
      console.error('Lỗi khi tạo địa chỉ MAC:', error);
      setMacAddresses([]);
      setPrefixError('Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };
  
  // Copy địa chỉ MAC vào clipboard
  const handleCopy = () => {
    const macText = macAddresses.join('\n');
    navigator.clipboard.writeText(macText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
  
  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <ToolHeader 
        toolId="mac-address-generator"
        defaultName="Trình tạo địa chỉ MAC"
        defaultDescription="Tạo địa chỉ MAC ngẫu nhiên với tùy chọn tiền tố, kiểu chữ và dấu phân cách."
      />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4 no-hover mb-4">
          <Card.Body>
            <Form>
              <Row className="align-items-end mb-4">
                <Col md={6} className="mb-3 mb-md-0">
                  <Form.Group>
                    <Form.Label><strong>Số lượng:</strong></Form.Label>
                    <InputGroup>
                      <Button 
                        variant="outline-secondary"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        min="1"
                        max="100"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        style={{ textAlign: 'center' }}
                      />
                      <Button 
                        variant="outline-secondary"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= 100}
                      >
                        +
                      </Button>
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Số lượng địa chỉ MAC cần tạo (1-100)
                    </Form.Text>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group>
                    <Form.Label><strong>Tiền tố địa chỉ MAC:</strong></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="VD: 64:16:7F"
                      value={prefix}
                      onChange={handlePrefixChange}
                      isInvalid={!!prefixError}
                    />
                    {prefixError && (
                      <Form.Control.Feedback type="invalid">
                        {prefixError}
                      </Form.Control.Feedback>
                    )}
                    <Form.Text className="text-muted">
                      Để trống nếu muốn tạo hoàn toàn ngẫu nhiên
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="mb-4">
                <Col md={6} className="mb-3 mb-md-0">
                  <Form.Group>
                    <Form.Label><strong>Kiểu chữ:</strong></Form.Label>
                    <div>
                    <ButtonGroup>
                        <ToggleButton
                            id="uppercase-toggle"
                            type="radio"
                            variant={uppercase ? "primary" : "outline-primary"}
                            name="case"
                            value="uppercase"
                            checked={uppercase}
                            onChange={() => setUppercase(true)}
                        >
                            Chữ hoa
                        </ToggleButton>
                        <ToggleButton
                            id="lowercase-toggle"
                            type="radio"
                            variant={!uppercase ? "primary" : "outline-primary"}
                            name="case"
                            value="lowercase"
                            checked={!uppercase}
                            onChange={() => setUppercase(false)}
                        >
                            Chữ thường
                        </ToggleButton>
                        </ButtonGroup>
                    </div>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group>
                    <Form.Label><strong>Dấu phân cách:</strong></Form.Label>
                    <div>
                    <ButtonGroup>
                        {separatorOptions.map((option, idx) => (
                            <ToggleButton
                            key={idx}
                            id={`separator-${idx}`}
                            type="radio"
                            variant={separator === option.value ? "primary" : "outline-primary"}
                            name="separator"
                            value={option.value}
                            checked={separator === option.value}
                            onChange={() => setSeparator(option.value)}
                            >
                            {option.value === ':' ? ':' : option.value === '-' ? '-' : option.value === '.' ? '.' : 'Không'}
                            </ToggleButton>
                        ))}
                        </ButtonGroup>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="d-grid mb-4">
                <Button 
                  variant="primary"
                  onClick={generateMacAddresses}
                  disabled={loading || !!prefixError}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Đang tạo...
                    </>
                  ) : (
                    'Tạo địa chỉ MAC'
                  )}
                </Button>
              </div>
              
              <Form.Group>
                <Form.Label><strong>Kết quả:</strong></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={Math.min(10, Math.max(3, quantity))}
                  value={macAddresses.join('\n')}
                  readOnly
                  style={{ 
                    fontFamily: 'monospace',
                    fontSize: '16px'
                  }}
                />
              </Form.Group>
              
              <div className="d-flex justify-content-between mt-3">
                <Button
                  variant={copySuccess ? "success" : "outline-primary"}
                  onClick={handleCopy}
                  disabled={!macAddresses.length}
                >
                  {copySuccess ? (
                    'Đã sao chép!'
                  ) : (
                    <>
                      <Clipboard className="me-2" /> Sao chép
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline-secondary"
                  onClick={generateMacAddresses}
                  disabled={loading || !!prefixError}
                >
                  <ArrowRepeat className="me-2" /> Làm mới
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
        
        <Card className="bg-light text-dark p-4 no-hover">
          <Card.Body>
            <h5>Về địa chỉ MAC</h5>
            <p>
              Địa chỉ MAC (Media Access Control) là một định danh duy nhất được gán cho card mạng hoặc thiết bị mạng.
              Địa chỉ này gồm 48 bit (6 byte) thường được biểu diễn dưới dạng 12 chữ số thập lục phân, 
              thường được nhóm thành 6 cặp và phân cách bằng dấu hai chấm (:), gạch ngang (-) hoặc dấu chấm (.).
            </p>
            
            <h6>Cấu trúc:</h6>
            <ul>
              <li><strong>3 byte đầu (OUI):</strong> Định danh nhà sản xuất thiết bị, được IEEE chỉ định</li>
              <li><strong>3 byte sau:</strong> Số sê-ri được nhà sản xuất chỉ định</li>
            </ul>
            
            <h6>Ví dụ:</h6>
            <code>64:16:7F:B2:69:D4</code> - trong đó <code>64:16:7F</code> là mã của nhà sản xuất, và <code>B2:69:D4</code> là số sê-ri của thiết bị.
            
            <div className="alert alert-info mt-3">
              <strong>Lưu ý:</strong> Công cụ này tạo địa chỉ MAC ngẫu nhiên cho mục đích kiểm thử. 
              Việc sử dụng địa chỉ MAC giả trên thiết bị thực có thể gây xung đột trên mạng.
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default MacAddressGenerator;