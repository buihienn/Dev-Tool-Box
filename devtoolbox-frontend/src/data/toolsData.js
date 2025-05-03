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

const API_URL = "http://localhost:8080/api/get-tool/all";

// Hàm fetch dữ liệu từ API và ánh xạ
const fetchToolsData = async () => {
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