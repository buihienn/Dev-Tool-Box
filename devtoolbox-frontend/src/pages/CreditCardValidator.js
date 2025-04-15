import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Table, InputGroup, Badge } from 'react-bootstrap';
import { Clipboard, Check2Circle, XCircle, CreditCard2Front, Calendar3 } from 'react-bootstrap-icons';
import ToolHeader from '../components/ToolHeader';
import '../styles/ToolLayout.css';
import '../styles/Card.css';

const CreditCardValidator = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardInfo, setCardInfo] = useState(null);
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Fetch examples when component mounts
  useEffect(() => {
    fetchExamples();
  }, []);
  
  // Fetch credit card examples from API
  const fetchExamples = async () => {
    try {
      const response = await fetch('http://localhost:8080/tool/credit-card/examples');
      if (response.ok) {
        const data = await response.json();
        setExamples(data.examples || []);
      } else {
        console.error('Failed to fetch card examples');
      }
    } catch (error) {
      console.error('Error fetching card examples:', error);
    }
  };
  
  // Format card number as user types (add spaces)
  const handleCardNumberChange = (e) => {
    const input = e.target.value;
    const cleaned = input.replace(/\D/g, '');
    
    // Format with spaces
    let formatted = '';
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += cleaned[i];
    }
    
    setCardNumber(formatted);
  };
  
  // Format expiry date as user types
  const handleExpiryDateChange = (e) => {
    const input = e.target.value;
    const cleaned = input.replace(/\D/g, '');
    
    if (cleaned.length <= 2) {
      setExpiryDate(cleaned);
    } else {
      setExpiryDate(`${cleaned.substring(0, 2)}/${cleaned.substring(2, 6)}`);
    }
  };
  
  // Handle CVV input
  const handleCvvChange = (e) => {
    const input = e.target.value;
    const cleaned = input.replace(/\D/g, '');
    // Limit CVV to 4 digits (AmEx has 4 digits)
    setCvv(cleaned.substring(0, 4));
  };
  
  // Validate card when form is submitted
  const handleValidateCard = async (e) => {
    e.preventDefault();
    if (!cardNumber.trim()) return;
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/tool/credit-card/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardNumber,
          expiryDate,
          cvv
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setCardInfo(data);
      } else {
        console.error('Failed to validate card');
        setCardInfo({ isValid: false, error: 'Failed to validate card' });
      }
    } catch (error) {
      console.error('Error validating card:', error);
      setCardInfo({ isValid: false, error: 'Network error' });
    } finally {
      setLoading(false);
    }
  };
  
  // Load example card when clicked
  const loadExample = (example) => {
    setCardNumber(example.number);
    setExpiryDate(example.expiry);
    setCvv(example.cvv);
    // Optionally validate immediately
    validateCard(example.number, example.expiry, example.cvv);
  };
  
  // Validate card programmatically
  const validateCard = async (number, expiry, cardCvv) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/tool/credit-card/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardNumber: number,
          expiryDate: expiry,
          cvv: cardCvv
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setCardInfo(data);
      } else {
        setCardInfo({ isValid: false, error: 'Failed to validate card' });
      }
    } catch (error) {
      setCardInfo({ isValid: false, error: 'Network error' });
    } finally {
      setLoading(false);
    }
  };
  
  // Copy formatted card number to clipboard
  const handleCopy = () => {
    if (!cardInfo || !cardInfo.formattedCardNumber) return;
    
    navigator.clipboard.writeText(cardInfo.formattedCardNumber);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
  
  // Get card type logo CSS class
  const getCardTypeClass = (cardType) => {
    if (!cardType) return '';
    
    switch (cardType.toLowerCase()) {
      case 'visa':
        return 'bg-primary';
      case 'mastercard':
        return 'bg-danger';
      case 'american express':
        return 'bg-info';
      case 'discover':
        return 'bg-warning';
      case 'jcb':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };
  
  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <ToolHeader 
        toolId="credit-card-validator"
        defaultName="Kiểm tra và phân tích thẻ tín dụng"
        defaultDescription="Xác thực và phân tích thông tin thẻ tín dụng. Kiểm tra tính hợp lệ của số thẻ, xác định loại thẻ và cung cấp thông tin chi tiết."
      />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4 no-hover mb-4">
          <Card.Body>
            <Form onSubmit={handleValidateCard}>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label><strong>Số thẻ tín dụng:</strong></Form.Label>
                    <Form.Control
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="Ví dụ: 4111 1111 1111 1111"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><strong>Ngày hết hạn (MM/YY):</strong></Form.Label>
                    <Form.Control
                      type="text"
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      placeholder="MM/YY"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><strong>CVV:</strong></Form.Label>
                    <Form.Control
                      type="text"
                      value={cvv}
                      onChange={handleCvvChange}
                      placeholder="123"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="d-grid mt-3 mb-4">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading || !cardNumber.trim()}
                >
                  {loading ? 'Đang xử lý...' : (
                    <>
                      <CreditCard2Front className="me-2" /> Kiểm tra thẻ
                    </>
                  )}
                </Button>
              </div>
            </Form>
            
            {cardInfo && (
              <div className="mt-4">
                <h5 className="mb-3">Kết quả phân tích</h5>
                
                <Row>
                  <Col md={6}>
                    <Card className={`mb-3 text-white ${getCardTypeClass(cardInfo.cardType)}`}>
                      <Card.Body style={{ padding: '1.5rem' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <h6 className="mb-0">{cardInfo.cardType || 'Unknown Card'}</h6>
                          <CreditCard2Front size={24} />
                        </div>
                        
                        <div className="mb-4">
                          <div className="mb-1 text-white-50">Số thẻ</div>
                          <h5>{cardInfo.formattedCardNumber}</h5>
                        </div>
                        
                        <div className="d-flex justify-content-between">
                          {cardInfo.expiryDateProvided && (
                            <div>
                              <div className="mb-1 text-white-50">Hết hạn</div>
                              <div>{cardInfo.formattedExpiry}</div>
                            </div>
                          )}
                          
                          <div className="text-end">
                            <div className="mb-1 text-white-50">Tình trạng</div>
                            <div>
                              {cardInfo.isValid ? (
                                <Badge bg="light" text="dark">Hợp lệ</Badge>
                              ) : (
                                <Badge bg="danger">Không hợp lệ</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={6}>
                    <Table bordered>
                      <tbody>
                        <tr>
                          <td><strong>Tình trạng</strong></td>
                          <td>
                            {cardInfo.isValid ? (
                              <span className="d-flex align-items-center">
                                <Check2Circle className="text-success me-2" size={20} />
                                <span>Hợp lệ</span>
                              </span>
                            ) : (
                              <span className="d-flex align-items-center">
                                <XCircle className="text-danger me-2" size={20} />
                                <span>Không hợp lệ{cardInfo.error && ` - ${cardInfo.error}`}</span>
                              </span>
                            )}
                          </td>
                        </tr>
                        
                        <tr>
                          <td><strong>Loại thẻ</strong></td>
                          <td>{cardInfo.cardType || 'Không xác định'}</td>
                        </tr>
                        
                        <tr>
                          <td><strong>Mạng lưới thẻ</strong></td>
                          <td>{cardInfo.issuerNetwork || 'Không xác định'}</td>
                        </tr>
                        
                        <tr>
                          <td><strong>Loại thẻ</strong></td>
                          <td>{cardInfo.cardCategory || 'Không xác định'}</td>
                        </tr>
                        
                        <tr>
                          <td><strong>Khu vực</strong></td>
                          <td>{cardInfo.region || 'Không xác định'}</td>
                        </tr>
                        
                        {cardInfo.expiryDateProvided && (
                          <tr>
                            <td><strong>Ngày hết hạn</strong></td>
                            <td>
                              {cardInfo.isExpiryValid ? (
                                <span className="d-flex align-items-center">
                                  <Check2Circle className="text-success me-2" size={20} />
                                  <span>{cardInfo.formattedExpiry}</span>
                                </span>
                              ) : (
                                <span className="d-flex align-items-center">
                                  <XCircle className="text-danger me-2" size={20} />
                                  <span>{cardInfo.expiryError || 'Không hợp lệ'}</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        )}
                        
                        {cardInfo.cvvProvided && (
                          <tr>
                            <td><strong>CVV</strong></td>
                            <td>
                              {cardInfo.isCvvValid ? (
                                <Check2Circle className="text-success" size={20} />
                              ) : (
                                <XCircle className="text-danger" size={20} />
                              )}
                              {` (${cvv.length}/${cardInfo.expectedCvvLength || 3} chữ số)`}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                
                <div className="mt-3">
                  <Button
                    variant={copySuccess ? "success" : "outline-secondary"}
                    onClick={handleCopy}
                    disabled={!cardInfo.formattedCardNumber}
                  >
                    {copySuccess ? 'Đã sao chép!' : (
                      <>
                        <Clipboard className="me-2" /> Sao chép số thẻ định dạng
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
        
        <Card className="bg-light text-dark p-4 no-hover mb-4">
          <Card.Body>
            <h5>Các ví dụ thẻ hợp lệ</h5>
            <p className="text-muted mb-3">Nhấn vào một ví dụ để tải vào công cụ kiểm tra</p>
            
            <Row>
              {examples.map((example, index) => (
                <Col key={index} md={6} className="mb-3">
                  <Button 
                    variant="outline-primary"
                    className="w-100 text-start"
                    onClick={() => loadExample(example)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span><strong>{example.type}:</strong> {example.number}</span>
                      <CreditCard2Front />
                    </div>
                  </Button>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
        
        <Card className="bg-light text-dark p-4 no-hover">
          <Card.Body>
            <h5>Về công cụ kiểm tra thẻ tín dụng</h5>
            <p>
              Công cụ này giúp xác thực và phân tích thông tin thẻ tín dụng/ghi nợ. 
              Nó sử dụng thuật toán Luhn để kiểm tra tính hợp lệ của số thẻ và xác định loại thẻ dựa trên mẫu số.
            </p>
            
            <h6>Các loại thẻ được hỗ trợ:</h6>
            <ul>
              <li><strong>Visa:</strong> Bắt đầu với số 4, dài 16 chữ số</li>
              <li><strong>MasterCard:</strong> Bắt đầu với số 51-55, dài 16 chữ số</li>
              <li><strong>American Express:</strong> Bắt đầu với 34 hoặc 37, dài 15 chữ số</li>
              <li><strong>Discover:</strong> Bắt đầu với 6011 hoặc 65, dài 16 chữ số</li>
              <li><strong>JCB:</strong> Bắt đầu với 3528-3589, dài 16 chữ số</li>
              <li>Và các loại thẻ khác...</li>
            </ul>
            
            <div className="alert alert-info">
              <strong>Lưu ý về bảo mật:</strong> Công cụ này chỉ thực hiện xác thực cơ bản và không lưu trữ thông tin thẻ. 
              Không nên nhập thông tin thẻ tín dụng thật vào công cụ này hoặc bất kỳ công cụ trực tuyến nào khác.
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default CreditCardValidator;