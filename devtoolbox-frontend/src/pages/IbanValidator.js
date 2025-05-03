import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Table, Badge, InputGroup } from 'react-bootstrap';
import { Clipboard, Check2Circle, XCircle } from 'react-bootstrap-icons';
import ToolHeader from '../components/ToolHeader';
import '../styles/ToolLayout.css';
import '../styles/Card.css';

const IbanValidator = () => {
  const [ibanInput, setIbanInput] = useState('');
  const [ibanInfo, setIbanInfo] = useState(null);
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Fetch examples when component mounts
  useEffect(() => {
    fetchExamples();
  }, []);
  
  // Fetch IBAN examples from API
  const fetchExamples = async () => {
    try {
      const response = await fetch('http://localhost:8080/tool/iban/examples');
      if (response.ok) {
        const data = await response.json();
        setExamples(data.examples || []);
      } else {
        console.error('Failed to fetch IBAN examples');
      }
    } catch (error) {
      console.error('Error fetching IBAN examples:', error);
    }
  };
  
  // Validate IBAN when user submits the form
  const handleValidateIban = async (e) => {
    e.preventDefault();
    if (!ibanInput.trim()) return;
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/tool/iban/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          iban: ibanInput
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setIbanInfo(data);
      } else {
        console.error('Failed to validate IBAN');
        setIbanInfo({ isValid: false, error: 'Failed to validate IBAN' });
      }
    } catch (error) {
      console.error('Error validating IBAN:', error);
      setIbanInfo({ isValid: false, error: 'Network error' });
    } finally {
      setLoading(false);
    }
  };
  
  // Load example IBAN when clicked
  const loadExample = (iban) => {
    setIbanInput(iban);
    // Optionally validate immediately
    validateIban(iban);
  };
  
  // Validate IBAN programmatically
  const validateIban = async (iban) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/tool/iban/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          iban
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setIbanInfo(data);
      } else {
        setIbanInfo({ isValid: false, error: 'Failed to validate IBAN' });
      }
    } catch (error) {
      setIbanInfo({ isValid: false, error: 'Network error' });
    } finally {
      setLoading(false);
    }
  };
  
  // Copy IBAN friendly format to clipboard
  const handleCopy = () => {
    if (!ibanInfo || !ibanInfo.friendlyFormat) return;
    
    navigator.clipboard.writeText(ibanInfo.friendlyFormat);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
  
  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <ToolHeader toolId="iban"/>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4 no-hover mb-4">
          <Card.Body>
            <Form onSubmit={handleValidateIban}>
              <Form.Group className="mb-4">
                <Form.Label>
                  <strong>Nhập số IBAN cần kiểm tra:</strong>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={ibanInput}
                    onChange={(e) => setIbanInput(e.target.value)}
                    placeholder="Ví dụ: FR76 3000 6000 0112 3456 7890 189"
                  />
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={loading || !ibanInput.trim()}
                  >
                    {loading ? 'Đang xử lý...' : 'Kiểm tra'}
                  </Button>
                </InputGroup>
                <Form.Text className="text-muted">
                  Bạn có thể nhập có hoặc không có khoảng trắng
                </Form.Text>
              </Form.Group>
            </Form>
            
            {ibanInfo && (
              <div className="mt-4">
                <h5 className="mb-3">Kết quả phân tích</h5>
                
                <Table bordered>
                  <tbody>
                    <tr>
                      <td style={{ width: '40%' }}><strong>IBAN hợp lệ?</strong></td>
                      <td>
                        {ibanInfo.isValid ? (
                          <span className="d-flex align-items-center">
                            <Check2Circle className="text-success me-2" size={20} />
                            <span>Có</span>
                          </span>
                        ) : (
                          <span className="d-flex align-items-center">
                            <XCircle className="text-danger me-2" size={20} />
                            <span>Không{ibanInfo.error && ` - ${ibanInfo.error}`}</span>
                          </span>
                        )}
                      </td>
                    </tr>
                    
                    {ibanInfo.isValid && (
                      <>
                        <tr>
                          <td><strong>IBAN là QR-IBAN?</strong></td>
                          <td>
                            {ibanInfo.isQrIban ? (
                              <span className="d-flex align-items-center">
                                <Check2Circle className="text-success me-2" size={20} />
                                <span>Có</span>
                              </span>
                            ) : (
                              <span className="d-flex align-items-center">
                                <XCircle className="text-secondary me-2" size={20} />
                                <span>Không</span>
                              </span>
                            )}
                          </td>
                        </tr>
                        
                        <tr>
                          <td><strong>Mã quốc gia</strong></td>
                          <td>{ibanInfo.countryCode}</td>
                        </tr>
                        
                        <tr>
                          <td><strong>Tên quốc gia</strong></td>
                          <td>{ibanInfo.countryName}</td>
                        </tr>
                        
                        <tr>
                          <td><strong>Số kiểm tra</strong></td>
                          <td>{ibanInfo.checkDigits}</td>
                        </tr>
                        
                        <tr>
                          <td><strong>BBAN</strong></td>
                          <td>
                            <code>{ibanInfo.bban}</code>
                          </td>
                        </tr>
                        
                        {ibanInfo.bankCode && (
                          <tr>
                            <td><strong>Mã ngân hàng</strong></td>
                            <td>{ibanInfo.bankCode}</td>
                          </tr>
                        )}
                        
                        {ibanInfo.branchCode && (
                          <tr>
                            <td><strong>Mã chi nhánh</strong></td>
                            <td>{ibanInfo.branchCode}</td>
                          </tr>
                        )}
                        
                        {ibanInfo.accountNumber && (
                          <tr>
                            <td><strong>Số tài khoản</strong></td>
                            <td>{ibanInfo.accountNumber}</td>
                          </tr>
                        )}
                        
                        <tr>
                          <td><strong>Định dạng thân thiện</strong></td>
                          <td>
                            <div className="d-flex justify-content-between align-items-center">
                              <code>{ibanInfo.friendlyFormat}</code>
                              <Button
                                variant={copySuccess ? "success" : "outline-secondary"}
                                size="sm"
                                onClick={handleCopy}
                              >
                                {copySuccess ? 'Đã sao chép!' : (
                                  <>
                                    <Clipboard className="me-2" /> Sao chép
                                  </>
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
        
        <Card className="bg-light text-dark p-4 no-hover mb-4">
          <Card.Body>
            <h5>Các ví dụ IBAN hợp lệ</h5>
            
            <div className="d-flex flex-wrap gap-2">
              {examples.map((example, index) => (
                <Button 
                  key={index} 
                  variant="outline-primary"
                  size="sm"
                  onClick={() => loadExample(example.iban)}
                >
                  {example.country}: {example.iban}
                </Button>
              ))}
            </div>
          </Card.Body>
        </Card>
        
        <Card className="bg-light text-dark p-4 no-hover">
          <Card.Body>
            <h5>Về IBAN</h5>
            <p>
              IBAN (International Bank Account Number) là tiêu chuẩn quốc tế để xác định tài khoản ngân hàng qua biên giới.
              IBAN được thiết kế để giảm thiểu lỗi trong giao dịch ngân hàng quốc tế.
            </p>
            
            <h6>Cấu trúc IBAN:</h6>
            <ul>
              <li><strong>Mã quốc gia:</strong> 2 ký tự đầu tiên (theo ISO 3166)</li>
              <li><strong>Số kiểm tra:</strong> 2 chữ số tiếp theo</li>
              <li><strong>BBAN (Basic Bank Account Number):</strong> Phần còn lại của IBAN, cấu trúc tùy thuộc vào quốc gia</li>
            </ul>
            
            <h6>QR-IBAN là gì?</h6>
            <p>
              QR-IBAN là loại IBAN đặc biệt được sử dụng ở Thụy Sĩ và Liechtenstein cho các giao dịch QR. 
              Nó có thể nhận biết qua mã ngân hàng từ 30000 đến 31999.
            </p>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default IbanValidator;