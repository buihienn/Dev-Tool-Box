import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, InputGroup, Alert, Table } from 'react-bootstrap';
import { ArrowRight, Clipboard, Check2Circle } from 'react-bootstrap-icons';
import ToolHeader from '../components/ToolHeader';
import '../styles/ToolLayout.css';
import '../styles/Card.css';

const Ipv4RangeExpander = () => {
  const [startIp, setStartIp] = useState('192.168.1.1');
  const [endIp, setEndIp] = useState('192.168.6.255');
  const [rangeInfo, setRangeInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState({
    cidr: false,
    newStartIp: false,
    newEndIp: false,
    newAddressCount: false
  });
  
  // Hàm tính toán dải IP
  const calculateIpRange = async (e) => {
    if (e) e.preventDefault();
    
    if (!startIp.trim() || !endIp.trim()) {
      setError('Vui lòng nhập cả địa chỉ bắt đầu và kết thúc');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:8080/tool/ipv4-range/calculate?startIp=${encodeURIComponent(startIp)}&endIp=${encodeURIComponent(endIp)}`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        setError(`Lỗi server: ${response.status} ${response.statusText}`);
        return;
      }
      
      const data = await response.json();
      
      if (!data.valid) {
        setError(data.error || 'Lỗi xử lý dải địa chỉ IP');
        return;
      }
      
      setRangeInfo(data);
      
    } catch (error) {
      console.error('Lỗi khi tính toán dải IP:', error);
      setError('Đã xảy ra lỗi khi kết nối đến máy chủ');
    } finally {
      setLoading(false);
    }
  };
  
  // Copy nội dung vào clipboard
  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopySuccess({ ...copySuccess, [field]: true });
    setTimeout(() => {
      setCopySuccess({ ...copySuccess, [field]: false });
    }, 1500);
  };
  
  // Tự động tính toán khi component được tải lần đầu
  useEffect(() => {
    calculateIpRange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Component hiển thị một hàng với giá trị cũ và mới
  const ComparisonRow = ({ label, oldValue, newValue, copyField }) => (
    <tr>
      <td><strong>{label}</strong></td>
      <td>{oldValue}</td>
      <td>
        <InputGroup>
          <Form.Control
            type="text"
            value={newValue}
            readOnly
            className="bg-light"
          />
          {copyField && (
            <Button
              variant={copySuccess[copyField] ? "success" : "outline-secondary"}
              onClick={() => handleCopy(newValue, copyField)}
            >
              {copySuccess[copyField] ? <Check2Circle /> : <Clipboard />}
            </Button>
          )}
        </InputGroup>
      </td>
    </tr>
  );
  
  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <ToolHeader 
        toolId="ipv4-range-expander"
        defaultName="Mở rộng dải IPv4"
        defaultDescription="Tính toán mạng IPv4 hợp lệ với ký hiệu CIDR từ dải địa chỉ IPv4"
      />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4 no-hover mb-4">
          <Card.Body>
            <Form onSubmit={calculateIpRange}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label><strong>Địa chỉ bắt đầu</strong></Form.Label>
                    <Form.Control
                      type="text"
                      value={startIp}
                      onChange={(e) => setStartIp(e.target.value)}
                      placeholder="Ví dụ: 192.168.1.1"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label><strong>Địa chỉ kết thúc</strong></Form.Label>
                    <Form.Control
                      type="text"
                      value={endIp}
                      onChange={(e) => setEndIp(e.target.value)}
                      placeholder="Ví dụ: 192.168.6.255"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="d-grid mt-3">
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Đang tính toán...' : (
                    <>
                      <ArrowRight className="me-2" /> Tính toán dải mạng
                    </>
                  )}
                </Button>
              </div>
            </Form>
            
            {error && (
              <Alert variant="danger" className="mt-4">
                {error}
              </Alert>
            )}
            
            {rangeInfo && !error && (
              <div className="mt-4">
                <h5 className="mb-3">Kết quả tính toán</h5>
                
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th width="30%"></th>
                      <th width="30%">Giá trị ban đầu</th>
                      <th width="40%">Giá trị mới</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ComparisonRow
                      label="Địa chỉ bắt đầu"
                      oldValue={rangeInfo.originalStartIp}
                      newValue={rangeInfo.newStartIp}
                      copyField="newStartIp"
                    />
                    <ComparisonRow
                      label="Địa chỉ kết thúc"
                      oldValue={rangeInfo.originalEndIp}
                      newValue={rangeInfo.newEndIp}
                      copyField="newEndIp"
                    />
                    <ComparisonRow
                      label="Số địa chỉ trong dải"
                      oldValue={rangeInfo.originalAddressCount.toLocaleString()}
                      newValue={rangeInfo.newAddressCount.toLocaleString()}
                      copyField="newAddressCount"
                    />
                    <tr>
                      <td colSpan="2"><strong>CIDR</strong></td>
                      <td>
                        <InputGroup>
                          <Form.Control
                            type="text"
                            value={rangeInfo.cidr}
                            readOnly
                            className="bg-light"
                          />
                          <Button
                            variant={copySuccess.cidr ? "success" : "outline-secondary"}
                            onClick={() => handleCopy(rangeInfo.cidr, "cidr")}
                          >
                            {copySuccess.cidr ? <Check2Circle /> : <Clipboard />}
                          </Button>
                        </InputGroup>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
        
        <Card className="bg-light text-dark p-4 no-hover">
          <Card.Body>
            <h5>Về công cụ mở rộng dải IPv4</h5>
            <p>
              Công cụ này giúp bạn tính toán mạng IPv4 hợp lệ và ký hiệu CIDR từ một dải địa chỉ IP bắt đầu và kết thúc.
              Nó sẽ mở rộng dải địa chỉ ban đầu thành mạng con phù hợp nhất.
            </p>
            
            <h6>Cách sử dụng:</h6>
            <ol>
              <li>Nhập địa chỉ IPv4 bắt đầu (ví dụ: 192.168.1.1)</li>
              <li>Nhập địa chỉ IPv4 kết thúc (ví dụ: 192.168.6.255)</li>
              <li>Nhấn nút "Tính toán dải mạng"</li>
            </ol>
            
            <h6>Kết quả bạn nhận được:</h6>
            <ul>
              <li>Địa chỉ bắt đầu và kết thúc mới cho mạng con phù hợp</li>
              <li>Ký hiệu CIDR cho mạng con đó</li>
              <li>Số lượng địa chỉ IP trong mạng con</li>
            </ul>
            
            <h6>Lưu ý:</h6>
            <p>
              Mạng được tính toán sẽ bao gồm tất cả các địa chỉ từ địa chỉ bắt đầu đến kết thúc ban đầu,
              nhưng có thể bao gồm thêm một số địa chỉ để tạo thành một mạng con hợp lệ với độ dài tiền tố là số nguyên.
            </p>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Ipv4RangeExpander;