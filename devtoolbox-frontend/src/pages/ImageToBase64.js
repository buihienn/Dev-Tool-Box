import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import '../styles/ToolLayout.css';
import ToolHeader from '../components/ToolHeader';

const ImageToBase64 = () => {
  const [imageFile, setImageFile] = useState(null); // File hình ảnh được chọn
  const [base64, setBase64] = useState(''); // Chuỗi Base64 của hình ảnh
  const [htmlCode, setHtmlCode] = useState(''); // Mã HTML chứa hình ảnh Base64
  const [errorMessage, setErrorMessage] = useState(''); // Thông báo lỗi

  // Hàm gửi file đến backend để chuyển đổi
  const handleConvertToBase64AndHTML = async () => {
    if (!imageFile) {
      setErrorMessage('Please select an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await fetch('http://localhost:8080/tool/image-to-base64/convert', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json(); // Nhận JSON từ backend
        setBase64(data.base64); // Lưu chuỗi Base64
        setHtmlCode(data.html); // Lưu mã HTML
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to convert image to Base64 and HTML. Please try again.');
      }
    } catch (error) {
      console.error('Error converting image to Base64 and HTML:', error);
      setErrorMessage('An error occurred while converting the image.');
    }
  };

  // Xử lý khi người dùng chọn hình ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setBase64('');
      setHtmlCode('');
      setErrorMessage('');
    }
  };

  // Hàm tải xuống file HTML
  const downloadHTMLFile = () => {
    if (!htmlCode) return;

    const blob = new Blob([htmlCode], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'image.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <ToolHeader toolId="image-to-base64" />

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4">
          <Card.Body>
            {/* Hiển thị thông báo lỗi nếu có */}
            {errorMessage && (
              <Alert variant="danger" className="mb-4">
                {errorMessage}
              </Alert>
            )}

            {/* Chọn hình ảnh */}
            <Form.Group className="mb-4">
              <Form.Label>Select an image:</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
            </Form.Group>

            {/* Nút chuyển đổi */}
            <div className="text-center mb-4">
              <Button variant="primary" onClick={handleConvertToBase64AndHTML}>
                Convert to Base64 and HTML
              </Button>
            </div>

            {/* Hiển thị chuỗi Base64 */}
            {base64 && (
              <>
                <Form.Group className="mb-4">
                  <Form.Label>Base64 String:</Form.Label>
                  <Form.Control as="textarea" rows={5} readOnly value={base64} />
                </Form.Group>
                <div className="text-center mb-4">
                  <Button variant="secondary" onClick={() => navigator.clipboard.writeText(base64)}>
                    Copy Base64
                  </Button>
                </div>
              </>
            )}

            {/* Hiển thị mã HTML */}
            {htmlCode && (
              <>
                <Form.Group className="mb-4">
                  <Form.Label>Generated HTML:</Form.Label>
                  <Form.Control as="textarea" rows={5} readOnly value={htmlCode} />
                </Form.Group>
                <div className="text-center mb-4">
                  <Button variant="secondary" onClick={downloadHTMLFile}>
                    Download HTML File
                  </Button>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ImageToBase64;