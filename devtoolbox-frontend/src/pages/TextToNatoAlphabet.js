import React, { useState, useEffect } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import '../styles/ToolLayout.css'; // Import CSS

const TextToNatoAlphabet = () => {
  const [inputText, setInputText] = useState('');
  const [natoText, setNatoText] = useState('');

  // Hàm chuyển đổi văn bản sang NATO alphabet
  const convertToNato = async (text) => {
    if (!text) {
      setNatoText('');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/tool/nato-converter/convert?text=${encodeURIComponent(text)}`,
        {
          method: 'GET',
        }
      );

      if (response.ok) {
        const data = await response.text(); // Backend trả về chuỗi NATO
        setNatoText(data);
      } else {
        setNatoText('Failed to convert text to NATO alphabet.');
      }
    } catch (error) {
      console.error('Error during conversion:', error);
      setNatoText('An error occurred during conversion.');
    }
  };

  // Gọi hàm chuyển đổi khi inputText thay đổi
  useEffect(() => {
    convertToNato(inputText);
  }, [inputText]);

  const handleClearInput = () => {
    setInputText('');
    setNatoText('');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(natoText);
    alert('NATO string copied to clipboard!');
  };

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <div className="tool-header">
        <h3>Text to NATO alphabet</h3>
        <p>Transform text into the NATO phonetic alphabet for oral transmission.</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4">
          <Card.Body>
            <Form.Group className="mb-4">
              <Form.Label>Your text to convert to NATO phonetic alphabet</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Enter text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <Button variant="outline-secondary" onClick={handleClearInput}>
                  ✖
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Your text in NATO phonetic alphabet</Form.Label>
              <Form.Control as="textarea" rows={3} readOnly value={natoText} />
            </Form.Group>

            <Button variant="outline-secondary" onClick={handleCopyToClipboard}>
              Copy NATO string
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default TextToNatoAlphabet;