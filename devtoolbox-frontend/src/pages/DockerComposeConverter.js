import React, { useState } from 'react';
import { Card, Form, Alert, Button } from 'react-bootstrap';
import '../styles/ToolLayout.css';
import ToolHeader from '../components/ToolHeader';

const DockerComposeConverter = () => {
    const [dockerRunCommand, setDockerRunCommand] = useState('docker run -v /path/config.yml:/app/config.yml myapp'); // Lệnh docker run từ người dùng
    const [dockerComposeContent, setDockerComposeContent] = useState(''); // Nội dung docker-compose.yml
    const [errorMessage, setErrorMessage] = useState(''); // Thông báo lỗi

    // Hàm gửi lệnh docker run đến backend để chuyển đổi
    const handleConvertToCompose = async () => {
        try {
            const response = await fetch('http://localhost:8080/tool/docker-compose-converter/convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dockerRunCommand }),
            });

            if (response.ok) {
                const data = await response.text();
                setDockerComposeContent(data); // Lưu nội dung docker-compose.yml
                setErrorMessage(''); // Xóa thông báo lỗi
            } else {
                setErrorMessage('Invalid Docker run command. Please check your input.');
            }
        } catch (error) {
            console.error('Error converting Docker run command:', error);
            setErrorMessage('An error occurred while converting the Docker run command.');
        }
    };

    // Hàm tải xuống file docker-compose.yml
    const handleDownload = () => {
        const blob = new Blob([dockerComposeContent], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'docker-compose.yml';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
            <ToolHeader toolId="docker-compose-converter" />

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Card className="bg-light text-dark p-4">
                    <Card.Body>
                        {/* Hiển thị thông báo lỗi nếu có */}
                        {errorMessage && (
                            <Alert variant="danger" className="mb-4">
                                {errorMessage}
                            </Alert>
                        )}

                        {/* Nhập lệnh docker run */}
                        <Form.Group className="mb-4">
                            <Form.Label>Your docker run command:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                placeholder="Enter your docker run command here..."
                                value={dockerRunCommand}
                                onChange={(e) => setDockerRunCommand(e.target.value)}
                            />
                        </Form.Group>

                        {/* Hiển thị nội dung docker-compose.yml */}
                        <Form.Group className="mb-4">
                            <Form.Label>Docker-compose.yml:</Form.Label>
                            <Form.Control as="textarea" rows={10} readOnly value={dockerComposeContent} />
                        </Form.Group>

                        {/* Nút chuyển đổi và tải xuống */}
                        <div className="text-center">
                            <Button variant="primary" onClick={handleConvertToCompose} className="me-2">
                                Convert to Compose
                            </Button>
                            {dockerComposeContent && (
                                <Button variant="success" onClick={handleDownload}>
                                    Download docker-compose.yml
                                </Button>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default DockerComposeConverter;