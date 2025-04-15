import React, { useState, useEffect, useCallback } from 'react';
import { Form, InputGroup, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import '../styles/ToolLayout.css'; 
import ToolHeader from '../components/ToolHeader';

const HashText = () => {
  const [textToHash, setTextToHash] = useState(''); 
  const [encoding, setEncoding] = useState('Base64'); 
  const [hashResults, setHashResults] = useState({
    MD5: '',
    SHA1: '',
    SHA256: '',
    SHA512: '',
  });

  const generateHashes = useCallback(async (text) => {
    if (!text.trim()) {
      setHashResults({
        MD5: '',
        SHA1: '',
        SHA256: '',
        SHA512: '',
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/tool/hash/${encoding}?text=${encodeURIComponent(text)}`
      );
      if (response.ok) {
        const results = await response.json();
        setHashResults(results);
      } else {
        alert('Không thể tạo mã hóa. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      alert('Đã xảy ra lỗi, vui lòng thử lại sau!');
    }
  }, [encoding]);


  useEffect(() => {
    if (textToHash.trim()) {
      generateHashes(textToHash);
    }
  }, [textToHash, generateHashes]); 
  
  const handleTextChange = (e) => {
    const text = e.target.value;
    setTextToHash(text);
  };

  const handleCopy = (hash) => {
    navigator.clipboard.writeText(hash);
    alert('Copied to clipboard!');
  };

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
      <ToolHeader toolId="hash-text"/>

      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        {/* Nhập chuỗi văn bản */}
        <Form.Group className="mb-4">
          <Form.Label>Nhập chuỗi văn bản để mã hóa:</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Nhập chuỗi văn bản của bạn..." value={textToHash} onChange={handleTextChange}/>
        </Form.Group>

        {/* Chọn kiểu mã hóa */}
        <Form.Group className="mb-4">
          <Form.Label>Digest encoding</Form.Label>
          <DropdownButton id="encoding-dropdown" title={encoding} variant="outline-dark" onSelect={(e) => setEncoding(e)} >
            <Dropdown.Item eventKey="Binary">Binary (base 2)</Dropdown.Item>
            <Dropdown.Item eventKey="Hex">Hexadecimal (base 16)</Dropdown.Item>
            <Dropdown.Item eventKey="Base64">Base64 (base 64)</Dropdown.Item>
            <Dropdown.Item eventKey="Base64url">Base64url (base 64 with url safe chars)</Dropdown.Item>
          </DropdownButton>
        </Form.Group>

        {/* Kết quả hash */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem' }}>
          {['MD5', 'SHA1', 'SHA256', 'SHA512'].map((algorithm) => (
            <div key={algorithm}>
              <InputGroup>
                <InputGroup.Text style={{ width: '80px', justifyContent: 'center' }}>{algorithm}</InputGroup.Text>
                <Form.Control type="text" readOnly value={textToHash.trim() ? hashResults[algorithm] || '' : ''}  />
                <Button variant="outline-dark" onClick={() => handleCopy(hashResults[algorithm] || '')} disabled={!hashResults[algorithm]} >
                  Copy
                </Button>
              </InputGroup>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HashText;