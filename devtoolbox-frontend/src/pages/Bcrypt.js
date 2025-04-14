import React, { useState } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import '../styles/ToolLayout.css';
import ToolHeader from '../components/ToolHeader';

const Bcrypt = () => {
  const [inputString, setInputString] = useState('');
  const [saltRounds, setSaltRounds] = useState(10);
  const [generatedHash, setGeneratedHash] = useState('');
  const [compareString, setCompareString] = useState('');
  const [compareHash, setCompareHash] = useState('');
  const [isMatch, setIsMatch] = useState(null);

  // Gọi API để tạo hash
  const handleGenerateHash = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/bcrypt/hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputString: inputString,
          saltRounds: saltRounds,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedHash(data.hash); // Lưu hash được trả về
      } else {
        console.error('Lỗi khi tạo hash:', response.statusText);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API hash:', error);
    }
  };

  // Gọi API để so sánh chuỗi với hash
  const handleCompareHash = async () => {
    try {
      const response = await fetch('http://localhost:8080/tool/bcrypt/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputString: compareString,
          hash: compareHash,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsMatch(data.isMatch); // Lưu kết quả so sánh
      } else {
        console.error('Lỗi khi so sánh hash:', response.statusText);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API compare:', error);
    }
  };

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <ToolHeader toolId="bcrypt"/>
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
              <Form.Label>Generated hash:</Form.Label>
              <Form.Control type="text" readOnly value={generatedHash} />
            </Form.Group>

            <Button variant="primary" onClick={handleGenerateHash}>
              Generate Hash
            </Button>
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

            <Button variant="primary" onClick={handleCompareHash}>
              Compare
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Bcrypt;