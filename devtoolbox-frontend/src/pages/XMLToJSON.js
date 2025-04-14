import React, { useState } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import '../styles/ToolLayout.css'; // Import CSS

const XMLToJSON = () => {
  const [xmlInput, setXmlInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');

  const handleConvertToJSON = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/tool/xml-to-json/convert`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/xml',
          },
          body: xmlInput,
        }
      );

      if (response.ok) {
        const data = await response.json(); // Backend trả về JSON
        setJsonOutput(JSON.stringify(data, null, 2)); // Định dạng JSON đẹp
      } else {
        setJsonOutput('Failed to convert XML to JSON. Please check your input.');
      }
    } catch (error) {
      console.error('Error during conversion:', error);
      setJsonOutput('An error occurred during conversion.');
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput);
    alert('JSON copied to clipboard!');
  };

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <div className="tool-header">
        <h3>XML to JSON</h3>
        <p>Convert XML to JSON</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4">
          <Card.Body>
            <Form.Group className="mb-4">
                <Form.Label>Your XML content</Form.Label>
                <Form.Control
                as="textarea"
                rows={6}
                value={xmlInput || "<a x='1.234' y='It&#39;s'/>"} // Giá trị khởi tạo
                onChange={(e) => setXmlInput(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Converted JSON</Form.Label>
              <InputGroup>
                <Form.Control
                  as="textarea"
                  rows={6}
                  readOnly
                  value={jsonOutput}
                  style={{ fontFamily: 'monospace' }}
                />
                <Button
                  variant="outline-secondary"
                  onClick={handleCopyToClipboard}
                >
                  📋
                </Button>
              </InputGroup>
            </Form.Group>

            <Button variant="primary" onClick={handleConvertToJSON}>
              Convert to JSON
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default XMLToJSON;