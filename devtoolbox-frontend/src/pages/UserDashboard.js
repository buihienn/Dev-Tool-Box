import React, { useState, useEffect } from 'react';
import { Container, Badge, Spinner } from 'react-bootstrap';
import { Tools, ClockHistory } from 'react-bootstrap-icons';
import ToolCard from '../components/ToolCard';
import fetchToolsData from '../data/toolsData'; // Đổi tên import để rõ ràng hơn
import fetchCategories from '../data/categoriesData';
import '../styles/GridLayout.css';

const UserDashboard = () => {
  // State cho categories và công cụ
  const [categoriesData, setCategoriesData] = useState([]);
  const [toolsData, setToolsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cả categories và tools khi component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Tải song song cả danh mục và công cụ để tối ưu thời gian
        const [categoriesResult, toolsResult] = await Promise.all([
          fetchCategories(),
          fetchToolsData()
        ]);
        
        setCategoriesData(categoriesResult || []);
        setToolsData(toolsResult || []);
      } catch (error) {
        console.error("Error loading data:", error);
        setCategoriesData([]);
        setToolsData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Lọc công cụ sau khi đã tải xong dữ liệu
  const newTools = toolsData.filter(tool => tool.isNew);
  
  // Lấy 3 công cụ đầu tiên làm công cụ gần đây
  // Trong thực tế, bạn có thể lưu trữ danh sách công cụ gần đây trong localStorage
  const recentTools = toolsData.slice(0, 3);
  
  // Hiển thị spinner khi đang tải
  if (isLoading) {
    return (
      <Container fluid className="d-flex flex-column align-items-center justify-content-center" style={{ height: '70vh' }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
        <p className="mt-3">Đang tải dữ liệu...</p>
      </Container>
    );
  }

  return (
    <Container fluid>      
      {/* Recently Used Tools Section */}
      {recentTools.length > 0 && (
        <>
          <div className="d-flex align-items-center mb-3">
            <h5 className="mb-0 d-flex align-items-center">
              <ClockHistory className="me-2 text-primary" />
              Sử dụng gần đây
            </h5>
          </div>
          
          <div className="grid grid-cols-1 gap-12px sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 mb-4">
            {recentTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </>
      )}

      {/* New Tools Section */}
      {newTools.length > 0 && (
        <>
          <div className="d-flex align-items-center mb-3">
            <h5 className="mb-0 d-flex align-items-center">
              <Tools className="me-2 text-warning" />
              Công cụ mới
            </h5>
            <Badge bg="warning" text="dark" className="ms-2">Mới</Badge>
          </div>
          
          <div className="grid grid-cols-1 gap-12px sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 mb-4">
            {newTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </>
      )}
      
      {/* All Categories Section */}
      {categoriesData.map(category => {
        // Lọc công cụ theo danh mục
        const categoryTools = toolsData.filter(tool => tool.category === category.id);
        
        // Chỉ hiển thị danh mục nếu có công cụ thuộc danh mục đó
        if (categoryTools.length === 0) return null;
        
        return (
          <div key={category.id} className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <h5 className="mb-0 d-flex align-items-center">
                {React.createElement(category.icon, { className: "me-2" })}
                {category.name}
              </h5>
            </div>
            
            <div className="grid grid-cols-1 gap-12px sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {categoryTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        );
      })}
      
      {/* Hiển thị thông báo nếu không có dữ liệu */}
      {toolsData.length === 0 && (
        <div className="text-center py-5">
          <p>Không có công cụ nào khả dụng.</p>
        </div>
      )}
    </Container>
  );
};

export default UserDashboard;