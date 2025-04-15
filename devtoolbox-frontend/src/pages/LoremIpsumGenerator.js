import React, { useState } from 'react';
import { Card, Form, Button, InputGroup, Row, Col } from 'react-bootstrap';
import { ArrowClockwise, Clipboard } from 'react-bootstrap-icons';
import ToolHeader from '../components/ToolHeader';
import '../styles/ToolLayout.css';
import '../styles/Card.css';

const LoremIpsumGenerator = () => {
  const [paragraphs, setParagraphs] = useState(3);
  const [minSentences, setMinSentences] = useState(3);
  const [maxSentences, setMaxSentences] = useState(7);
  const [minWords, setMinWords] = useState(5);
  const [maxWords, setMaxWords] = useState(15);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [asHtml, setAsHtml] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Tạo nội dung Lorem Ipsum mới
  const handleGenerateText = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/tool/lorem-ipsum/generate?paragraphs=${paragraphs}&minSentences=${minSentences}&maxSentences=${maxSentences}&minWords=${minWords}&maxWords=${maxWords}&startWithLorem=${startWithLorem}&asHtml=${asHtml}`, 
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const text = await response.text();
        setGeneratedText(text);
      } else {
        alert("Không thể tạo văn bản Lorem Ipsum. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  // Copy văn bản vào clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Tạo văn bản ngay khi component mount
  React.useEffect(() => {
    handleGenerateText();
  }, []);

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <ToolHeader 
        toolId="lorem-ipsum-generator"
        defaultName="Máy tạo văn bản Lorem Ipsum"
        defaultDescription="Lorem ipsum là một đoạn văn bản giả được sử dụng phổ biến để thể hiện hình thức của một tài liệu hoặc một kiểu chữ mà không cần dựa vào nội dung có ý nghĩa."
      />

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="bg-light text-dark p-4 no-hover mb-4">
          <Card.Body>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Số đoạn văn</strong> ({paragraphs})</Form.Label>
                  <Form.Range 
                    min={1} 
                    max={20} 
                    value={paragraphs} 
                    onChange={(e) => setParagraphs(Number(e.target.value))} 
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><strong>Số câu mỗi đoạn</strong> ({minSentences} - {maxSentences})</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Control
                      type="number"
                      min={1}
                      max={15}
                      value={minSentences}
                      onChange={(e) => setMinSentences(Math.min(Number(e.target.value), maxSentences))}
                    />
                    <span>-</span>
                    <Form.Control
                      type="number" 
                      min={minSentences}
                      max={20}
                      value={maxSentences}
                      onChange={(e) => setMaxSentences(Math.max(Number(e.target.value), minSentences))}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><strong>Số từ mỗi câu</strong> ({minWords} - {maxWords})</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Control
                      type="number"
                      min={3}
                      max={15}
                      value={minWords}
                      onChange={(e) => setMinWords(Math.min(Number(e.target.value), maxWords))}
                    />
                    <span>-</span>
                    <Form.Control
                      type="number" 
                      min={minWords}
                      max={30}
                      value={maxWords}
                      onChange={(e) => setMaxWords(Math.max(Number(e.target.value), minWords))}
                    />
                  </div>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label><strong>Tùy chọn</strong></Form.Label>
                  <div className="d-flex flex-column gap-2">
                    <Form.Check 
                      type="switch"
                      id="start-with-lorem"
                      label="Bắt đầu với 'Lorem ipsum...'"
                      checked={startWithLorem}
                      onChange={() => setStartWithLorem(!startWithLorem)}
                    />
                    <Form.Check 
                      type="switch"
                      id="as-html"
                      label="Định dạng HTML (thẻ <p>)"
                      checked={asHtml}
                      onChange={() => setAsHtml(!asHtml)}
                    />
                  </div>
                </Form.Group>

                <div className="d-flex gap-2 mt-4">
                  <Button 
                    variant="primary" 
                    onClick={handleGenerateText} 
                    disabled={loading}
                    className="w-100"
                  >
                    {loading ? 'Đang tạo...' : (
                      <>
                        <ArrowClockwise className="me-2" /> Tạo lại
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="success" 
                    onClick={handleCopy}
                    className="w-100"
                  >
                    {copySuccess ? 'Đã sao chép!' : (
                      <>
                        <Clipboard className="me-2" /> Sao chép
                      </>
                    )}
                  </Button>
                </div>
              </Col>
            </Row>

            <Form.Group>
              <Form.Label><strong>Kết quả</strong></Form.Label>
              <InputGroup>
                <Form.Control 
                  as="textarea" 
                  rows={10} 
                  value={generatedText} 
                  readOnly 
                  style={{ 
                    fontSize: '14px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}
                />
              </InputGroup>
            </Form.Group>
          </Card.Body>
        </Card>

        <Card className="bg-light text-dark p-4 no-hover">
          <Card.Body>
            <h5>Giới thiệu về Lorem Ipsum</h5>
            <p>Lorem Ipsum đã được sử dụng như một văn bản chuẩn cho ngành in ấn từ những năm 1500, khi một họa sĩ vô danh ghép nhiều đoạn văn bản với nhau để tạo thành một bản mẫu văn bản.</p>
            <p>Nó không những đã tồn tại năm thế kỷ, mà khi được áp dụng vào tin học văn phòng, nội dung của nó vẫn không hề bị thay đổi.</p>
            
            <h5 className="mt-4">Cách sử dụng</h5>
            <ul>
              <li>Thiết kế website và đồ họa khi cần trình bày bố cục mà không cần nội dung có ý nghĩa</li>
              <li>Trình bày mẫu cho các dự án xuất bản, thiết kế đồ họa</li>
              <li>Phát triển trang web khi chưa có nội dung chính thức</li>
              <li>Dùng làm văn bản đánh máy để kiểm tra thiết kế font chữ</li>
            </ul>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default LoremIpsumGenerator;