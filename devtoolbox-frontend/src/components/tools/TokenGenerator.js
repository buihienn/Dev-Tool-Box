import React, { useState } from 'react';
import { 
  Container, 
  Card, 
  Form, 
  Button, 
  Row, 
  Col, 
  InputGroup,
  Alert
} from 'react-bootstrap';
import { FileEarmarkText, Clipboard, ArrowClockwise } from 'react-bootstrap-icons';

const TokenGenerator = () => {
  const [token, setToken] = useState('');
  const [tokenLength, setTokenLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateToken = () => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const similarChars = 'iIlLoO01';

    let chars = '';
    if (includeUppercase) chars += uppercaseChars;
    if (includeLowercase) chars += lowercaseChars;
    if (includeNumbers) chars += numberChars;
    if (includeSymbols) chars += symbolChars;

    if (excludeSimilar) {
      for (const char of similarChars) {
        chars = chars.replace(char, '');
      }
    }

    if (chars.length === 0) {
      setToken('Vui lòng chọn ít nhất một loại ký tự');
      return;
    }

    let result = '';
    for (let i = 0; i < tokenLength; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setToken(result);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Không thể sao chép: ', err);
      });
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 d-flex align-items-center">
        <FileEarmarkText className="me-2 text-primary" />
        Trình tạo mã thông báo
      </h2>
      
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Độ dài mã thông báo</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={tokenLength} 
                    onChange={(e) => setTokenLength(parseInt(e.target.value))}
                    min="1"
                    max="128"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Tùy chọn ký tự</Form.Label>
                  <div>
                    <Form.Check 
                      type="checkbox" 
                      id="uppercase"
                      label="Chữ hoa (A-Z)" 
                      checked={includeUppercase}
                      onChange={(e) => setIncludeUppercase(e.target.checked)}
                      inline
                    />
                    <Form.Check 
                      type="checkbox" 
                      id="lowercase"
                      label="Chữ thường (a-z)" 
                      checked={includeLowercase}
                      onChange={(e) => setIncludeLowercase(e.target.checked)}
                      inline
                    />
                    <Form.Check 
                      type="checkbox" 
                      id="numbers"
                      label="Số (0-9)" 
                      checked={includeNumbers}
                      onChange={(e) => setIncludeNumbers(e.target.checked)}
                      inline
                    />
                    <Form.Check 
                      type="checkbox" 
                      id="symbols"
                      label="Ký tự đặc biệt (!@#$%...)" 
                      checked={includeSymbols}
                      onChange={(e) => setIncludeSymbols(e.target.checked)}
                      inline
                    />
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Check 
                    type="checkbox" 
                    id="similar"
                    label="Loại bỏ ký tự dễ nhầm lẫn (i, I, l, L, o, O, 0, 1)" 
                    checked={excludeSimilar}
                    onChange={(e) => setExcludeSimilar(e.target.checked)}
                  />
                </Form.Group>
                
                <Button variant="primary" onClick={generateToken}>
                  <ArrowClockwise className="me-2" />
                  Tạo mã ngẫu nhiên
                </Button>
              </Form>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Body>
              <Form.Group>
                <Form.Label>Mã thông báo của bạn</Form.Label>
                <InputGroup>
                  <Form.Control 
                    type="text" 
                    value={token}
                    readOnly
                  />
                  <Button variant="outline-secondary" onClick={copyToClipboard}>
                    <Clipboard />
                  </Button>
                </InputGroup>
              </Form.Group>
              {copied && (
                <Alert variant="success" className="mt-2 py-2">
                  Đã sao chép vào clipboard!
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Body>
              <h5>Thông tin công cụ</h5>
              <p>
                Công cụ này tạo ra các mã thông báo ngẫu nhiên với các tùy chọn khác nhau. 
                Bạn có thể điều chỉnh độ dài và loại ký tự sử dụng.
              </p>
              <h5>Cách sử dụng</h5>
              <ol>
                <li>Chọn độ dài mã thông báo mong muốn</li>
                <li>Chọn loại ký tự bạn muốn bao gồm</li>
                <li>Nhấn nút "Tạo mã ngẫu nhiên"</li>
                <li>Sao chép kết quả bằng nút bên cạnh</li>
              </ol>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TokenGenerator;
