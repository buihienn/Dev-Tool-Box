import React, { useState, useEffect } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import '../styles/ToolLayout.css'; // Import CSS

const IntegerBaseConverter = () => {
  const [inputNumber, setInputNumber] = useState('');
  const [inputBase, setInputBase] = useState(10);
  const [convertedValues, setConvertedValues] = useState({
    binary: '',
    octal: '',
    decimal: '',
    hexadecimal: '',
    base64: '',
  });

  // Gửi API khi inputNumber hoặc inputBase thay đổi
  useEffect(() => {
    const fetchConvertedValues = async () => {
      if (!inputNumber || inputBase < 2 || inputBase > 36) return;

      try {
        const response = await fetch(
          `http://localhost:8080/tool/base-converter/convert?inputNumber=${inputNumber}&inputBase=${inputBase}`,
          {
            method: 'GET',
          }
        );

        if (response.ok) {
          const data = await response.json();
          setConvertedValues(data);
        } else {
          alert('Invalid input number or base!');
        }
      } catch (error) {
        console.error('Error during conversion:', error);
        alert('An error occurred during conversion.');
      }
    };

    fetchConvertedValues();
  }, [inputNumber, inputBase]);

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <div className="tool-header">
        <h3>Integer Base Converter</h3>
        <p>Convert a number between different bases (decimal, hexadecimal, binary, octal, base64, ...).</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4">
          <Card.Body>
            <Form.Group className="mb-4">
              <Form.Label>Input number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a number"
                value={inputNumber}
                onChange={(e) => setInputNumber(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Input base</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  value={inputBase}
                  onChange={(e) => setInputBase(Number(e.target.value))}
                  min={2}
                  max={36}
                />
                <Button
                  variant="secondary"
                  onClick={() => setInputBase(Math.max(2, inputBase - 1))}
                >
                  -
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setInputBase(Math.min(36, inputBase + 1))}
                >
                  +
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Binary (2)</Form.Label>
              <InputGroup>
                <Form.Control readOnly value={convertedValues.binary} />
                <Button
                  variant="outline-secondary"
                  onClick={() => navigator.clipboard.writeText(convertedValues.binary)}
                >
                  Copy
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Octal (8)</Form.Label>
              <InputGroup>
                <Form.Control readOnly value={convertedValues.octal} />
                <Button
                  variant="outline-secondary"
                  onClick={() => navigator.clipboard.writeText(convertedValues.octal)}
                >
                  Copy
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Decimal (10)</Form.Label>
              <InputGroup>
                <Form.Control readOnly value={convertedValues.decimal} />
                <Button
                  variant="outline-secondary"
                  onClick={() => navigator.clipboard.writeText(convertedValues.decimal)}
                >
                  Copy
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Hexadecimal (16)</Form.Label>
              <InputGroup>
                <Form.Control readOnly value={convertedValues.hexadecimal} />
                <Button
                  variant="outline-secondary"
                  onClick={() => navigator.clipboard.writeText(convertedValues.hexadecimal)}
                >
                  Copy
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Base64 (64)</Form.Label>
              <InputGroup>
                <Form.Control readOnly value={convertedValues.base64} />
                <Button
                  variant="outline-secondary"
                  onClick={() => navigator.clipboard.writeText(convertedValues.base64)}
                >
                  Copy
                </Button>
              </InputGroup>
            </Form.Group>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default IntegerBaseConverter;