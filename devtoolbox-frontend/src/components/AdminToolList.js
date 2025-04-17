import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { Trash, PlusCircle } from 'react-bootstrap-icons';
import fetchToolsData from '../data/toolsData';

const AdminToolList = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    // Fetch tools from API
    fetchTools();
  }, []);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const toolsData = await fetchToolsData();
      
      // Chuyển đổi từ dữ liệu trong toolsData sang định dạng phù hợp với AdminToolList
      const formattedTools = toolsData.map(tool => ({
        id: tool.id,
        name: tool.name,
        type: tool.category,
        premium: tool.isPremium,
        enabled: tool.isEnabled
      }));
      
      setTools(formattedTools);
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu công cụ');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePremium = async (id) => {
    try {
      const toolToUpdate = tools.find(tool => tool.id === id);
      
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

  const handleToggleEnabled = async (id) => {
    try {
      const toolToUpdate = tools.find(tool => tool.id === id);
      const newEnabledStatus = !toolToUpdate.enabled;
      
      console.log(`Attempting to toggle tool ${id} (${toolToUpdate.name}): 
        Current status: ${toolToUpdate.enabled}, 
        New status: ${newEnabledStatus}`);
      
      // Hiển thị trạng thái đang xử lý
      setTools(tools.map(tool => 
        tool.id === id ? { ...tool, isProcessing: true } : tool
      ));
      
      // Gọi API để cập nhật trạng thái
      const response = await fetch(`http://localhost:8080/api/admin/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          toolId: id,
          enabled: newEnabledStatus // Chú ý: sửa isEnabled thành enabled để khớp với backend
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.message || 'Không thể cập nhật trạng thái công cụ');
      }

      // Đọc kết quả từ response
      const result = await response.json();
      console.log('Server response:', result);
      
      // Cập nhật state với kết quả từ server
      setTools(tools.map(tool => 
        tool.id === id ? { 
          ...tool, 
          enabled: result.enabled, // Sửa từ result.isEnabled thành result.enabled
          isProcessing: false 
        } : tool
      ));
      
      // Hiển thị thông báo thành công
      setSuccessMessage(`Đã ${result.enabled ? 'kích hoạt' : 'vô hiệu hóa'} công cụ "${toolToUpdate.name}"`);
      
      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error updating tool status:', err);
      setError(`Có lỗi xảy ra khi cập nhật trạng thái kích hoạt công cụ: ${err.message}`);
      
      // Khôi phục state về trạng thái ban đầu nếu có lỗi
      setTools(tools.map(tool => 
        tool.id === id ? { ...tool, isProcessing: false } : tool
       ));
      
      // Tự động ẩn thông báo lỗi sau 5 giây
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const handleDeleteTool = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công cụ này không?')) {
      try {
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
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th width="5%">STT</th>
            <th width="30%">Tên công cụ</th>
            <th width="15%">Loại</th>
            <th width="15%">Loại công cụ</th>
            <th width="15%">Trạng thái</th>
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
                  <Form.Check
                    type="switch"
                    id={`enabled-switch-${tool.id}`}
                    label={
                      tool.isProcessing ? (
                        <span>
                          <Spinner animation="border" size="sm" className="me-1" />
                          Đang xử lý...
                        </span>
                      ) : (
                        tool.enabled ? "Đang bật" : "Đã tắt"
                      )
                    }
                    checked={tool.enabled}
                    onChange={() => handleToggleEnabled(tool.id)}
                    disabled={tool.isProcessing} // Vô hiệu hóa khi đang xử lý
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
              <td colSpan="6" className="text-center">Không có công cụ nào</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminToolList;