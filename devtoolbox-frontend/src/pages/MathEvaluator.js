import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

const MathEvaluator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleEvaluate = async () => {
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8080/api/math/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expression }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.result);
      } else {
        setError(data.message || 'Có lỗi xảy ra khi xử lý biểu thức.');
      }
    } catch (err) {
      setError('Không thể kết nối đến server.');
    }
  };

  return (
    <div style={{padding: '2rem' }}>
      <div className="tool-header">
        <h3>Trình đánh giá toán học</h3>
        <p>
          Một máy tính để tính toán biểu thức toán học. Bạn có thể sử dụng các hàm như <code>sqrt</code>, <code>cos</code>, <code>sin</code>, <code>abs</code>, v.v.
        </p>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4">
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Your math expression (ex: 2*sqrt(6))...</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Enter your math expression..."
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleEvaluate}>
              Evaluate
            </Button>

            {result !== null && (
              <Alert variant="success" className="mt-3">
                <strong>Result:</strong> {result}
              </Alert>
            )}

            {error && (
              <Alert variant="danger" className="mt-3">
                <strong>Error:</strong> {error}
              </Alert>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default MathEvaluator;