import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import { Clipboard, Check2Circle, ArrowRight } from 'react-bootstrap-icons';
import ToolHeader from '../components/ToolHeader';
import '../styles/ToolLayout.css';
import '../styles/Card.css';

const Ipv4Converter = () => {
  const [ipAddress, setIpAddress] = useState('192.168.1.1');
  const [ipInfo, setIpInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState({
    decimal: false,
    binary: false,
    hexadecimal: false,
    ipv6: false,
    ipv6Short: false
  });
  
  // Chuyển đổi địa chỉ IPv4 khi form được submit
  const handleConvertIp = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    if (!ipAddress.trim()) return;
    
    try {
      setLoading(true);
      
      // Sử dụng phương thức GET để tránh vấn đề CORS và vấn đề 403
      const response = await fetch(`http://localhost:8080/tool/ipv4/convert?ipAddress=${encodeURIComponent(ipAddress)}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        console.error(`Lỗi máy chủ: ${response.status} - ${response.statusText}`);
        setIpInfo({ 
          valid: false, 
          error: `Lỗi máy chủ: ${response.status} ${response.statusText}` 
        });
        return;
      }
      
      const data = await response.json();
      setIpInfo(data);
    } catch (error) {
      console.error('Lỗi khi chuyển đổi địa chỉ IP:', error);
      setIpInfo({ 
        valid: false, 
        error: 'Đã xảy ra lỗi khi kết nối đến máy chủ' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Sao chép giá trị vào clipboard
  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopySuccess({ ...copySuccess, [field]: true });
    setTimeout(() => {
      setCopySuccess({ ...copySuccess, [field]: false });
    }, 1500);
  };
  
  // Tự động chuyển đổi khi component được tải
  useEffect(() => {
    handleConvertIp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Tạo các hàng kết quả
  const createResultRow = (label, value, field) => {
    if (!ipInfo || !ipInfo.valid) return null;
    
    return (
      <div className="mb-3">
        <Form.Label><strong>{label}</strong></Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            value={value}
            readOnly
            style={{ 
              fontFamily: 'monospace',
              backgroundColor: '#f8f9fa'
            }}
          />
          <Button
            variant={copySuccess[field] ? "success" : "outline-secondary"}
            onClick={() => handleCopy(value, field)}
          >
            {copySuccess[field] ? (
              <>
                <Check2Circle className="me-2" /> Đã sao chép
              </>
            ) : (
              <>
                <Clipboard className="me-2" /> Sao chép
              </>
            )}
          </Button>
        </InputGroup>
      </div>
    );
  };
  
  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <ToolHeader 
        toolId="ipv4-converter"
        defaultName="Chuyển đổi địa chỉ IPv4"
        defaultDescription="Chuyển đổi địa chỉ IP thành số thập phân, nhị phân, thập lục phân hoặc thậm chí thành IPv6."
      />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4 no-hover mb-4">
          <Card.Body>
            <Form onSubmit={handleConvertIp}>
              <Form.Group className="mb-4">
                <Form.Label><strong>Nhập địa chỉ IPv4:</strong></Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="Ví dụ: 192.168.1.1"
                  />
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={loading || !ipAddress.trim()}
                  >
                    {loading ? 'Đang chuyển đổi...' : (
                      <>
                        <ArrowRight className="me-2" /> Chuyển đổi
                      </>
                    )}
                  </Button>
                </InputGroup>
              </Form.Group>
            </Form>
            
            {ipInfo && !ipInfo.valid && (
              <Alert variant="danger" className="mt-3">
                {ipInfo.error || 'Địa chỉ IPv4 không hợp lệ'}
              </Alert>
            )}
            
            {ipInfo && ipInfo.valid && (
              <div className="mt-4">
                <h5 className="mb-3">Kết quả chuyển đổi</h5>
                
                <Row>
                  <Col lg={12}>
                    {createResultRow('Thập phân (Decimal):', ipInfo.decimal, 'decimal')}
                    {createResultRow('Thập lục phân (Hexadecimal):', ipInfo.hexadecimal, 'hexadecimal')}
                    {createResultRow('Nhị phân (Binary):', ipInfo.binary, 'binary')}
                    {createResultRow('IPv6:', ipInfo.ipv6, 'ipv6')}
                    {createResultRow('IPv6 (rút gọn):', ipInfo.ipv6Short, 'ipv6Short')}
                  </Col>
                </Row>
              </div>
            )}
          </Card.Body>
        </Card>
        
        <Card className="bg-light text-dark p-4 no-hover">
          <Card.Body>
            <h5>Về công cụ chuyển đổi IPv4</h5>
            <p>
              Công cụ này cho phép bạn chuyển đổi địa chỉ IPv4 thành nhiều định dạng khác nhau, giúp ích 
              trong nhiều tình huống khác nhau khi làm việc với mạng và địa chỉ IP.
            </p>
            
            <h6>Các định dạng được hỗ trợ:</h6>
            <ul>
              <li><strong>Thập phân (Decimal):</strong> Biểu diễn địa chỉ IPv4 dưới dạng một số nguyên duy nhất</li>
              <li><strong>Thập lục phân (Hexadecimal):</strong> Biểu diễn địa chỉ dưới dạng chuỗi 8 ký tự hexa</li>
              <li><strong>Nhị phân (Binary):</strong> Biểu diễn địa chỉ dưới dạng 32 bit nhị phân</li>
              <li><strong>IPv6 Mapped:</strong> Biểu diễn địa chỉ IPv4 dưới dạng địa chỉ IPv6 (IPv4-mapped IPv6 address)</li>
            </ul>
            
            <h6>Ứng dụng:</h6>
            <ul>
              <li>Cấu hình mạng và lập trình hệ thống</li>
              <li>Tính toán subnet và địa chỉ mạng</li>
              <li>Chuyển đổi giữa các định dạng cho các công cụ khác nhau</li>
              <li>Tương thích với các hệ thống sử dụng địa chỉ IPv6</li>
            </ul>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Ipv4Converter;