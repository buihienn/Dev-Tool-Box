import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const useFavoriteTools = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [favoriteTools, setFavoriteTools] = useState([]);

  // Lấy danh sách tool yêu thích từ backend
  const fetchFavoriteTools = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`http://localhost:8080/api/favorite/list?userId=${currentUser.userId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setFavoriteTools(data);
      }
    } catch (e) {
      setFavoriteTools([]);
    }
  };

  // Lắng nghe sự kiện cập nhật favorite
  useEffect(() => {
    fetchFavoriteTools();
    const handler = () => fetchFavoriteTools();
    window.addEventListener("favoriteToolsUpdated", handler);
    window.addEventListener("storage", (event) => {
      if (event.key === "favoriteTools") handler();
    });
    return () => {
      window.removeEventListener("favoriteToolsUpdated", handler);
      window.removeEventListener("storage", handler);
    };
    // eslint-disable-next-line
  }, [currentUser, isAuthenticated]);

  // Hàm gọi khi user favorite/unfavorite
  const triggerFavoriteUpdate = () => {
    window.dispatchEvent(new Event("favoriteToolsUpdated"));
  };

  return { favoriteTools, triggerFavoriteUpdate, fetchFavoriteTools };
};