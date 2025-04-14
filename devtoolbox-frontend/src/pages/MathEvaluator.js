import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';

const MathEvaluator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEvaluate = async () => {
    // Reset states
    setError(null);
    setResult(null);
    setIsLoading(true);

    // Validate input
    if (!expression.trim()) {
      setError('Vui lòng nhập biểu thức toán học.');
      setIsLoading(false);
      return;
    }

    try {
      // Mã hóa biểu thức để tránh các vấn đề với URL
      const encodedExpression = encodeURIComponent(expression.trim());
      const response = await fetch(`http://localhost:8080/tool/math/evaluate?expression=${encodedExpression}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.result);
      } else {
        setError(data.message || 'Có lỗi xảy ra khi đánh giá biểu thức.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Không thể kết nối đến server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Chèn hàm toán học phổ biến vào biểu thức
  const insertFunction = (func) => {
    setExpression(prevExpression => prevExpression + func);
  };

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <div className="tool-header">
          <h3>Math Evaluator</h3>
          <p>
            Tính toán các biểu thức toán học phức tạp. Tool này hỗ trợ các hàm cơ bản như sin, cos, sqrt, 
            logarithm và nhiều hàm toán học khác.
          </p>
        </div>

      <Row className="d-flex flex-column flex-lg-row gap-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Col>
          <Card className="bg-light mb-4">
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label><strong>Nhập biểu thức toán học:</strong></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Ví dụ: 2 * sqrt(16) + sin(PI/4)"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                />
              </Form.Group>

              <div className="d-flex flex-wrap mb-3 gap-2">
                <Button variant="outline-secondary" size="sm" onClick={() => insertFunction('sqrt(')}>sqrt</Button>
                <Button variant="outline-secondary" size="sm" onClick={() => insertFunction('sin(')}>sin</Button>
                <Button variant="outline-secondary" size="sm" onClick={() => insertFunction('cos(')}>cos</Button>
                <Button variant="outline-secondary" size="sm" onClick={() => insertFunction('tan(')}>tan</Button>
                <Button variant="outline-secondary" size="sm" onClick={() => insertFunction('log(')}>log</Button>
                <Button variant="outline-secondary" size="sm" onClick={() => insertFunction('log10(')}>log10</Button>
                <Button variant="outline-secondary" size="sm" onClick={() => insertFunction('pow(')}>pow</Button>
                <Button variant="outline-secondary" size="sm" onClick={() => insertFunction('PI')}>PI</Button>
                <Button variant="outline-secondary" size="sm" onClick={() => insertFunction('E')}>e</Button>
              </div>

              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  onClick={handleEvaluate}
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang tính...' : 'Tính toán'}
                </Button>
              </div>

              {result !== null && (
                <Alert variant="success" className="mt-3">
                  <strong>Kết quả:</strong> {result}
                </Alert>
              )}

              {error && (
                <Alert variant="danger" className="mt-3">
                  <strong>Lỗi:</strong> {error}
                </Alert>
              )}
            </Card.Body>
          </Card>
          <Card className="bg-light">
            <Card.Body>
              <h5>Hướng dẫn sử dụng:</h5>
              <ul>
                <li>Nhập biểu thức toán học vào ô trên.</li>
                <li>Sử dụng các nút chức năng để thêm nhanh các hàm phổ biến.</li>
                <li>Bấm "Tính toán" để nhận kết quả.</li>
              </ul>
              
              <h5>Các hàm hỗ trợ:</h5>
              <ul>
                <li><code>sqrt(x)</code> - Căn bậc hai</li>
                <li><code>sin(x)</code>, <code>cos(x)</code>, <code>tan(x)</code> - Hàm lượng giác (đơn vị radian)</li>
                <li><code>log(x)</code> - Logarit tự nhiên</li>
                <li><code>log10(x)</code> - Logarit cơ số 10</li>
                <li><code>pow(x, y)</code> - x lũy thừa y</li>
                <li><code>abs(x)</code> - Giá trị tuyệt đối</li>
                <li><code>PI</code>, <code>E</code> - Hằng số toán học</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MathEvaluator;