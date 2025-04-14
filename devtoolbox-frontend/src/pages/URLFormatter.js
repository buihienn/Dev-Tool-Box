import React, { useState } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify'; // Import Toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toast CSS
import '../styles/ToolLayout.css'; // Import CSS

const URLFormatter = () => {
  const [inputEncode, setInputEncode] = useState('');
  const [encodedText, setEncodedText] = useState('');
  const [inputDecode, setInputDecode] = useState('');
  const [decodedText, setDecodedText] = useState('');

  // Hàm gọi API encode
  const handleEncode = async (text) => {
    try {
      const response = await fetch('http://localhost:8080/tool/url-formatter/encode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        setEncodedText(data.encoded); // Lấy kết quả từ API
      } else {
        setEncodedText('Failed to encode the string.');
      }
    } catch (error) {
      console.error('Error during encoding:', error);
      setEncodedText('Failed to encode the string.');
    }
  };

  // Hàm gọi API decode
  const handleDecode = async (text) => {
    try {
      const response = await fetch('http://localhost:8080/tool/url-formatter/decode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        setDecodedText(data.decoded); // Lấy kết quả từ API
      } else {
        setDecodedText('Failed to decode the string.');
      }
    } catch (error) {
      console.error('Error during decoding:', error);
      setDecodedText('Failed to decode the string.');
    }
  };

  // Hàm sao chép vào clipboard
  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!', {
      position: 'bottom-right',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <div className="tool-header">
        <h3>Encode/decode URL-formatted strings</h3>
        <p>Encode text to URL-encoded format (also known as "percent-encoded"), or decode from it.</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4">
          <Card.Body>
            <div className="row">
              {/* Encode Section */}
              <div className="col-md-6">
                <h5>Encode</h5>
                <Form.Group className="mb-4">
                  <Form.Label>Your string:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter text to encode"
                    value={inputEncode}
                    onChange={(e) => {
                      setInputEncode(e.target.value);
                      handleEncode(e.target.value); // Gọi API encode
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Your string encoded:</Form.Label>
                  <InputGroup>
                    <Form.Control as="textarea" rows={3} readOnly value={encodedText} />
                  </InputGroup>
                </Form.Group>
                <Button variant="outline-secondary" onClick={() => handleCopyToClipboard(encodedText)}>
                  Copy
                </Button>
              </div>

              {/* Decode Section */}
              <div className="col-md-6">
                <h5>Decode</h5>
                <Form.Group className="mb-4">
                  <Form.Label>Your encoded string:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter encoded text to decode"
                    value={inputDecode}
                    onChange={(e) => {
                      setInputDecode(e.target.value);
                      handleDecode(e.target.value); // Gọi API decode
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Your string decoded:</Form.Label>
                  <InputGroup>
                    <Form.Control as="textarea" rows={3} readOnly value={decodedText} />
                  </InputGroup>
                </Form.Group>
                <Button variant="outline-secondary" onClick={() => handleCopyToClipboard(decodedText)}>
                  Copy
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default URLFormatter;