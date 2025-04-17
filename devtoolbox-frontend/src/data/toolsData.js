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
  ArrowsAngleContract,
  CameraVideo,
  Terminal,
  Wifi,
  Rulers,
  FileText,
  Database,
} from 'react-bootstrap-icons';

// Map category từ backend sang frontend
const categoryMap = {
  "Chuyển đổi": "converter",
  "Mã hóa": "crypto",
  "Đo lường": "measurement",
  "Lập trình": "development",
  "Toán học": "math",
  "Hình ảnh & Video": "images_videos",
  "Mạng": "network",
  "Văn bản": "text",
  "Dữ liệu": "data",
  "Web": "web",
};

// Map icon mặc định tương ứng với category (sử dụng khi không tìm thấy icon cụ thể cho tool)
const categoryIconMap = {
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

// Map icon cụ thể cho từng tool dựa vào ID
const toolIconMap = {
  // Crypto tools
  "token": Key,
  "hash": Hash,
  "bcrypt": ShieldLock,
  "ulid": ClockHistory,
  
  // Math tools
  "math-evaluator": Calculator,
  "eta-calculator": Clock,
  "percentage-calculator": Percent,
  
  // Measurement tools
  "chronometer": Stopwatch,
  "temperature-converter": Thermometer,
  "benchmark-builder": Speedometer,
  
  // Text tools
  "lorem-ipsum-generator": TextParagraph,
  "text-statistics": FileEarmarkText,
  "numeronym-generator": Icon123,
  
  // Data tools
  "phone-parser": TelephoneFill,
  "iban-validator": Bank,
  "credit-card-validator": CreditCard2Front,
  
  // Network tools
  "mac-address-generator": Ethernet,
  "ipv4-converter": Globe2,
  "ipv4-range-expander": Diagram3
};

// Hàm fetch dữ liệu từ API và ánh xạ
const fetchToolsData = async () => {
  const API_URL = "http://localhost:8080/api/get-tool/all";
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch tools data");
    }
    const toolsFromAPI = await response.json();
    return toolsFromAPI.map((tool) => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      category: categoryMap[tool.category] || "unknown", // Ánh xạ category
      // Ưu tiên chọn icon cụ thể cho tool, nếu không có thì dùng icon của category
      icon: toolIconMap[tool.id] || categoryIconMap[categoryMap[tool.category]] || Globe,
      isNew: tool.isNew,
      isPremium: tool.isPremium,
      isEnabled: tool.isEnabled,
    }));
  } catch (error) {
    console.error("Error fetching tools data:", error);
    return [];
  }
};

export default fetchToolsData;