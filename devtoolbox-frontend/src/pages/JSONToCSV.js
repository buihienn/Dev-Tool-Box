import React, { useState } from 'react';
import { Card, Form, Alert, Button } from 'react-bootstrap';
import '../styles/ToolLayout.css';

const JSONToCSV = () => {
    const [rawJson, setRawJson] = useState(''); // JSON thô từ người dùng
    const [csv, setCsv] = useState(''); // CSV được trả về từ backend
    const [errorMessage, setErrorMessage] = useState(''); // Thông báo lỗi

    // Hàm gửi JSON đến backend để chuyển đổi
    const handleConvertToCSV = async () => {
        try {
            let parsedJson = JSON.parse(rawJson);

            // Nếu JSON không phải là danh sách, bọc nó trong một danh sách
            if (!Array.isArray(parsedJson)) {
                parsedJson = [parsedJson];
            }

            const response = await fetch('http://localhost:8080/tool/json-to-csv/convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rawJson: JSON.stringify(parsedJson) }),
            });

            if (response.ok) {
                const data = await response.text();
                setCsv(data); // Lưu CSV trả về
                setErrorMessage(''); // Xóa thông báo lỗi
            } else {
                setErrorMessage('Invalid JSON input. Please check your JSON.');
            }
        } catch (error) {
            console.error('Error converting JSON to CSV:', error);
            setErrorMessage('An error occurred while converting JSON to CSV.');
        }
    };

    return (
        <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
            <div className="tool-header">
                <h3>JSON to CSV</h3>
                <p>Convert JSON to CSV with automatic header detection.</p>
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

                        {/* Bố cục 2 cột */}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {/* Nhập JSON thô */}
                            <Form.Group style={{ flex: 1 }}>
                                <Form.Label>Your raw JSON:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={15}
                                    placeholder="Paste your raw JSON here..."
                                    value={rawJson}
                                    onChange={(e) => setRawJson(e.target.value)} // Lưu JSON thô
                                />
                            </Form.Group>

                            {/* Hiển thị CSV */}
                            <Form.Group style={{ flex: 1 }}>
                                <Form.Label>CSV version of your JSON:</Form.Label>
                                <Form.Control as="textarea" rows={15} readOnly value={csv} />
                            </Form.Group>
                        </div>

                        {/* Nút chuyển đổi */}
                        <div className="text-center mt-4">
                            <Button variant="primary" onClick={handleConvertToCSV}>
                                Convert to CSV
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default JSONToCSV;