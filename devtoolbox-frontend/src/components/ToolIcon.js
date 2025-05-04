import React from 'react';
import {
  Key,
  Hash,
  ShieldLock,
  ClockHistory,
  Calculator,
  Clock,
  Percent,
  Globe,
  Globe2,
  Stopwatch,
  Thermometer,
  Speedometer,
  TextParagraph,
  FileEarmarkText,
  Icon123,
  TelephoneFill,
  Bank,
  CreditCard2Front,
  Ethernet,
  Diagram3,
} from 'react-bootstrap-icons';

// Map icon cụ thể cho từng tool dựa vào ID
const toolIconMap = {
  // Crypto tools
  "token": Key,
  "hash": Hash,
  "bcrypt": ShieldLock,
  "ulid": ClockHistory,
  
  // Math tools
  "math": Calculator,
  "eta-calculator": Clock,
  "percentage-calculator": Percent,
  
  // Measurement tools
  "chronometer": Stopwatch,
  "temperature-converter": Thermometer,
  "benchmark": Speedometer,
  
  // Text tools
  "lorem-ipsum": TextParagraph,
  "text-statistics": FileEarmarkText,
  "numeronym": Icon123,
  
  // Data tools
  "phone-parser": TelephoneFill,
  "iban": Bank,
  "credit-card": CreditCard2Front,
  
  // Network tools
  "mac-address": Ethernet,
  "ipv4": Globe2,
  "ipv4-range": Diagram3
};

/**
 * Component hiển thị icon cho công cụ
 * @param {Object|String} props - Có thể là đối tượng chứa tool hoặc toolId, hoặc trực tiếp là toolId 
 * @returns {React.Component} Icon component tương ứng
 */
const ToolIcon = (props) => {
  // Xác định toolId từ props truyền vào
  let toolId;
  
  // Nếu prop là object (có thể là tool hoặc {toolId})
  if (typeof props === 'object') {
    // Kiểm tra nếu truyền vào là tool
    if (props.tool && props.tool.id) {
      toolId = props.tool.id;
    } 
    // Kiểm tra nếu truyền vào là toolId
    else if (props.toolId) {
      toolId = props.toolId;
    }
    // Kiểm tra nếu prop chính là tool
    else if (props.id) {
      toolId = props.id;
    }
  } 
  // Nếu truyền trực tiếp là string (toolId)
  else if (typeof props === 'string') {
    toolId = props;
  }
  
  // Cố gắng lấy icon từ toolIconMap
  let IconComponent = toolIconMap[toolId];

  // Nếu vẫn không tìm thấy, sử dụng icon mặc định (Globe)
  if (!IconComponent) {
    IconComponent = Globe;
  }
  
  // Lấy các prop còn lại (nếu có) để truyền cho IconComponent
  const { tool, toolId: _, ...restProps } = typeof props === 'object' ? props : {};
  
  // Render component với props được truyền vào
  return <IconComponent {...restProps} className="me-2"/>;
};

export default ToolIcon;