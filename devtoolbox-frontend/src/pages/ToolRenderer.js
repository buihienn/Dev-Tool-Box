import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadToolComponent } from '../utils/ToolsLoader';
import { Spinner, Alert, Container } from 'react-bootstrap';
import { useTools } from '../context/ToolsContext';
import { useAuth } from '../context/AuthContext';

const ToolRenderer = ({ toolId: propToolId }) => {
  const { toolId: paramToolId } = useParams();
  const toolId = propToolId || paramToolId;

  const { isToolEnabled, tools } = useTools();
  const { isPremium } = useAuth();
  const [ToolComponent, setToolComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTool = async () => {
      if (!toolId) {
        setError('ID công cụ không hợp lệ');
        setLoading(false);
        return;
      }

      // Kiểm tra xem công cụ có được enable không
      if (!isToolEnabled(toolId)) {
        setError('Công cụ này đã bị vô hiệu hóa hoặc không tồn tại');
        setLoading(false);
        return;
      }

      // Lấy thông tin tool hiện tại
      const tool = tools.find(t => t.id === toolId);

      // Nếu tool là premium mà user không có premium, chuyển hướng sang /pricing
      if (tool && tool.isPremium && !isPremium) {
        navigate('/pricing', { replace: true });
        return;
      }

      try {
        const Component = await loadToolComponent(toolId);
        setToolComponent(Component);
      } catch (err) {
        setError('Không thể tải công cụ này');
        console.error('Error loading tool:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTool();
  }, [toolId, isToolEnabled, tools, isPremium, navigate]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Đang tải công cụ...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <Alert.Heading>Lỗi</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  if (!ToolComponent) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          <Alert.Heading>Không tìm thấy công cụ</Alert.Heading>
          <p>Công cụ bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Suspense fallback={
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Đang tải giao diện công cụ...</p>
      </Container>
    }>
      <Container className="py-4">
        <ToolComponent />
      </Container>
    </Suspense>
  );
};

export default ToolRenderer;