import React, { useState, useEffect } from 'react';
import { Nav, Accordion } from 'react-bootstrap';
import { 
  ClockHistory, 
  ChevronDown, 
  ChevronUp,
  StarFill,
  Globe // Default icon
} from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import toolsData from '../data/toolsData';
import fetchCategories from '../data/categoriesData';

const Sidebar = () => {
  const { expanded } = useSidebar();
  
  // State để lưu dữ liệu categories từ API
  const [categoriesData, setCategoriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch categories khi component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCategories();
        setCategoriesData(data || []); // Đảm bảo luôn có mảng, ngay cả khi API trả về null
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategoriesData([]); // Đặt mảng rỗng nếu có lỗi
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategories();
  }, []);
  
  // Sử dụng state để lưu các accordion section đang mở
  const [activeKeys, setActiveKeys] = useState(['recent', 'premium']);
  
  // Thêm các category ID vào activeKeys khi categoriesData được tải
  useEffect(() => {
    if (categoriesData.length > 0) {
      setActiveKeys(prev => [...prev, ...categoriesData.map(cat => cat.id)]);
    }
  }, [categoriesData]);
  
  const toggleCategory = (categoryName) => {
    setActiveKeys(prev => {
      const keyIndex = prev.indexOf(categoryName);
      if (keyIndex === -1) {
        return [...prev, categoryName];
      } else {
        return prev.filter(key => key !== categoryName);
      }
    });
  };

  // Lấy danh sách công cụ theo danh mục
  const getToolsByCategory = (categoryId) => {
    return toolsData.filter(tool => tool.category === categoryId);
  };

  // Lấy danh sách công cụ sử dụng gần đây
  const getRecentlyUsedTools = () => {
    // Giả định 3 công cụ được sử dụng gần đây nhất
    return toolsData.slice(0, 3);
  };

  // Lọc các công cụ Premium
  const premiumTools = toolsData.filter(tool => tool.isPremium);
  const recentlyUsedTools = getRecentlyUsedTools();

  // Custom Accordion Toggle Component
  const CustomToggle = ({ eventKey, icon, title, callback }) => {
    const isActive = activeKeys.includes(eventKey);
    
    return (
      <div
        className="d-flex align-items-center mb-2 px-3 py-2"
        style={{ cursor: 'pointer' }}
        onClick={() => callback(eventKey)}
      >
        <span className="fw-bold d-flex align-items-center">
          {React.isValidElement(icon) ? icon : <icon className="me-2" />}
          <span className="ms-2">{title}</span>
        </span>
        <span className="ms-auto">
          {isActive ? <ChevronUp /> : <ChevronDown />}
        </span>
      </div>
    );
  };

  // Tool Link Component để hiển thị các liên kết công cụ nhất quán
  const ToolLink = ({ tool }) => (
    <Nav.Link 
      key={tool.id} 
      className="text-black d-flex align-items-center px-3 py-2"
      as={Link}
      to={`/${tool.id}`}
    >
      {React.createElement(tool.icon || Globe, { className: "me-2" })}
      <span 
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '160px'
        }}
      >
        {tool.name}
      </span>
    </Nav.Link>
  );

  // Style cho các danh mục
  const categoryStyle = {
    background: '#FCF9F1',
    position: 'relative'
  };

  // Style cho đường thẳng dọc
  const verticalLineStyle = {
    position: 'absolute',
    left: '23px', 
    top: '40px', 
    height: 'calc(100% - 40px)',
    width: '1px',
    backgroundColor: '#000000', 
    zIndex: 5 
  };

  return (
    <div 
      className={`text-white sidebar ${expanded ? 'expanded' : 'collapsed'}`} 
      style={{
        background: '#FCF9F1',
        transition: 'all 0.3s ease',
        height: '100vh',
        width: expanded ? '250px' : '0',
        overflow: 'hidden',
        display: 'flex',    
        flexDirection: 'column',
        position: 'fixed', 
        top: 0,         
        left: 0,         
        zIndex: 1000
      }}
    >
      <div className="p-3 border-bottom border-secondary">
        <div className="p-4 d-flex align-items-center">
          <h3 className="" style={{color: '#043A84', fontWeight: 'bold'}}>DEV TOOL BOX</h3>
        </div>
        <p className="text-muted mb-0 small">Công cụ cho nhà phát triển.</p>
      </div>

      {/* Phần scroll */}
      <div 
        className="overflow-auto" 
        style={{ 
          width: '100%',
          flex: '1 1 auto',
          height: '0' 
        }}
      >
              <Accordion 
          className="border-0"
          activeKey={activeKeys}
          alwaysOpen
        >
          {/* Recently Used Section*/}
          <Accordion.Item 
            eventKey="recent" 
            className="border-0 text-black position-relative" 
            style={categoryStyle}
          >
            <CustomToggle
              eventKey="recent"
              icon={<ClockHistory />}
              title="Sử dụng gần đây"
              callback={toggleCategory}
            />
            {activeKeys.includes('recent') && <div style={verticalLineStyle}></div>}
            <Accordion.Body className="p-0 ps-4">
              <Nav className="flex-column">
                {recentlyUsedTools.map((tool) => (
                  <ToolLink key={tool.id} tool={tool} />
                ))}
              </Nav>
            </Accordion.Body>
          </Accordion.Item>

          {/* Premium Tools Section */}
          <Accordion.Item 
            eventKey="premium" 
            className="border-0 text-black position-relative" 
            style={categoryStyle}
          >
            <CustomToggle
              eventKey="premium"
              icon={<StarFill />}
              title="Công cụ Premium"
              callback={toggleCategory}
            />
            {activeKeys.includes('premium') && <div style={verticalLineStyle}></div>}
            <Accordion.Body className="p-0 ps-4">
              <Nav className="flex-column">
                {premiumTools.map((tool) => (
                  <ToolLink key={tool.id} tool={tool} />
                ))}
              </Nav>
            </Accordion.Body>
          </Accordion.Item>

          {/* Tool Categories from categoriesData */}
          {isLoading ? (
            <div className="p-3 text-black">Đang tải danh mục...</div>
          ) : (
            categoriesData.map((category) => (
              <Accordion.Item 
                eventKey={category.id} 
                key={category.id} 
                className="border-0 text-black position-relative"
                style={categoryStyle}
              >
                <CustomToggle
                  eventKey={category.id}
                  icon={React.createElement(category.icon || Globe)}
                  title={category.name}
                  callback={toggleCategory}
                />
                {activeKeys.includes(category.id) && <div style={verticalLineStyle}></div>}
                <Accordion.Body className="p-0 ps-4">
                  <Nav className="flex-column">
                    {getToolsByCategory(category.id).map((tool) => (
                      <ToolLink key={tool.id} tool={tool} />
                    ))}
                  </Nav>
                </Accordion.Body>
              </Accordion.Item>
            ))
          )}
        </Accordion>
    </div>
    </div>
  );
};

export default Sidebar;