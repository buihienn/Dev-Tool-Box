import { ShieldLock, Code, Archive, ArrowsAngleContract, Globe, CameraVideo, Terminal, Wifi, Calculator, Rulers, FileText, Database  } from 'react-bootstrap-icons';
import React from 'react';

const categoriesData = [
  {
    id: 'crypto',
    name: "Mã hóa",
    icon: ShieldLock,
    description: "Các công cụ bảo mật và mã hóa thông tin"
  },
  {
    id: 'converter',
    name: "Chuyển đổi",
    icon: ArrowsAngleContract,
    description: "Các công cụ chuyển đổi định dạng và đơn vị"
  },
  {
    id: 'web',
    name: "Web",
    icon: Globe,
    description: "Các công cụ hỗ trợ phát triển và kiểm tra web"
  },
  {
    id: 'images-videos',
    name: "Hình ảnh & Video",
    icon: CameraVideo,
    description: "Các công cụ xử lý hình ảnh và video"
  },
  {
    id: 'development',
    name: "Lập trình",
    icon: Terminal,
    description: "Các công cụ hỗ trợ lập trình và phát triển phần mềm"
  },
  {
    id: 'network',
    name: "Mạng",
    icon: Wifi,
    description: "Các công cụ kiểm tra và phân tích mạng"
  },
  {
    id: 'math',
    name: "Toán học",
    icon: Calculator,
    description: "Các công cụ tính toán và hỗ trợ toán học"
  },
  {
    id: 'measurement',
    name: "Đo lường",
    icon: Rulers,
    description: "Các công cụ đo lường và chuyển đổi đơn vị"
  },
  {
    id: 'text',
    name: "Văn bản",
    icon: FileText,
    description: "Các công cụ xử lý và phân tích văn bản"
  },
  {
    id: 'data',
    name: "Dữ liệu",
    icon: Database,
    description: "Các công cụ xử lý và phân tích dữ liệu"
  },
];

export default categoriesData;