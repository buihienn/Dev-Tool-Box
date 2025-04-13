import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Spinner, Alert, Modal, Row, Col } from 'react-bootstrap';
import { Trash, PlusCircle } from 'react-bootstrap-icons';

const AdminToolList = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch tools from API
    fetchTools();
  }, []);

  const fetchTools = async () => {
    setLoading(true);
    try {
      // Trong trường hợp thực tế, bạn sẽ gọi API
      // const response = await fetch('http://localhost:8080/api/admin/tools', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      // const data = await response.json();
      // setTools(data);

      // Dữ liệu mẫu
      setTimeout(() => {
        const sampleTools = [
          { id: 1, name: 'Token Generator', type: 'crypto', premium: false },
          { id: 2, name: 'Hash Text', type: 'crypto', premium: false },
          { id: 3, name: 'Advanced Encryption', type: 'crypto', premium: true },
          { id: 4, name: 'ULID Generator', type: 'generator', premium: false },
          { id: 5, name: 'Math Evaluator', type: 'math', premium: false },
          { id: 6, name: 'Code Formatter', type: 'developer', premium: true },
        ];
        setTools(sampleTools);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu công cụ');
      setLoading(false);
    }
  };

  const handleTogglePremium = async (id) => {
    try {
      const toolToUpdate = tools.find(tool => tool.id === id);
      
      // Trong trường hợp thực tế, bạn sẽ gọi API
      // await fetch(`http://localhost:8080/api/admin/tools/${id}/premium`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({ premium: !toolToUpdate.premium })
      // });

      // Cập nhật state
      setTools(tools.map(tool => 
        tool.id === id ? { ...tool, premium: !tool.premium } : tool
      ));
    } catch (err) {
      setError('Có lỗi xảy ra khi cập nhật trạng thái công cụ');
    }
  };

  const handleDeleteTool = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công cụ này không?')) {
      try {
        // Trong trường hợp thực tế, bạn sẽ gọi API
        // await fetch(`http://localhost:8080/api/admin/tools/${id}`, {
        //   method: 'DELETE',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // });

        // Cập nhật state
        setTools(tools.filter(tool => tool.id !== id));
      } catch (err) {
        setError('Có lỗi xảy ra khi xóa công cụ');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Đang tải danh sách công cụ...</p>
      </div>
    );
  }

  return (
    <div>
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-0">Quản lý công cụ</h2>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
          >
            <PlusCircle className="me-2" /> Thêm công cụ
          </Button>
        </Col>
      </Row>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th width="5%">STT</th>
            <th width="40%">Tên công cụ</th>
            <th width="20%">Loại</th>
            <th width="15%">Loại công cụ</th>
            <th width="20%">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {tools.length > 0 ? (
            tools.map((tool, index) => (
              <tr key={tool.id}>
                <td>{index + 1}</td>
                <td>{tool.name}</td>
                <td>{tool.type}</td>
                <td>
                  <Form.Check
                    type="switch"
                    id={`premium-switch-${tool.id}`}
                    label={tool.premium ? "Premium" : "Thường"}
                    checked={tool.premium}
                    onChange={() => handleTogglePremium(tool.id)}
                  />
                </td>
                <td>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDeleteTool(tool.id)}
                  >
                    <Trash className="me-1" /> Xóa
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">Không có công cụ nào</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminToolList;