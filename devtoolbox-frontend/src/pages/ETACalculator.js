import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { format } from 'date-fns';
import ToolHeader from '../components/ToolHeader';

const ETACalculator = () => {
  // State cho input values
  const [totalElements, setTotalElements] = useState('');
  const [startTime, setStartTime] = useState('');
  const [elementsPerTimeSpan, setElementsPerTimeSpan] = useState('');
  const [timeSpan, setTimeSpan] = useState('');
  const [timeUnit, setTimeUnit] = useState('minutes');
  
  // State cho kết quả
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Khởi tạo thời gian hiện tại khi component được load
  useEffect(() => {
    const now = new Date();
    setStartTime(format(now, "yyyy-MM-dd'T'HH:mm"));
  }, []);

  const calculateETA = () => {
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      // Validate inputs
      if (!totalElements || !startTime || !elementsPerTimeSpan || !timeSpan || elementsPerTimeSpan <= 0 || timeSpan <= 0) {
        throw new Error("Vui lòng điền đầy đủ thông tin và đảm bảo giá trị số lớn hơn 0");
      }

      // Convert to numbers
      const totalElementsNum = parseFloat(totalElements);
      const elementsPerTimeSpanNum = parseFloat(elementsPerTimeSpan);
      const timeSpanNum = parseFloat(timeSpan);
      
      // Convert timespan to minutes for calculation
      let timeSpanInMinutes = timeSpanNum;
      if (timeUnit === 'seconds') timeSpanInMinutes = timeSpanNum / 60;
      if (timeUnit === 'hours') timeSpanInMinutes = timeSpanNum * 60;
      if (timeUnit === 'days') timeSpanInMinutes = timeSpanNum * 24 * 60;

      // Calculate time needed (in minutes)
      const totalTimeInMinutes = (totalElementsNum / elementsPerTimeSpanNum) * timeSpanInMinutes;
      
      // Calculate hours, minutes
      const hours = Math.floor(totalTimeInMinutes / 60);
      const minutes = Math.floor(totalTimeInMinutes % 60);
      
      // Calculate end time
      const startDateTime = new Date(startTime);
      const endDateTime = new Date(startDateTime.getTime() + totalTimeInMinutes * 60 * 1000);
      
      // Format end time for display
      const endTimeFormatted = format(endDateTime, 'HH:mm');
      const endDateFormatted = format(endDateTime, 'dd/MM/yyyy');
      const isToday = endDateFormatted === format(new Date(), 'dd/MM/yyyy');
      
      // Set results
      setResult({
        totalTimeHours: hours,
        totalTimeMinutes: minutes,
        endTime: endTimeFormatted,
        endDate: endDateFormatted,
        isToday: isToday,
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem'}}>
      <ToolHeader toolId="eta-calculator"/>
      <Row className="d-flex flex-column flex-lg-row gap-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Col>
          <Card className="bg-light mb-4">
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Tổng số phần tử cần xử lý</strong></Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ví dụ: 500"
                    value={totalElements}
                    onChange={(e) => setTotalElements(e.target.value)}
                    min="1"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><strong>Thời điểm bắt đầu</strong></Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label><strong>Số phần tử đã xử lý</strong></Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Ví dụ: 5"
                        value={elementsPerTimeSpan}
                        onChange={(e) => setElementsPerTimeSpan(e.target.value)}
                        min="0.1"
                        step="0.1"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs="auto" className="d-flex align-items-end">
                    <div className="pb-2">trong</div>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label><strong>Khoảng thời gian</strong></Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Ví dụ: 3"
                        value={timeSpan}
                        onChange={(e) => setTimeSpan(e.target.value)}
                        min="0.1"
                        step="0.1"
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label><strong>Đơn vị</strong></Form.Label>
                      <Form.Select value={timeUnit} onChange={(e) => setTimeUnit(e.target.value)}>
                        <option value="seconds">giây</option>
                        <option value="minutes">phút</option>
                        <option value="hours">giờ</option>
                        <option value="days">ngày</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    onClick={calculateETA}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang tính...' : 'Tính ETA'}
                  </Button>
                </div>

                {result && (
                  <Alert variant="success" className="mt-4">
                    <h5>Kết quả:</h5>
                    <p><strong>Tổng thời gian:</strong> {result.totalTimeHours} giờ {result.totalTimeMinutes} phút</p>
                    <p><strong>Thời gian kết thúc:</strong> {result.isToday ? 'hôm nay' : result.endDate} lúc {result.endTime}</p>
                  </Alert>
                )}

                {error && (
                  <Alert variant="danger" className="mt-4">
                    <strong>Lỗi:</strong> {error}
                  </Alert>
                )}
              </Form>
            </Card.Body>
          </Card>

          <Card className="bg-light">
            <Card.Body>
              <h5>Hướng dẫn sử dụng:</h5>
              <p>Công cụ này giúp bạn tính thời gian dự kiến hoàn thành một công việc dựa trên tốc độ hiện tại.</p>
              
              <p><strong>Ví dụ:</strong></p>
              <p>
                Nếu bạn rửa được 5 cái đĩa trong 3 phút và bạn có tổng cộng 500 cái đĩa cần rửa,
                thì sẽ mất khoảng 5 giờ để hoàn thành tất cả.
              </p>
              
              <p><strong>Các bước thực hiện:</strong></p>
              <ol>
                <li>Nhập tổng số phần tử cần xử lý (ví dụ: 500 đĩa)</li>
                <li>Xác nhận thời điểm bắt đầu công việc</li>
                <li>Nhập số phần tử đã xử lý trong một khoảng thời gian (ví dụ: 5 đĩa trong 3 phút)</li>
                <li>Nhấn nút "Tính ETA" để xem kết quả</li>
              </ol>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ETACalculator;