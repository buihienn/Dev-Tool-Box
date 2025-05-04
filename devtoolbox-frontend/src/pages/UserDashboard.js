import React from 'react';
import { Container, Badge, Spinner, Alert } from 'react-bootstrap';
import { Tools, ClockHistory } from 'react-bootstrap-icons';
import ToolCard from '../components/ToolCard';
import CategoryIcon from '../components/CategoryIcon';
import '../styles/GridLayout.css';
import { useRecentTools } from '../hooks/useRecentTools';
import { useTools } from '../context/ToolsContext';

const UserDashboard = () => {
  const { tools = [], categories = [], isLoading, error } = useTools();
  const { recentTools = [] } = useRecentTools();

  // Lọc các công cụ được bật
  const enabledTools = tools.filter(tool => tool && tool.isEnabled === true);
  
  // Lọc công cụ mới
  const newTools = enabledTools.filter(tool => tool && tool.isNew);
  
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

  // Hiển thị thông báo nếu có lỗi
  if (error) {
    return (
      <Container fluid>
        <Alert variant="danger">
          <Alert.Heading>Đã xảy ra lỗi</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid>      
      {/* Recently Used Tools Section */}
      {recentTools && recentTools.length > 0 && (
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
      {newTools && newTools.length > 0 && (
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
      {categories && categories.length > 0 ? (
        categories.map(category => {
          if (!category) return null;
          
          // Lọc công cụ theo danh mục
          const categoryTools = enabledTools.filter(tool => 
            tool && tool.category && (
              (typeof tool.category === 'object' && tool.category.id === category.id) || 
              (typeof tool.category === 'string' && tool.category === category.id)
            )
          );
          
          // Chỉ hiển thị danh mục nếu có công cụ thuộc danh mục đó
          if (!categoryTools || categoryTools.length === 0) return null;
          
          return (
            <div key={category.id} className="mb-4">
              <div className="d-flex align-items-center mb-3">
                <h5 className="mb-0 d-flex align-items-center">
                  <CategoryIcon 
                    categoryId={category.id} 
                    className="me-2 text-primary" 
                  />
                  {category.name || 'Không có tên'}
                </h5>
              </div>
              
              <div className="grid grid-cols-1 gap-12px sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {categoryTools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          );
        })
      ) : null}
      
      {/* Hiển thị thông báo nếu không có công cụ nào */}
      {(!enabledTools || enabledTools.length === 0) && (
        <div className="text-center py-5">
          <p>Không có công cụ nào khả dụng.</p>
        </div>
      )}
    </Container>
  );
};

export default UserDashboard;