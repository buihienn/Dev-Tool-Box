import apiFetch from '../config/api';
const API_URL = "/api/categories/all";

const fetchCategories = async () => {
  try {
    const response = await apiFetch(API_URL); // Gọi API từ backend
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data = await response.json(); // Chuyển đổi dữ liệu JSON từ API
    return data.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export default fetchCategories;