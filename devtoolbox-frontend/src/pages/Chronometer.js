import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import ToolHeader from '../components/ToolHeader';

const Chronometer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // Thời gian tính bằng milliseconds
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const pausedTimeRef = useRef(0);

  // Bắt đầu/Dừng đồng hồ
  const toggleTimer = () => {
    if (isRunning) {
      // Dừng đồng hồ
      clearInterval(intervalRef.current);
      pausedTimeRef.current = time;
    } else {
      // Bắt đầu đồng hồ
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10); // Cập nhật mỗi 10ms để có độ chính xác millisecond
    }
    setIsRunning(!isRunning);
  };

  // Reset đồng hồ
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(0);
    pausedTimeRef.current = 0;
    setLaps([]);
  };

  // Ghi lại vòng
  const addLap = () => {
    if (isRunning) {
      setLaps([...laps, time]);
    }
  };

  // Format thời gian thành MM:SS.mmm
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  // Dọn dẹp khi unmount component
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ToolHeader toolId="chronometer"/>
      <Row style={{ maxWidth: '800px', width: '100%' }}>
        <Col lg={8} className="mx-auto">
          <Card className="bg-light mb-4 text-center">
            <Card.Body>
              <div className="chronometer-display mb-4">
                <h1 style={{ 
                  fontSize: '3.5rem', 
                  fontFamily: 'monospace', 
                  fontWeight: 'bold',
                  color: '#343a40',
                  textShadow: '0 0 5px rgba(0,0,0,0.1)',
                  letterSpacing: '2px'
                }}>
                  {formatTime(time)}
                </h1>
              </div>

              <div className="d-flex justify-content-center gap-3 mb-4">
                <Button 
                  variant={isRunning ? "warning" : "primary"} 
                  size="lg" 
                  onClick={toggleTimer}
                  className="px-4"
                >
                  {isRunning ? 'Tạm dừng' : 'Bắt đầu'}
                </Button>
                
                <Button 
                  variant="danger" 
                  size="lg" 
                  onClick={resetTimer}
                  className="px-4"
                >
                  Reset
                </Button>
                
                <Button 
                  variant="secondary" 
                  size="lg" 
                  onClick={addLap}
                  disabled={!isRunning}
                  className="px-4"
                >
                  Vòng
                </Button>
              </div>

              {laps.length > 0 && (
                <div className="lap-times">
                  <h5 className="mb-3">Các vòng đã ghi lại:</h5>
                  <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem' }}>
                    <table className="table table-striped table-sm">
                      <thead>
                        <tr>
                          <th>Vòng</th>
                          <th>Thời gian</th>
                          <th>Thời gian vòng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {laps.map((lapTime, index) => {
                          const previousLapTime = index > 0 ? laps[index - 1] : 0;
                          const lapDuration = lapTime - previousLapTime;
                          
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{formatTime(lapTime)}</td>
                              <td>{formatTime(lapDuration)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>

          <Card className="bg-light">
            <Card.Body>
              <h5>Hướng dẫn sử dụng:</h5>
              <ul>
                <li><strong>Bắt đầu/Tạm dừng:</strong> Bắt đầu hoặc tạm dừng đồng hồ bấm giờ</li>
                <li><strong>Reset:</strong> Đặt lại đồng hồ về 00:00.00</li>
                <li><strong>Vòng:</strong> Ghi lại thời gian hiện tại làm thời gian vòng</li>
              </ul>
              
              <p>Đồng hồ bấm giờ này hiển thị thời gian theo định dạng phút:giây.mili giây và cho phép bạn theo dõi thời gian chính xác của các sự kiện.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Chronometer;