import { ShieldLock, ArrowsAngleContract, Globe, CameraVideo, Terminal, Wifi, Calculator, Rulers, FileText, Database } from 'react-bootstrap-icons';

const iconMap = {
  crypto: ShieldLock,
  converter: ArrowsAngleContract,
  web: Globe,
  images_videos: CameraVideo,
  development: Terminal,
  network: Wifi,
  math: Calculator,
  measurement: Rulers,
  text: FileText,
  data: Database,
};

const API_URL = "http://localhost:8080/api/categories/all";

const fetchCategories = async () => {
  try {
    const response = await fetch(API_URL); // Gọi API từ backend
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data = await response.json(); // Chuyển đổi dữ liệu JSON từ API
    return data.map((category) => ({
      id: category.id,
      name: category.name,
      icon: iconMap[category.id] || Globe, // Ánh xạ icon từ iconMap, mặc định là Globe nếu không tìm thấy
      description: category.description,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export default fetchCategories;