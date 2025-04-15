import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Table, InputGroup, Badge } from 'react-bootstrap';
import { Clipboard, Globe, TelephoneFill } from 'react-bootstrap-icons';
import ToolHeader from '../components/ToolHeader';
import '../styles/ToolLayout.css';
import '../styles/Card.css';

const PhoneParser = () => {
  // States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('VN');
  const [countries, setCountries] = useState([]);
  const [phoneInfo, setPhoneInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState({
    e164: false,
    international: false,
    national: false,
    rfc3966: false
  });
  
  // Fetch supported countries when component mounts
  useEffect(() => {
    fetchCountries();
  }, []);
  
  // Fetch list of countries from API
  const fetchCountries = async () => {
    try {
      const response = await fetch('http://localhost:8080/tool/phone-parser/countries');
      if (response.ok) {
        const data = await response.json();
        setCountries(data.countries || []);
      } else {
        console.error('Failed to fetch countries');
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };
  
  // Parse phone number when user submits the form
  const handleParsePhone = async (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/tool/phone-parser/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          countryCode
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setPhoneInfo(data);
      } else {
        console.error('Failed to parse phone number');
      }
    } catch (error) {
      console.error('Error parsing phone number:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Copy text to clipboard
  const handleCopy = (text, format) => {
    navigator.clipboard.writeText(text);
    setCopySuccess({ ...copySuccess, [format]: true });
    setTimeout(() => setCopySuccess({ ...copySuccess, [format]: false }), 2000);
  };
  
  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <ToolHeader 
        toolId="phone-parser"
        defaultName="Trình phân tích và định dạng số điện thoại"
        defaultDescription="Phân tích, xác thực và định dạng số điện thoại. Lấy thông tin về số điện thoại, như mã quốc gia, loại, v.v."
      />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4 no-hover mb-4">
          <Card.Body>
            <Form onSubmit={handleParsePhone}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><strong>Mã quốc gia mặc định:</strong></Form.Label>
                    <Form.Select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name} ({country.callingCode})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><strong>Số điện thoại:</strong></Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Nhập số điện thoại..."
                      />
                      <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={loading || !phoneNumber.trim()}
                      >
                        {loading ? 'Đang phân tích...' : 'Phân tích'}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
            
            {phoneInfo && !phoneInfo.error && (
              <div className="mt-4">
                <h5 className="mb-3">Kết quả phân tích</h5>
                
                <Row>
                  <Col md={6}>
                    <Table bordered>
                      <tbody>
                        <tr>
                          <td><strong>Mã quốc gia</strong></td>
                          <td>
                            {phoneInfo.countryCode}
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Quốc gia</strong></td>
                          <td>{phoneInfo.countryName}</td>
                        </tr>
                        <tr>
                          <td><strong>Mã gọi quốc tế</strong></td>
                          <td>+{phoneInfo.callingCode}</td>
                        </tr>
                        <tr>
                          <td><strong>Hợp lệ?</strong></td>
                          <td>
                            {phoneInfo.isValid ? (
                              <Badge bg="success">Có</Badge>
                            ) : (
                              <Badge bg="danger">Không</Badge>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Có thể có?</strong></td>
                          <td>
                            {phoneInfo.isPossible ? (
                              <Badge bg="success">Có</Badge>
                            ) : (
                              <Badge bg="danger">Không</Badge>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Loại</strong></td>
                          <td>{phoneInfo.type}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  
                  <Col md={6}>
                    <Table bordered>
                      <tbody>
                        <tr>
                          <td><strong>Định dạng quốc tế</strong></td>
                          <td>
                            <div className="d-flex justify-content-between align-items-center">
                              <span>{phoneInfo.internationalFormat}</span>
                              <Button
                                variant={copySuccess.international ? "success" : "outline-secondary"}
                                size="sm"
                                onClick={() => handleCopy(phoneInfo.internationalFormat, 'international')}
                              >
                                {copySuccess.international ? 'Đã sao chép' : 'Sao chép'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Định dạng quốc gia</strong></td>
                          <td>
                            <div className="d-flex justify-content-between align-items-center">
                              <span>{phoneInfo.nationalFormat}</span>
                              <Button
                                variant={copySuccess.national ? "success" : "outline-secondary"}
                                size="sm"
                                onClick={() => handleCopy(phoneInfo.nationalFormat, 'national')}
                              >
                                {copySuccess.national ? 'Đã sao chép' : 'Sao chép'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Định dạng E.164</strong></td>
                          <td>
                            <div className="d-flex justify-content-between align-items-center">
                              <code>{phoneInfo.e164Format}</code>
                              <Button
                                variant={copySuccess.e164 ? "success" : "outline-secondary"}
                                size="sm"
                                onClick={() => handleCopy(phoneInfo.e164Format, 'e164')}
                              >
                                {copySuccess.e164 ? 'Đã sao chép' : 'Sao chép'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Định dạng RFC3966</strong></td>
                          <td>
                            <div className="d-flex justify-content-between align-items-center">
                              <code>{phoneInfo.rfc3966Format}</code>
                              <Button
                                variant={copySuccess.rfc3966 ? "success" : "outline-secondary"}
                                size="sm"
                                onClick={() => handleCopy(phoneInfo.rfc3966Format, 'rfc3966')}
                              >
                                {copySuccess.rfc3966 ? 'Đã sao chép' : 'Sao chép'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {phoneInfo.carrier && (
                          <tr>
                            <td><strong>Nhà mạng</strong></td>
                            <td>{phoneInfo.carrier}</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </div>
            )}
            
            {phoneInfo && phoneInfo.error && (
              <div className="alert alert-danger mt-3">
                {phoneInfo.error}
              </div>
            )}
          </Card.Body>
        </Card>
        
        <Card className="bg-light text-dark p-4 no-hover">
          <Card.Body>
            <h5>Về công cụ này</h5>
            <p>
              Công cụ này giúp bạn phân tích và định dạng số điện thoại từ bất kỳ quốc gia nào. 
              Dưới đây là một số thông tin được cung cấp:
            </p>
            <ul>
              <li>
                <strong>Xác thực:</strong> Kiểm tra xem số điện thoại có hợp lệ theo tiêu chuẩn E.164 không
              </li>
              <li>
                <strong>Thông tin địa lý:</strong> Xác định quốc gia và mã quốc tế của số điện thoại
              </li>
              <li>
                <strong>Loại số:</strong> Xác định loại số điện thoại (di động, cố định, ...)
              </li>
              <li>
                <strong>Định dạng:</strong> Hiển thị số điện thoại theo nhiều định dạng khác nhau để sử dụng trong các trường hợp khác nhau
              </li>
            </ul>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default PhoneParser;