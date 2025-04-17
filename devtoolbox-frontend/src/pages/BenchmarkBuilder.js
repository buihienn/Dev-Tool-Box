import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Table, Alert } from 'react-bootstrap';
import { PlusCircle, Trash, ClipboardCheck } from 'react-bootstrap-icons';
import ToolHeader from '../components/ToolHeader';

const API_BASE_URL = 'http://localhost:8080/tool/benchmark';

const BenchmarkBuilder = () => {
  const [benchmarkId, setBenchmarkId] = useState(null);
  const [unit, setUnit] = useState('ms');
  const [suites, setSuites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  
  // Khởi tạo benchmark khi component mount
  useEffect(() => {
    setLoading(true);
    
    createNewBenchmark();
  }, []);
  
  // Tạo benchmark mới
  const createNewBenchmark = async () => {
    try {
      setLoading(true);
      // Bước 1: Tạo benchmark mới
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unit }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create benchmark');
      }
      
      const data = await response.json();
      setBenchmarkId(data.id);
      
      // Bước 2: Tạo các suite mặc định
      const suitePromises = [];
      
      // Tạo Suite 1
      suitePromises.push(
        fetch(`${API_BASE_URL}/${data.id}/suite`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: 'Suite 1' }),
        })
      );
      
      // Tạo Suite 2
      suitePromises.push(
        fetch(`${API_BASE_URL}/${data.id}/suite`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: 'Suite 2' }),
        })
      );
      
      // Đợi cả hai suite được tạo xong
      await Promise.all(suitePromises);
      
      // Bước 3: Lấy dữ liệu benchmark sau khi đã thêm các suite
      const updatedResponse = await fetch(`${API_BASE_URL}/${data.id}`);
      
      if (!updatedResponse.ok) {
        throw new Error('Failed to fetch updated benchmark');
      }
      
      const updatedData = await updatedResponse.json();
      setSuites(updatedData.suites || []);
      setUnit(updatedData.unit || 'ms');
      
      setError(null);
    } catch (err) {
      setError('Có lỗi xảy ra khi tạo benchmark: ' + err.message);
      setSuites([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Lấy dữ liệu benchmark
  const fetchBenchmark = async () => {
    if (!benchmarkId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${benchmarkId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch benchmark');
      }
      
      const data = await response.json();
      setSuites(data.suites || []);
      setUnit(data.unit || 'ms');
      setError(null);
    } catch (err) {
      setError('Có lỗi xảy ra khi lấy dữ liệu benchmark: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Thêm suite mới
  const addSuite = async () => {
    if (!benchmarkId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${benchmarkId}/suite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: `Suite ${suites.length + 1}` }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add suite');
      }
      
      // Cập nhật lại dữ liệu sau khi thêm
      await fetchBenchmark();
    } catch (err) {
      setError('Có lỗi xảy ra khi thêm suite: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Xóa suite
  const deleteSuite = async (suiteId) => {
    if (!benchmarkId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${benchmarkId}/suite/${suiteId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete suite');
      }
      
      // Cập nhật lại dữ liệu sau khi xóa
      await fetchBenchmark();
    } catch (err) {
      setError('Có lỗi xảy ra khi xóa suite: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Thêm giá trị đo
  const addMeasure = async (suiteId, value) => {
    if (!benchmarkId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${benchmarkId}/suite/${suiteId}/measure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: parseFloat(value) }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add measure');
      }
      
      // Cập nhật lại dữ liệu sau khi thêm
      await fetchBenchmark();
    } catch (err) {
      setError('Có lỗi xảy ra khi thêm giá trị: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Cập nhật tên suite
  const updateSuiteName = async (suiteId, newName) => {
    if (!benchmarkId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${benchmarkId}/suite/${suiteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update suite name');
      }
      
      // Cập nhật UI ngay lập tức thay vì fetch lại toàn bộ
      const updatedSuites = suites.map(suite => 
        suite.id === suiteId ? { ...suite, name: newName } : suite
      );
      setSuites(updatedSuites);
    } catch (err) {
      setError('Có lỗi xảy ra khi cập nhật tên suite: ' + err.message);
      // Nếu có lỗi, fetch lại dữ liệu để đảm bảo đồng bộ
      await fetchBenchmark();
    } finally {
      setLoading(false);
    }
  };
  
  // Cập nhật đơn vị
  const updateUnit = async (newUnit) => {
    if (!benchmarkId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${benchmarkId}/unit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unit: newUnit }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update unit');
      }
      
      setUnit(newUnit);
      // Cập nhật lại dữ liệu sau khi thay đổi đơn vị
      await fetchBenchmark();
    } catch (err) {
      setError('Có lỗi xảy ra khi cập nhật đơn vị: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Sao chép kết quả dưới dạng markdown
  const copyAsMarkdown = async () => {
    if (!benchmarkId) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/${benchmarkId}/export/markdown`);
      
      if (!response.ok) {
        throw new Error('Failed to generate markdown');
      }
      
      const data = await response.json();
      navigator.clipboard.writeText(data.markdown);
      
      setCopySuccess('Đã sao chép Markdown table!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setError('Có lỗi xảy ra khi sao chép Markdown: ' + err.message);
    }
  };
  
  // Sao chép kết quả dưới dạng bullet list
  const copyAsBulletList = async () => {
    if (!benchmarkId) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/${benchmarkId}/export/bulletlist`);
      
      if (!response.ok) {
        throw new Error('Failed to generate bullet list');
      }
      
      const data = await response.json();
      navigator.clipboard.writeText(data.bulletList);
      
      setCopySuccess('Đã sao chép Bullet list!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setError('Có lỗi xảy ra khi sao chép Bullet list: ' + err.message);
    }
  };
  
  // Xử lý thêm giá trị đo mới cho suite
  const handleAddMeasure = (e, suiteId) => {
    e.preventDefault();
    const form = e.target;
    const value = form.elements.measureValue.value;
    
    if (value && !isNaN(parseFloat(value))) {
      addMeasure(suiteId, value);
      form.reset();
    }
  };
  
  // Tính giá trị trung bình của suite
  const calculateMean = (suite) => {
    if (!suite.measures || suite.measures.length === 0) return 0;
    const sum = suite.measures.reduce((acc, m) => acc + m.value, 0);
    return sum / suite.measures.length;
  };
  
  // Tính phương sai của suite
  const calculateVariance = (suite) => {
    if (!suite.measures || suite.measures.length <= 1) return 0;
    const mean = calculateMean(suite);
    const sumOfSquaredDifferences = suite.measures.reduce(
      (acc, m) => acc + Math.pow(m.value - mean, 2), 0
    );
    return sumOfSquaredDifferences / suite.measures.length;
  };
  
  // Sắp xếp suites theo mean
  const sortedSuites = [...suites].sort((a, b) => {
    return calculateMean(a) - calculateMean(b);
  });

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ToolHeader toolId="benchmark"/>

      <div style={{ maxWidth: '1000px', width: '100%' }}>
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        
        {copySuccess && (
          <Alert variant="success" className="mb-4">
            {copySuccess}
          </Alert>
        )}
        
        {/* Card đầu tiên - Cài đặt đơn vị và các nút chức năng */}
        <Card className="bg-light mb-4">
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label><strong>Đơn vị đo</strong></Form.Label>
              <Form.Control
                type="text"
                value={unit}
                onChange={(e) => updateUnit(e.target.value)}
                placeholder="Nhập đơn vị (vd: ms, s, ns...)"
              />
              <Form.Text className="text-muted">
                Ví dụ: ms (milliseconds), s (seconds), ns (nanoseconds)
              </Form.Text>
            </Form.Group>
            
            <div className="d-flex justify-content-between">
              <Button 
                variant="primary" 
                onClick={addSuite} 
                disabled={loading || !benchmarkId}
                className="mb-2"
              >
                <PlusCircle className="me-2" /> Thêm Suite
              </Button>
              
              <Button 
                variant="outline-danger" 
                onClick={createNewBenchmark} 
                disabled={loading}
              >
                Reset Benchmark
              </Button>
            </div>
          </Card.Body>
        </Card>
        
        {/* Suite Cards - Cuộn ngang */}
        <div className="mb-4">
          <div 
            style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '1rem',
              padding: '0.5rem 0',
              WebkitOverflowScrolling: 'touch',
            }}
            className="custom-horizontal-scroll"
          >
            {suites.length === 0 ? (
              <div></div>
            ) : (
              suites.map((suite) => (
                <Card 
                  key={suite.id} 
                  style={{ 
                    minWidth: '300px',
                    maxWidth: '300px',
                    height: 'fit-content'
                  }}
                >
                  <Card.Header className="d-flex align-items-center justify-content-between">
                    <Form.Control
                      type="text"
                      value={suite.name}
                      onChange={(e) => updateSuiteName(suite.id, e.target.value)}
                      style={{ maxWidth: '60%' }}
                    />
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => deleteSuite(suite.id)}
                      disabled={loading}
                    >
                      <Trash />
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <strong>Các giá trị đã đo:</strong> {' '}
                      {suite.measures && suite.measures.length > 0 ? (
                        <div className="mt-2" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                          {suite.measures.map((m, i) => 
                            <span key={m.id || i} className="badge bg-secondary me-1 mb-1">{m.value} {unit}</span>
                          )}
                        </div>
                      ) : (
                        <div className="text-muted mt-2">Chưa có giá trị nào</div>
                      )}
                    </div>
                    
                    <Form onSubmit={(e) => handleAddMeasure(e, suite.id)}>
                      <div className="d-flex gap-2">
                        <Form.Control 
                          name="measureValue"
                          type="number" 
                          placeholder={`Nhập giá trị (${unit})`}
                          step="any"
                        />
                        <Button type="submit" variant="success" disabled={loading}>
                          Thêm
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                  <Card.Footer>
                    <div>
                      <div><strong>Số mẫu:</strong> {suite.measures ? suite.measures.length : 0}</div>
                      <div><strong>Trung bình:</strong> {calculateMean(suite).toFixed(2)} {unit}</div>
                      <div><strong>Phương sai:</strong> {calculateVariance(suite).toFixed(2)} {unit}²</div>
                    </div>
                  </Card.Footer>
                </Card>
              ))
            )}
          </div>
        </div>
        
        {/* Kết quả Benchmark Card */}
        <Card className="bg-light mb-4">
          <Card.Header>
            <h5 className="mb-0">Kết quả Benchmark</h5>
          </Card.Header>
          <Card.Body>
            <Table striped bordered responsive>
              <thead>
                <tr>
                  <th>Vị trí</th>
                  <th>Suite</th>
                  <th>Số mẫu</th>
                  <th>Trung bình</th>
                  <th>Phương sai</th>
                </tr>
              </thead>
              <tbody>
                {sortedSuites.map((suite, index) => (
                  <tr key={suite.id}>
                    <td>{index + 1}</td>
                    <td>{suite.name}</td>
                    <td>{suite.measures ? suite.measures.length : 0}</td>
                    <td>{calculateMean(suite).toFixed(2)} {unit}</td>
                    <td>{calculateVariance(suite).toFixed(2)} {unit}²</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            <div className="d-flex gap-2 mt-3 justify-content-center">
              <Button 
                variant="outline-secondary" 
                onClick={copyAsMarkdown}
                disabled={loading || suites.length === 0}
              >
                <ClipboardCheck className="me-2" /> Copy as Markdown table
              </Button>
              
              <Button 
                variant="outline-secondary" 
                onClick={copyAsBulletList}
                disabled={loading || suites.length === 0}
              >
                <ClipboardCheck className="me-2" /> Copy as Bullet list
              </Button>
            </div>
          </Card.Body>
        </Card>
        
        {/* Hướng dẫn Card */}
        <Card className="bg-light">
          <Card.Body>
            <h5>Hướng dẫn sử dụng</h5>
            <p>Công cụ này giúp bạn so sánh thời gian thực thi của các nhiệm vụ khác nhau:</p>
            <ol>
              <li>Thiết lập <strong>đơn vị đo thời gian</strong> bạn muốn sử dụng (ms, s, µs...)</li>
              <li>Nhấn <strong>Thêm Suite</strong> để tạo một nhóm phép đo mới</li>
              <li>Đặt tên cho suite (ví dụ: "Thuật toán A", "Thuật toán B")</li>
              <li>Thêm các giá trị thời gian đo được vào từng suite</li>
              <li>Xem kết quả so sánh trong bảng bên phải</li>
              <li>Sao chép kết quả dưới dạng Markdown hoặc danh sách để sử dụng trong báo cáo</li>
            </ol>
          </Card.Body>
        </Card>
      </div>

      <style jsx="true">{`
        .custom-horizontal-scroll::-webkit-scrollbar {
          height: 8px;
        }
        .custom-horizontal-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-horizontal-scroll::-webkit-scrollbar-thumb {
          background: #CCC;
          border-radius: 4px;
        }
        .custom-horizontal-scroll::-webkit-scrollbar-thumb:hover {
          background: #AAA;
        }
      `}</style>
    </div>
  );
};

export default BenchmarkBuilder;