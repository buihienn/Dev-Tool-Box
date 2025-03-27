import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ToolCard = ({ tool }) => {
  return (
    <Link 
      to={`/${tool.id}`} 
      className="text-decoration-none" 
      style={{ display: 'block' }}
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
            {React.createElement(tool.icon, { size: 24, className: "me-2 flex-shrink-0" })}
            <div className="ms-auto flex-shrink-0">
              {tool.isNew && (
                <Badge bg="warning" text="dark" className="me-1">Mới</Badge>
              )}
              {tool.isPremium && (
                <Badge bg="danger">Premium</Badge>
              )}
            </div>
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