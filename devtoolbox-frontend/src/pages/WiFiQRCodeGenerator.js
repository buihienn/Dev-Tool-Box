import React, { useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import '../styles/ToolLayout.css';

const WiFiQRCodeGenerator = () => {
  const [ssid, setSsid] = useState(''); // Tên WiFi
  const [password, setPassword] = useState(''); // Mật khẩu WiFi
  const [hidden, setHidden] = useState(false); // SSID ẩn hay không
  const [qrCodeUrl, setQrCodeUrl] = useState(null); // URL của QR Code được hiển thị

  // Hàm gọi API để tạo QR Code và hiển thị
  const generateQRCode = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/tool/wifi-qr-code/generate?ssid=${encodeURIComponent(ssid)}&password=${encodeURIComponent(password)}&hidden=${hidden}`,
        {
          method: 'GET',
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setQrCodeUrl(url); // Cập nhật URL để hiển thị QR Code
      } else {
        alert('Failed to generate WiFi QR Code. Please try again.');
      }
    } catch (error) {
      console.error('Error generating WiFi QR Code:', error);
    }
  };

  // Gọi generateQRCode mỗi khi ssid, password hoặc hidden thay đổi
  useEffect(() => {
    if (ssid && password) {
      generateQRCode();
    }
  }, [ssid, password, hidden]);

  // Hàm tải xuống QR Code
  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = 'wifi-qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <div className="tool-header">
        <h3>WiFi QR Code Generator</h3>
        <p>Generate and download QR codes for quick connections to WiFi networks.</p>
        <p>Only for WPA Method</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4">
          <Card.Body>
            <Form.Group className="mb-4">
              <Form.Label>SSID:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter WiFi name (SSID)"
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                label="Hidden SSID"
                checked={hidden}
                onChange={(e) => setHidden(e.target.checked)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter WiFi password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>


            {/* Hiển thị QR Code */}
            <div className="text-center mb-4">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="WiFi QR Code" style={{ width: '256px', height: '256px' }} />
              ) : (
                <p>Enter SSID and Password to generate QR Code</p>
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

export default WiFiQRCodeGenerator;