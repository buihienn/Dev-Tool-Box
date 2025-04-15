import React, { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { Clipboard, Clock, FileEarmarkText } from 'react-bootstrap-icons';
import ToolHeader from '../components/ToolHeader';
import '../styles/ToolLayout.css';
import '../styles/Card.css';

const TextStatistics = () => {
  const [text, setText] = useState('');
  const [statistics, setStatistics] = useState({
    charCount: 0,
    charCountNoSpaces: 0,
    wordCount: 0,
    lineCount: 0,
    byteSize: 0,
    formattedByteSize: '0 Bytes',
    sentenceCount: 0,
    readingTimeMinutes: 0,
    formattedReadingTime: 'dưới 1 phút'
  });
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Phân tích văn bản khi người dùng nhập
  const analyzeText = async (inputText) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/tool/text-statistics/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText })
      });
      
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      } else {
        console.error('Lỗi khi phân tích văn bản');
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Xử lý khi người dùng thay đổi văn bản
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    
    // Sử dụng debounce để tránh gửi quá nhiều request
    if (window.textAnalysisTimeout) {
      clearTimeout(window.textAnalysisTimeout);
    }
    
    window.textAnalysisTimeout = setTimeout(() => {
      analyzeText(newText);
    }, 500); // Đợi 500ms sau khi người dùng ngừng gõ
  };
  
  // Copy văn bản vào clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
  
  // Clear văn bản
  const handleClear = () => {
    setText('');
    analyzeText('');
  };
  
  // Phân tích văn bản ban đầu khi component mount
  useEffect(() => {
    analyzeText(text);
    // Cleanup timeout khi unmount
    return () => {
      if (window.textAnalysisTimeout) {
        clearTimeout(window.textAnalysisTimeout);
      }
    };
  }, []);
  
  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <ToolHeader 
        toolId="text-statistics"
        defaultName="Thống kê văn bản"
        defaultDescription="Lấy thông tin về một văn bản: số ký tự, số từ, số dòng, kích thước và nhiều chỉ số khác."
      />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4 no-hover mb-4">
          <Card.Body>
            <Form.Group className="mb-4">
              <Form.Label><strong>Văn bản của bạn</strong></Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                value={text}
                onChange={handleTextChange}
                placeholder="Nhập văn bản của bạn vào đây để phân tích..."
                style={{ 
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap'
                }}
              />
            </Form.Group>
            
            <div className="d-flex gap-2 mb-4">
              <Button 
                variant="primary" 
                onClick={handleCopy} 
                disabled={!text.length}
              >
                {copySuccess ? 'Đã sao chép!' : (
                  <>
                    <Clipboard className="me-2" /> Sao chép
                  </>
                )}
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={handleClear}
                disabled={!text.length}
              >
                Xóa văn bản
              </Button>
            </div>
            
            <hr />
            
            <h5 className="mb-3">Thống kê văn bản</h5>
            
            <Row>
              <Col md={6}>
                <Card className="mb-3 no-hover">
                  <Card.Body>
                    <h6 className="text-muted mb-4">Số lượng</h6>
                    
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Ký tự (bao gồm khoảng trắng):</span>
                      <strong>{statistics.charCount}</strong>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Ký tự (không khoảng trắng):</span>
                      <strong>{statistics.charCountNoSpaces}</strong>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Số từ:</span>
                      <strong>{statistics.wordCount}</strong>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Số dòng:</span>
                      <strong>{statistics.lineCount}</strong>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Số câu:</span>
                      <strong>{statistics.sentenceCount}</strong>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="mb-3 no-hover">
                  <Card.Body>
                    <h6 className="text-muted mb-4">Thông tin khác</h6>
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-1">
                        <FileEarmarkText className="me-2 text-primary" />
                        <span>Kích thước:</span>
                      </div>
                      <h4>{statistics.formattedByteSize}</h4>
                    </div>
                    
                    <div>
                      <div className="d-flex align-items-center mb-1">
                        <Clock className="me-2 text-success" />
                        <span>Thời gian đọc ước tính:</span>
                      </div>
                      <h4>{statistics.formattedReadingTime}</h4>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        <Card className="bg-light text-dark p-4 no-hover">
          <Card.Body>
            <h5>Về công cụ này</h5>
            <p>
              Công cụ thống kê văn bản giúp bạn nhanh chóng phân tích văn bản và lấy các chỉ số quan trọng:
            </p>
            <ul>
              <li>Số ký tự (bao gồm hoặc không bao gồm khoảng trắng)</li>
              <li>Số từ trong văn bản</li>
              <li>Số dòng và số câu</li>
              <li>Kích thước của văn bản khi lưu dưới định dạng UTF-8</li>
              <li>Ước tính thời gian đọc dựa trên tốc độ đọc trung bình</li>
            </ul>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default TextStatistics;