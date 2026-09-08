import apiFetch from '../config/api';
import React, { useState } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import '../styles/ToolLayout.css'; // Import CSS
import ToolHeader from '../components/ToolHeader';

const URLParser = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState(''); // State để lưu thông báo lỗi
  const [parsedData, setParsedData] = useState({
    protocol: '',
    username: '',
    password: '',
    hostname: '',
    port: '',
    path: '',
    paramsString: '',
    params: [],
  });

  const parseURL = async (inputUrl) => {
    try {
      const response = await apiFetch('/tool/url-parser/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: inputUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        setParsedData(data);
        setError(''); // Xóa thông báo lỗi nếu thành công
      } else {
        setError('Failed to parse URL. Please check your input.'); // Hiển thị lỗi
        setParsedData({
          protocol: '',
          username: '',
          password: '',
          hostname: '',
          port: '',
          path: '',
          paramsString: '',
          params: [],
        });
      }
    } catch (error) {
      console.error('Error during URL parsing:', error);
      setError('An error occurred during URL parsing.'); // Hiển thị lỗi
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <ToolHeader toolId="url-parser" />

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4">
          <Card.Body>
            <Form.Group className="mb-4">
              <Form.Label>Your URL to parse:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a URL"
                value={url || 'https://buihien:btw123@it-tools:3000/url-parser?key1=value&key2=value2&key3=value3'}
                onChange={(e) => {
                  setUrl(e.target.value);
                  parseURL(e.target.value);
                }}
                isInvalid={!!error} // Đánh dấu trường nhập liệu là không hợp lệ nếu có lỗi
              />
              {error && <Form.Text className="text-danger">{error}</Form.Text>} {/* Hiển thị lỗi */}
            </Form.Group>

            {/* Protocol */}
            <Form.Group className="mb-3 d-flex align-items-center">
              <Form.Label className="me-3" style={{ minWidth: '100px' }}>
                Protocol:
              </Form.Label>
              <InputGroup>
                <Form.Control readOnly value={parsedData.protocol} />
                <Button
                  variant="outline-secondary"
                  onClick={() => handleCopyToClipboard(parsedData.protocol)}
                >
                  📋
                </Button>
              </InputGroup>
            </Form.Group>

            {/* Username */}
            <Form.Group className="mb-3 d-flex align-items-center">
              <Form.Label className="me-3" style={{ minWidth: '100px' }}>
                Username:
              </Form.Label>
              <InputGroup>
                <Form.Control readOnly value={parsedData.username} />
                <Button
                  variant="outline-secondary"
                  onClick={() => handleCopyToClipboard(parsedData.username)}
                >
                  📋
                </Button>
              </InputGroup>
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3 d-flex align-items-center">
              <Form.Label className="me-3" style={{ minWidth: '100px' }}>
                Password:
              </Form.Label>
              <InputGroup>
                <Form.Control readOnly value={parsedData.password} />
                <Button
                  variant="outline-secondary"
                  onClick={() => handleCopyToClipboard(parsedData.password)}
                >
                  📋
                </Button>
              </InputGroup>
            </Form.Group>

            {/* Hostname */}
            <Form.Group className="mb-3 d-flex align-items-center">
              <Form.Label className="me-3" style={{ minWidth: '100px' }}>
                Hostname:
              </Form.Label>
              <InputGroup>
                <Form.Control readOnly value={parsedData.hostname} />
                <Button
                  variant="outline-secondary"
                  onClick={() => handleCopyToClipboard(parsedData.hostname)}
                >
                  📋
                </Button>
              </InputGroup>
            </Form.Group>

            {/* Port */}
            <Form.Group className="mb-3 d-flex align-items-center">
              <Form.Label className="me-3" style={{ minWidth: '100px' }}>
                Port:
              </Form.Label>
              <InputGroup>
                <Form.Control readOnly value={parsedData.port} />
                <Button
                  variant="outline-secondary"
                  onClick={() => handleCopyToClipboard(parsedData.port)}
                >
                  📋
                </Button>
              </InputGroup>
            </Form.Group>

            {/* Path */}
            <Form.Group className="mb-3 d-flex align-items-center">
              <Form.Label className="me-3" style={{ minWidth: '100px' }}>
                Path:
              </Form.Label>
              <InputGroup>
                <Form.Control readOnly value={parsedData.path} />
                <Button
                  variant="outline-secondary"
                  onClick={() => handleCopyToClipboard(parsedData.path)}
                >
                  📋
                </Button>
              </InputGroup>
            </Form.Group>

            {/* Params */}
            <Form.Group className="mb-3 d-flex align-items-center">
              <Form.Label className="me-3" style={{ minWidth: '100px' }}>
                Params:
              </Form.Label>
              <InputGroup className="mb-2">
                <Form.Control readOnly value={parsedData.paramsString} />
                <Button
                  variant="outline-secondary"
                  onClick={() => handleCopyToClipboard(parsedData.paramsString)}
                >
                  📋
                </Button>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-4">
              {parsedData.params.map((param, index) => (
                <InputGroup className="mb-2" key={index}>
                  <Form.Control readOnly value={param.key} />
                  <Form.Control readOnly value={param.value} />
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleCopyToClipboard(`${param.key}=${param.value}`)}
                  >
                    📋
                  </Button>
                </InputGroup>
              ))}
            </Form.Group>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default URLParser;