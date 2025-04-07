import React, { useState } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import '../styles/ToolLayout.css';

const Bcrypt = () => {
  const [inputString, setInputString] = useState('');
  const [saltRounds, setSaltRounds] = useState(10);
  const [generatedHash, setGeneratedHash] = useState('');
  const [compareString, setCompareString] = useState('');
  const [compareHash, setCompareHash] = useState('');
  const [isMatch, setIsMatch] = useState(null);

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <div className="tool-header">
        <h3>Bcrypt</h3>
        <p>
          Mã hóa và so sánh chuỗi văn bản sử dụng bcrypt. Bcrypt là một hàm mã hóa mật khẩu dựa trên thuật toán Blowfish.
        </p>
      </div>

      <div className="d-flex flex-column flex-lg-row gap-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Hash Section */}
        <Card className="bg-light text-dark flex-grow-1">
          <Card.Body>
            <h5 className="mb-4">Hash</h5>
            <Form.Group className="mb-3">
              <Form.Label>Your string:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your string to bcrypt..."
                value={inputString}
                onChange={(e) => setInputString(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Salt count:</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  min={1}
                  max={20}
                  value={saltRounds}
                  onChange={(e) => setSaltRounds(Number(e.target.value))}
                />
                <Button variant="outline-dark" onClick={() => setSaltRounds((prev) => Math.min(prev + 1, 20))}>
                  +
                </Button>
                <Button variant="outline-dark" onClick={() => setSaltRounds((prev) => Math.max(prev - 1, 1))}>
                  -
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control type="text" readOnly value={generatedHash} />
            </Form.Group>

            <Button variant="primary">Copy hash</Button>
          </Card.Body>
        </Card>

        {/* Compare Section */}
        <Card className="bg-light text-dark flex-grow-1">
          <Card.Body>
            <h5 className="mb-4">Compare string with hash</h5>
            <Form.Group className="mb-3">
              <Form.Label>Your string:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your string to compare..."
                value={compareString}
                onChange={(e) => setCompareString(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Your hash:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your hash to compare..."
                value={compareHash}
                onChange={(e) => setCompareHash(e.target.value)}
              />
            </Form.Group>

            <div className="mb-3">
              <strong>Do they match? </strong>
              <span className={isMatch === null ? 'text-muted' : isMatch ? 'text-success' : 'text-danger'}>
                {isMatch === null ? 'N/A' : isMatch ? 'Yes' : 'No'}
              </span>
            </div>

            <Button variant="primary">Compare</Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Bcrypt;