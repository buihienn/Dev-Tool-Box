import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import '../styles/ToolLayout.css';

const QRCodeGenerator = () => {
  const [text, setText] = useState('https://github.com/buihienn/Dev-Tool-Box');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState('M'); // Mức độ chịu lỗi: L, M, Q, H
  const [qrCodeUrl, setQrCodeUrl] = useState(null); // URL của QR Code được hiển thị
  const [errorMessage, setErrorMessage] = useState(''); // Thông báo lỗi

  // Hàm gọi API để tạo QR Code và hiển thị
  const generateQRCode = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/tool/qr-code/generate?text=${encodeURIComponent(text)}&errorCorrectionLevel=${errorCorrectionLevel}`,
        {
          method: 'GET',
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setQrCodeUrl(url); // Cập nhật URL để hiển thị QR Code
        setErrorMessage(''); // Xóa thông báo lỗi nếu thành công
      } else {
        setErrorMessage('Failed to generate QR Code. Please try again.');
      }
    } catch (error) {
      console.error('Error generating QR Code:', error);
      setErrorMessage('An error occurred while generating the QR Code.');
    }
  };

  // Gọi generateQRCode mỗi khi text hoặc errorCorrectionLevel thay đổi
  useEffect(() => {
    generateQRCode();
  }, [text, errorCorrectionLevel]);

  // Hàm tải xuống QR Code
  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <div className="tool-header">
        <h3>QR Code Generator</h3>
        <p>Generate and download a QR code for a URL (or just plain text).</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4">
          <Card.Body>
            {/* Hiển thị thông báo lỗi nếu có */}
            {errorMessage && (
              <Alert variant="danger" className="mb-4">
                {errorMessage}
              </Alert>
            )}

            <Form.Group className="mb-4">
              <Form.Label>Text:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter text or URL"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Error resistance:</Form.Label>
              <Form.Select
                value={errorCorrectionLevel}
                onChange={(e) => setErrorCorrectionLevel(e.target.value)}
              >
                <option value="L">Low</option>
                <option value="M">Medium</option>
                <option value="Q">Quartile</option>
                <option value="H">High</option>
              </Form.Select>
            </Form.Group>

            {/* Hiển thị QR Code */}
            <div className="text-center mb-4">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" style={{ width: '256px', height: '256px' }} />
              ) : (
                <p>Loading QR Code...</p>
              )}
            </div>

            {/* Nút tải xuống */}
            <div className="text-center">
              <Button variant="primary" onClick={downloadQRCode} disabled={!qrCodeUrl}>
                Download QR Code
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default QRCodeGenerator;