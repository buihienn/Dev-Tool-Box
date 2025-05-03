import React from 'react';
import {
  ShieldLock,
  ArrowsAngleContract,
  Globe,
  CameraVideo,
  Terminal,
  Wifi,
  Calculator,
  Rulers,
  FileText,
  Database,
  CardList,
  CodeSlash,
  Diagram3,
  Gear,
  Clock,
  Image,
  JournalCode,
  KeyFill,
  Palette,
  Translate
} from 'react-bootstrap-icons';

// Map icon cụ thể cho từng category dựa vào ID
const categoryIconMap = {
  // Các category cơ bản
  'crypto': ShieldLock,
  'converter': ArrowsAngleContract,
  'web': Globe,
  'images_videos': CameraVideo, 
  'development': Terminal,
  'network': Wifi,
  'math': Calculator,
  'measurement': Rulers,
  'text': FileText,
  'data': Database,
  
  // Các category bổ sung
  'security': KeyFill,
  'programming': CodeSlash,
  'database': Database,
  'api': JournalCode,
  'time': Clock,
  'media': Image,
  'design': Palette,
  'system': Gear,
  'diagrams': Diagram3,
  'language': Translate
};

/**
 * Component hiển thị icon cho danh mục
 * @param {Object|String} props - Có thể là đối tượng chứa category hoặc categoryId, hoặc trực tiếp là categoryId 
 * @returns {React.Component} Icon component tương ứng
 */
const CategoryIcon = (props) => {
  // Xác định categoryId từ props truyền vào
  let categoryId;
  
  // Nếu prop là object
  if (typeof props === 'object') {
    // Kiểm tra nếu truyền vào là category
    if (props.category && props.category.id) {
      categoryId = props.category.id;
    } 
    // Kiểm tra nếu truyền vào là categoryId
    else if (props.categoryId) {
      categoryId = props.categoryId;
    }
    // Kiểm tra nếu prop chính là category
    else if (props.id) {
      categoryId = props.id;
    }
  } 
  // Nếu truyền trực tiếp là string (categoryId)
  else if (typeof props === 'string') {
    categoryId = props;
  }
  
  // Cố gắng lấy icon từ categoryIconMap
  let IconComponent = categoryIconMap[categoryId];

  // Nếu không tìm thấy, sử dụng icon mặc định
  if (!IconComponent) {
    IconComponent = CardList;
  }
  
  // Lấy các prop còn lại (nếu có) để truyền cho IconComponent
  const { category, categoryId: _, ...restProps } = typeof props === 'object' ? props : {};
  
  // Mặc định className nếu không được truyền vào
  const defaultProps = {
    className: "me-2",
    ...restProps
  };
  
  // Render component với props được truyền vào
  return <IconComponent {...defaultProps} />;
};

export default CategoryIcon;