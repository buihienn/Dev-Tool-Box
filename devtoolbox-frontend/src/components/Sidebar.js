import React, { useState, useEffect } from 'react';
import { Nav, Accordion } from 'react-bootstrap';
import { 
  ChevronDown, 
  ChevronUp,
  StarFill,
  HeartFill,
} from 'react-bootstrap-icons';
import { useNavigate, Link } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import fetchToolsData from '../data/toolsData'; 
import fetchCategories from '../data/categoriesData';
import { useRecentTools } from '../hooks/useRecentTools';
import ToolIcon from './ToolIcon'; 
import CategoryIcon from './CategoryIcon';
import '../styles/ToolLink.css'; 
import { useFavoriteTools } from '../hooks/useFavoriteTools';
import logo from "../assets/images/logo.png"; 

const Sidebar = () => {
  const navigate = useNavigate();
  const { expanded } = useSidebar();
  const { addToRecentTools } = useRecentTools();

  // State để lưu dữ liệu categories từ API
  const [categoriesData, setCategoriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // State để lưu dữ liệu tools từ API
  const [toolsData, setToolsData] = useState([]);

  const { favoriteTools } = useFavoriteTools();
  const favoriteToolObjs = toolsData.filter(tool => favoriteTools.includes(tool.id));

  // Fetch categories và tools khi component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Tải dữ liệu danh mục
        const categoriesResult = await fetchCategories();
        setCategoriesData(categoriesResult || []);
        
        // Tải dữ liệu công cụ
        const toolsResult = await fetchToolsData();

        const enabledTools = toolsResult.filter(tool => tool.isEnabled === true);
        setToolsData(enabledTools || []);
      } catch (error) {
        console.error("Error loading data:", error);
        setCategoriesData([]);
        setToolsData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();

    // Lắng nghe sự kiện recentToolsUpdated từ các component khác
    const handleRecentToolsUpdate = () => {
      // Kích hoạt re-render để cập nhật UI
      setToolsData(prev => [...prev]);
    };
    
    window.addEventListener('recentToolsUpdated', handleRecentToolsUpdate);
    window.addEventListener('storage', event => {
      if (event.key === 'recentTools') {
        handleRecentToolsUpdate();
      }
    });
    
    return () => {
      window.removeEventListener('recentToolsUpdated', handleRecentToolsUpdate);
      window.removeEventListener('storage', handleRecentToolsUpdate);
    };
  }, []);
  
  // Sử dụng state để lưu các accordion section đang mở
  const [activeKeys, setActiveKeys] = useState(['recent', 'favorite']);
  
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

  // Handle tool click to add to recent tools
  const handleToolClick = (tool) => {
    addToRecentTools(tool);
    navigate(`/${tool.id}`); // Navigate to tool page
  };

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
          <CategoryIcon categoryId={eventKey} />
          <span className="ms-2">{title}</span>
        </span>
        <span className="ms-auto">
          {isActive ? <ChevronUp /> : <ChevronDown />}
        </span>
      </div>
    );
  };

  const toggleFavorite = () => {
    setActiveKeys(prev => {
      if (prev.includes("favorite")) {
        return prev.filter(key => key !== "favorite");
      } else {
        return [...prev, "favorite"];
      }
    });
  };

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

  // Tool item
  const ToolLink = ({ tool }) => (
    <div
      className={`d-flex align-items-center px-3 py-2 tool-link ${tool.isPremium ? 'premium-tool' : ''}`}
      onClick={() => handleToolClick(tool)}
    >
      <div className="d-flex align-items-center position-relative">
        <div className={tool.isPremium ? 'premium-icon-wrapper' : ''}>
          <ToolIcon toolId={tool.id} className="me-2" />
          {tool.isPremium && <span className="premium-star"><StarFill /></span>}
        </div>
      </div>
      <span 
        className={`ms-2 tool-name ${tool.isPremium ? 'premium-name' : 'regular-name'}`}
      >
        {tool.name}
      </span>
    </div>
  );

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
        <div className="d-flex align-items-center justify-content-center">
          <Link to="/" className="d-block w-100 text-center">
            <img
              src={logo}
              alt="Dev Tool Box Logo"
              style={{ height: 160, width: "auto", display: "block", margin: "0 auto" }}
            />
          </Link>
        </div>
        <p className="text-muted mb-0 small text-center">Công cụ cho nhà phát triển.</p>
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
        {isLoading ? (
          <div className="p-3 text-black">Đang tải dữ liệu...</div>
        ) : (
          <Accordion 
            className="border-0"
            activeKey={activeKeys}
            alwaysOpen
          >
            {favoriteToolObjs && favoriteToolObjs.length > 0 && (
              <Accordion.Item eventKey="favorite" className="border-0 text-black position-relative" style={categoryStyle}>
              {/* CustomToggle cho favorite */}
              <div
                className="d-flex align-items-center mb-2 px-3 py-2"
                style={{ cursor: 'pointer' }}
                onClick={toggleFavorite}
              >
                <span className="fw-bold d-flex align-items-center">
                  <HeartFill color="#043A84" className="me-2 text-danger" />
                  <span className="ms-2">Yêu thích</span>
                </span>
                <span className="ms-auto">
                  {activeKeys.includes("favorite") ? <ChevronUp /> : <ChevronDown />}
                </span>
              </div>
              {/* Thêm dòng này để hiển thị vertical line */}
              {activeKeys.includes("favorite") && <div style={verticalLineStyle}></div>}
              <Accordion.Body className="p-0 ps-4">
                <Nav className="flex-column">
                  {favoriteToolObjs.map(tool => (
                    <ToolLink key={tool.id} tool={tool} />
                  ))}
                </Nav>
              </Accordion.Body>
            </Accordion.Item>)}

            {categoriesData.map((category) => (
            <Accordion.Item 
              eventKey={category.id} 
              key={category.id} 
              className="border-0 text-black position-relative"
              style={categoryStyle}
            >
              <CustomToggle
                eventKey={category.id}
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
          ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default Sidebar;