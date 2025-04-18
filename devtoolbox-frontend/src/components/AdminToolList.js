import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { Trash, PlusCircle } from 'react-bootstrap-icons';
import fetchToolsData from '../data/toolsData';
import AddToolModal from './modals/AddToolModal';
import AddCategoryModal from './modals/AddCategoryModal';

const AdminToolList = () => {
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // State cho modal thêm công cụ mới
  const [showAddToolModal, setShowAddToolModal] = useState(false);
  const [newToolFile, setNewToolFile] = useState(null);
  const [newToolName, setNewToolName] = useState('');
  const [newToolCategory, setNewToolCategory] = useState('');
  const [newToolId, setNewToolId] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // State cho modal thêm category mới
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  useEffect(() => {
    // Fetch tools from API
    fetchTools();
    // Fetch categories from API
    fetchAllCategories();
  }, []);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const toolsData = await fetchToolsData();
      
      // Chuyển đổi từ dữ liệu trong toolsData sang định dạng phù hợp với AdminToolList
      const formattedTools = toolsData.map(tool => ({
        id: tool.id,
        name: tool.name,
        type: tool.category?.name || tool.category || 'Chưa phân loại', // Xử lý cả object và string
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
  
  const fetchAllCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/categories/all');
      if (!response.ok) {
        throw new Error('Không thể tải danh sách danh mục');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  const handleTogglePremium = async (id) => {
    try {
      const toolToUpdate = tools.find(tool => tool.id === id);
      const newPremiumStatus = !toolToUpdate.premium;
      
      console.log(`Attempting to toggle premium for tool ${id} (${toolToUpdate.name}): 
        Current status: ${toolToUpdate.premium}, 
        New status: ${newPremiumStatus}`);
      
      // Hiển thị trạng thái đang xử lý
      setTools(tools.map(tool => 
        tool.id === id ? { ...tool, isPremiumProcessing: true } : tool
      ));
      
      // Gọi API để cập nhật trạng thái premium
      const response = await fetch(`http://localhost:8080/api/admin/toggle-premium`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          toolId: id,
          isPremium: newPremiumStatus
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.message || 'Không thể cập nhật trạng thái premium của công cụ');
      }

      // Đọc kết quả từ response
      const result = await response.json();
      console.log('Server response:', result);
      
      // Cập nhật state với kết quả từ server
      setTools(tools.map(tool => 
        tool.id === id ? { 
          ...tool, 
          premium: result.isPremium, 
          isPremiumProcessing: false 
        } : tool
      ));
      
      // Hiển thị thông báo thành công
      setSuccessMessage(`Đã chuyển công cụ "${toolToUpdate.name}" sang ${result.isPremium ? 'Premium' : 'Thường'}`);
      
      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error updating tool premium status:', err);
      setError(`Có lỗi xảy ra khi cập nhật trạng thái premium của công cụ: ${err.message}`);
      
      // Khôi phục state về trạng thái ban đầu nếu có lỗi
      setTools(tools.map(tool => 
        tool.id === id ? { ...tool, isPremiumProcessing: false } : tool
      ));
      
      // Tự động ẩn thông báo lỗi sau 5 giây
      setTimeout(() => {
        setError(null);
      }, 5000);
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
          enabled: newEnabledStatus
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
          enabled: result.enabled,
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

  // Mở modal thêm công cụ
  const handleShowToolModal = () => {
    setShowAddToolModal(true);
    setNewToolFile(null);
    setNewToolName('');
    setNewToolCategory('');
    setNewToolId('');
  };
  
  const handleCloseToolModal = () => {
    setShowAddToolModal(false);
  };
  
  // Mở modal thêm danh mục
  const handleShowCategoryModal = () => {
    setShowAddCategoryModal(true);
    setNewCategoryName('');
    setNewCategoryDescription('');
  };
  
  const handleCloseCategoryModal = () => {
    setShowAddCategoryModal(false);
  };
  
  // Xử lý thêm danh mục mới
  const handleAddCategory = async () => {
    if (!newCategoryName || newCategoryName.trim() === '') {
      setError('Vui lòng nhập tên danh mục');
      return;
    }
    
    setAddingCategory(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/categories/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: newCategoryName,
          description: newCategoryDescription || ''
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tạo danh mục mới');
      }
      
      const result = await response.json();
      
      // Thêm category mới vào danh sách
      setCategories([...categories, result.category]);
      
      // Tự động chọn category mới cho công cụ
      setNewToolCategory(result.category.name);
      
      setSuccessMessage(`Đã thêm danh mục "${newCategoryName}" thành công!`);
      handleCloseCategoryModal();
      
      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error creating category:', err);
      setError(`Có lỗi xảy ra khi tạo danh mục mới: ${err.message}`);
      
      // Tự động ẩn thông báo lỗi sau 5 giây
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setAddingCategory(false);
    }
  };

  // Xử lý thêm công cụ mới
  const handleAddTool = async () => {
    if (!newToolFile || !newToolName || !newToolCategory || !newToolId) {
      setError('Vui lòng điền đầy đủ thông tin và chọn file.');
      return;
    }
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', newToolFile);
      formData.append('name', newToolName);
      formData.append('category', newToolCategory);
      formData.append('id', newToolId);

      console.log('Sending upload request with:', {
        fileName: newToolFile.name,
        fileSize: newToolFile.size,
        name: newToolName,
        category: newToolCategory,
        id: newToolId
      });
      
      const response = await fetch('http://localhost:8080/api/admin/tools/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tải lên công cụ mới');
      }

      const result = await response.json();
      console.log('Upload success:', result);
      
      // Thêm công cụ mới vào danh sách
      const newTool = {
        id: newToolId,
        name: newToolName,
        type: newToolCategory,
        premium: false,
        enabled: true
      };
      
      setTools([...tools, newTool]);
      setSuccessMessage(`Đã thêm công cụ "${newToolName}" thành công!`);
      handleCloseToolModal();
      
      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error uploading tool:', err);
      setError(`Có lỗi xảy ra khi tải lên công cụ mới: ${err.message}`);
      
      // Tự động ẩn thông báo lỗi sau 5 giây
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setUploading(false);
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
            onClick={handleShowToolModal}
          >
            <PlusCircle className="me-2" /> Thêm công cụ
          </Button>
        </Col>
      </Row>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      
      {/* Sử dụng các Component Modal đã tách */}
      <AddToolModal
        show={showAddToolModal}
        onHide={handleCloseToolModal}
        onAddTool={handleAddTool}
        onShowCategoryModal={handleShowCategoryModal}
        uploading={uploading}
        newToolId={newToolId}
        setNewToolId={setNewToolId}
        newToolName={newToolName}
        setNewToolName={setNewToolName}
        newToolCategory={newToolCategory}
        setNewToolCategory={setNewToolCategory}
        setNewToolFile={setNewToolFile}
        categories={categories}
      />
      
      <AddCategoryModal
        show={showAddCategoryModal}
        onHide={handleCloseCategoryModal}
        onAddCategory={handleAddCategory}
        addingCategory={addingCategory}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        newCategoryDescription={newCategoryDescription}
        setNewCategoryDescription={setNewCategoryDescription}
      />
      
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
                    label={
                      tool.isPremiumProcessing ? (
                        <span>
                          <Spinner animation="border" size="sm" className="me-1" />
                          Đang xử lý...
                        </span>
                      ) : (
                        tool.premium ? "Premium" : "Thường"
                      )
                    }
                    checked={tool.premium}
                    onChange={() => handleTogglePremium(tool.id)}
                    disabled={tool.isPremiumProcessing}
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
                    disabled={tool.isProcessing}
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