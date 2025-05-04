import React, { useState, useEffect } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useRecentTools } from '../hooks/useRecentTools';
import { Heart, HeartFill } from "react-bootstrap-icons";
import { useAuth } from "../context/AuthContext";
import ToolIcon from './ToolIcon'; 
import { useFavoriteTools } from "../hooks/useFavoriteTools";

const ToolCard = ({ tool, isFavorite }) => {
  const { addToRecentTools } = useRecentTools();
  const { currentUser, isAuthenticated } = useAuth();
  const { triggerFavoriteUpdate } = useFavoriteTools();
  const [favorite, setFavorite] = useState(isFavorite);

  // Đồng bộ state local với prop isFavorite
  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) return;
    if (favorite) {
      await fetch(`http://localhost:8080/api/favorite/remove?userId=${currentUser.userId}&toolId=${tool.id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
    } else {
      await fetch(`http://localhost:8080/api/favorite/add?userId=${currentUser.userId}&toolId=${tool.id}`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
    }
    triggerFavoriteUpdate(); // Cập nhật lại toàn bộ dashboard
  };

  const handleToolClick = () => {
    addToRecentTools(tool);
  };

  return (
    <Link 
      to={`/${tool.id}`} 
      className="text-decoration-none" 
      style={{ display: 'block' }}
      onClick={handleToolClick}
    >
      <Card 
        className="h-100 shadow-sm" 
        style={{ 
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          height: '100%',
          minHeight: '220px'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
        }}
      >
        <Card.Body className="d-flex flex-column" style={{ padding: '1.25rem' }}>
          <div className="d-flex align-items-center">
            <ToolIcon toolId={tool.id} size={24} className="flex-shrink-0"/>
            <div className="ms-auto flex-shrink-0">
              {tool.isNew && (
                <Badge bg="info" text="dark" className="me-1">Mới</Badge>
              )}
              {tool.isPremium && (
                <Badge bg="warning" text="dark">Premium</Badge>
              )}
            </div>
            {isAuthenticated && (
              <button
                className="btn btn-link ms-2 p-0"
                onClick={handleFavorite}
                aria-label={favorite ? "Bỏ yêu thích" : "Yêu thích"}
                style={{ fontSize: 20 }}
                tabIndex={0}
              >
                {favorite 
                ? <HeartFill color="#043A84" /> 
                : <Heart color="#043A84" />}
              </button>
            )}
          </div>
          
          <Card.Title 
            className="mb-0 mt-2 pt-1"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: '1.3',
            }}
          >
            {tool.name}
          </Card.Title>

          <Card.Text 
            className="text-muted mt-2 flex-grow-1"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: '1.4'
            }}
          >
            {tool.description}
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default ToolCard;