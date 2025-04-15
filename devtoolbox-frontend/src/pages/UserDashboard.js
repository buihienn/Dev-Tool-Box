import React, { useState, useEffect } from 'react';
import { Container, Badge, Spinner } from 'react-bootstrap';
import { Tools, ClockHistory } from 'react-bootstrap-icons';
import ToolCard from '../components/ToolCard';
import toolsData from '../data/toolsData';
import fetchCategories from '../data/categoriesData';
import '../styles/GridLayout.css';

const UserDashboard = () => {
  // Thêm state để lưu dữ liệu categories từ API
  const [categoriesData, setCategoriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories khi component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCategories();
        setCategoriesData(data || []);
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategoriesData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  const newTools = toolsData.filter(tool => tool.isNew);
  
  const recentTools = toolsData.slice(0, 3);
  
  return (
    <Container fluid>      
      {/* Recently Used Tools Section */}
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

      {/* New Tools Section */}
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
      
      {/* All Categories Section */}
      {isLoading ? (
        <div className="text-center py-4">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Đang tải danh mục...</p>
        </div>
      ) : (
        categoriesData.map(category => (
          <div key={category.id} className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <h5 className="mb-0 d-flex align-items-center">
                {React.createElement(category.icon, { className: "me-2" })}
                {category.name}
              </h5>
            </div>
            
            <div className="grid grid-cols-1 gap-12px sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {toolsData
                .filter(tool => tool.category === category.id)
                .map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))
              }
            </div>
          </div>
        ))
      )}
    </Container>
  );
};

export default UserDashboard;