import React, { useState, useEffect } from 'react';
import fetchToolsData from '../data/toolsData';
import { Heart, HeartFill } from "react-bootstrap-icons";
import { useAuth } from "../context/AuthContext";
import { useFavoriteTools } from "../hooks/useFavoriteTools";


const ToolHeader = ({ toolId, defaultName = '', defaultDescription = '' }) => {
  const [toolInfo, setToolInfo] = useState({ name: defaultName, description: defaultDescription });
  const [loading, setLoading] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  const { triggerFavoriteUpdate } = useFavoriteTools();

  useEffect(() => {
    // Tìm thông tin tool từ toolsData nếu có toolId
    if (toolId) {
      const fetchTool = async () => {
        try {
          setLoading(true);
          // Gọi hàm fetchToolsData để lấy danh sách công cụ
          const tools = await fetchToolsData();
          // Tìm công cụ cần hiển thị
          const tool = tools.find(t => t.id === toolId);
          if (tool) {
            setToolInfo({
              name: tool.name,
              description: tool.description
            });
          }
        } catch (error) {
          console.error("Error fetching tool data:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchTool();
    }

    // Kiểm tra trạng thái favorite
    if (toolId && currentUser) {
      fetch(`http://localhost:8080/api/favorite/is-favorite?userId=${currentUser.userId}&toolId=${toolId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then(res => res.json())
        .then(setIsFavorite)
        .catch(() => setIsFavorite(false));
    }
  }, [toolId, defaultName, defaultDescription, currentUser]);

  const handleFavorite = async (e) => {
    if (!currentUser) return;
    if (isFavorite) {
      await fetch(`http://localhost:8080/api/favorite/remove?userId=${currentUser.userId}&toolId=${toolId}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setIsFavorite(false);
    } else {
      await fetch(`http://localhost:8080/api/favorite/add?userId=${currentUser.userId}&toolId=${toolId}`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setIsFavorite(true);
    }
    triggerFavoriteUpdate();
  };

  return (
    <div className="tool-header">
      <div className="d-flex align-items-center mb-2 justify-content-between">
        <h3>{loading ? "Đang tải..." : toolInfo.name}</h3>
        {isAuthenticated && (
          <button
            className="btn btn-link ms-2 p-0"
            onClick={handleFavorite}
            aria-label={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
            style={{ fontSize: 22 }}
          >
            {isFavorite ? <HeartFill color="red" /> : <Heart />}
          </button>
        )}
      </div>
      <p>{loading ? "" : toolInfo.description}</p>
    </div>
  );
};

export default ToolHeader;