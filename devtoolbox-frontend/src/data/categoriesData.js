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
      description: category.description,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export default fetchCategories;