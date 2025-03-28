import React, { useState }from 'react';
import { Card, Form, Button, InputGroup, ToggleButton } from 'react-bootstrap';
import '../styles/ToolLayout.css'; // Import CSS

const TokenGeneratorTool = () => {
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [length, setLength] = useState(64);
  const [generatedToken, setGeneratedToken] = useState("Generated token will appear here...");

const handleGenerateToken = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/auth/token/generate?uppercase=${uppercase}&lowercase=${lowercase}&numbers=${numbers}&symbols=${symbols}&length=${length}`, {
      method: "GET",
    });

    if (response.ok) {
      const token = await response.text(); // Backend trả về chuỗi token
      setGeneratedToken(token); // Hiển thị token trong textarea
    } else {
      alert("Không thể tạo token. Vui lòng thử lại!");
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    alert("Đã xảy ra lỗi, vui lòng thử lại sau!");
  }
};



return (
  <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
    <div className="tool-header">
      <h3>Trình tạo mã thông báo</h3>
      <p>
        Tạo chuỗi ngẫu nhiên với các ký tự bạn muốn, chữ hoa hoặc chữ thường, số và/hoặc ký tự đặc biệt.
      </p>
    </div>

    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Card className="bg-light text-dark p-4">
        <Card.Body>
        <div className="mb-4">
          <div className="row">
            <div className="col-6">
              <ToggleButton id="uppercase" type="checkbox" variant={uppercase ? "success" : "secondary"} value="uppercase" checked={uppercase} onChange={() => setUppercase(!uppercase)} className="w-100" >
                Chữ hoa (ABC...)
              </ToggleButton>
            </div>
            <div className="col-6">
              <ToggleButton id="lowercase" type="checkbox" variant={lowercase ? "success" : "secondary"} value="lowercase" checked={lowercase} onChange={() => setLowercase(!lowercase)} className="w-100" >
                Chữ thường (abc...)
              </ToggleButton>
            </div>
            <div className="col-6 mt-2">
              <ToggleButton id="numbers" type="checkbox" variant={numbers ? "success" : "secondary"} value="numbers" checked={numbers} onChange={() => setNumbers(!numbers)} className="w-100" >
                Số (123...)
              </ToggleButton>
            </div>
            <div className="col-6 mt-2">
              <ToggleButton id="specialChars"
                type="checkbox"
                variant={symbols ? "success" : "secondary"}
                value="specialChars"
                checked={symbols}
                onChange={() => setSymbols(!symbols)}
                className="w-100"
              >
                Ký tự đặc biệt (!@#...)
              </ToggleButton>
            </div>
          </div>
        </div>

          <Form.Group className="mb-4">
            <Form.Label>Độ dài ({length})</Form.Label>
            <Form.Range min={8} max={128} value={length} onChange={(e) => setLength(Number(e.target.value))} />
          </Form.Group>

          <InputGroup className="mb-4">
            <Form.Control as="textarea" rows={2} readOnly value={generatedToken} />
          </InputGroup>

          <div className="d-flex gap-2">
            <Button variant="success" onClick={() => navigator.clipboard.writeText(generatedToken)}>
              Sao chép
            </Button>
            <Button variant="primary" onClick={handleGenerateToken}>
              Gửi API
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  </div>
);
};

export default TokenGeneratorTool;