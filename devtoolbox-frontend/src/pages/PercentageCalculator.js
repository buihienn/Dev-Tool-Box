import React, { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Alert, Tab, Nav } from 'react-bootstrap';
import ToolHeader from '../components/ToolHeader';

const PercentageCalculator = () => {
  // State cho thông tin tool
  const [toolInfo, setToolInfo] = useState({ name: '', description: '' });

  // State cho tab thứ nhất: X% của Y là gì?
  const [percentOfValue, setPercentOfValue] = useState({ percent: '', value: '', result: null });

  // State cho tab thứ hai: X là bao nhiêu phần trăm của Y?
  const [valueIsPercentOf, setValueIsPercentOf] = useState({ value1: '', value2: '', result: null });

  // State cho tab thứ ba: Phần trăm tăng/giảm là bao nhiêu?
  const [percentageChange, setPercentageChange] = useState({ from: '', to: '', result: null, isIncrease: null });
  
  // Tính X% của Y
  const handlePercentOfValueChange = (field, value) => {
    const newState = { ...percentOfValue, [field]: value };
    setPercentOfValue(newState);
    
    if (newState.percent && newState.value) {
      const percent = parseFloat(newState.percent);
      const baseValue = parseFloat(newState.value);
      if (!isNaN(percent) && !isNaN(baseValue)) {
        const result = (percent / 100) * baseValue;
        setPercentOfValue({ ...newState, result: result.toFixed(2) });
      }
    }
  };

  // Tính X là bao nhiêu phần trăm của Y
  const handleValueIsPercentOfChange = (field, value) => {
    const newState = { ...valueIsPercentOf, [field]: value };
    setValueIsPercentOf(newState);
    
    if (newState.value1 && newState.value2 && parseFloat(newState.value2) !== 0) {
      const value1 = parseFloat(newState.value1);
      const value2 = parseFloat(newState.value2);
      if (!isNaN(value1) && !isNaN(value2)) {
        const result = (value1 / value2) * 100;
        setValueIsPercentOf({ ...newState, result: result.toFixed(2) });
      }
    }
  };

  // Tính phần trăm tăng/giảm
  const handlePercentageChangeChange = (field, value) => {
    const newState = { ...percentageChange, [field]: value };
    setPercentageChange(newState);
    
    if (newState.from && newState.to && parseFloat(newState.from) !== 0) {
      const from = parseFloat(newState.from);
      const to = parseFloat(newState.to);
      if (!isNaN(from) && !isNaN(to)) {
        const change = ((to - from) / Math.abs(from)) * 100;
        const isIncrease = change >= 0;
        setPercentageChange({
          ...newState,
          result: Math.abs(change).toFixed(2),
          isIncrease
        });
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem'}}>
      <ToolHeader toolId="percentage-calculator"/>

      <Row className="d-flex flex-column flex-lg-row gap-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Col>
            <Card className="bg-light mb-4">
              <Card.Body>
                <Tab.Container defaultActiveKey="percentOfValue">
                  <Nav variant="tabs" className="mb-3">
                    <Nav.Item>
                      <Nav.Link eventKey="percentOfValue">X% của Y là gì?</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="valueIsPercentOf">X là bao nhiêu % của Y?</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="percentageChange">% Tăng/Giảm</Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content>
                    {/* Tab 1: X% của Y là gì? */}
                    <Tab.Pane eventKey="percentOfValue">
                      <div className="p-3">
                        <p>Tính một tỉ lệ phần trăm của một giá trị: X% của Y = ?</p>
                        
                        <Row className="align-items-center g-3 mb-3">
                          <Col xs={12} md="auto">
                            <span>Số</span>
                          </Col>
                          <Col xs={12} md={3}>
                            <Form.Control
                              type="number"
                              value={percentOfValue.percent}
                              onChange={(e) => handlePercentOfValueChange('percent', e.target.value)}
                              placeholder="X"
                            />
                          </Col>
                          <Col xs={12} md="auto">
                            <span>% của</span>
                          </Col>
                          <Col xs={12} md={3}>
                            <Form.Control
                              type="number"
                              value={percentOfValue.value}
                              onChange={(e) => handlePercentOfValueChange('value', e.target.value)}
                              placeholder="Y"
                            />
                          </Col>
                        </Row>

                        {percentOfValue.result !== null && (
                          <Alert variant="success">
                            <strong>Kết quả:</strong> {percentOfValue.percent}% của {percentOfValue.value} là{' '}
                            <strong>{percentOfValue.result}</strong>
                          </Alert>
                        )}
                      </div>
                    </Tab.Pane>

                    {/* Tab 2: X là bao nhiêu % của Y? */}
                    <Tab.Pane eventKey="valueIsPercentOf">
                      <div className="p-3">
                        <p>Tính giá trị X chiếm bao nhiêu phần trăm của giá trị Y: X là ?% của Y</p>
                        
                        <Row className="align-items-center g-3 mb-3">
                          <Col xs={12} md={3}>
                            <Form.Control
                              type="number"
                              value={valueIsPercentOf.value1}
                              onChange={(e) => handleValueIsPercentOfChange('value1', e.target.value)}
                              placeholder="X"
                            />
                          </Col>
                          <Col xs={12} md="auto">
                            <span>là bao nhiêu % của</span>
                          </Col>
                          <Col xs={12} md={3}>
                            <Form.Control
                              type="number"
                              value={valueIsPercentOf.value2}
                              onChange={(e) => handleValueIsPercentOfChange('value2', e.target.value)}
                              placeholder="Y"
                            />
                          </Col>
                        </Row>

                        {valueIsPercentOf.result !== null && (
                          <Alert variant="success">
                            <strong>Kết quả:</strong> {valueIsPercentOf.value1} là{' '}
                            <strong>{valueIsPercentOf.result}%</strong> của {valueIsPercentOf.value2}
                          </Alert>
                        )}
                      </div>
                    </Tab.Pane>

                    {/* Tab 3: % Tăng/Giảm */}
                    <Tab.Pane eventKey="percentageChange">
                      <div className="p-3">
                        <p>Tính phần trăm tăng hoặc giảm giữa hai giá trị</p>
                        
                        <Row className="align-items-center g-3 mb-3">
                          <Col xs={12} md="auto">
                            <span>Từ</span>
                          </Col>
                          <Col xs={12} md={3}>
                            <Form.Control
                              type="number"
                              value={percentageChange.from}
                              onChange={(e) => handlePercentageChangeChange('from', e.target.value)}
                              placeholder="Giá trị ban đầu"
                            />
                          </Col>
                          <Col xs={12} md="auto">
                            <span>đến</span>
                          </Col>
                          <Col xs={12} md={3}>
                            <Form.Control
                              type="number"
                              value={percentageChange.to}
                              onChange={(e) => handlePercentageChangeChange('to', e.target.value)}
                              placeholder="Giá trị sau"
                            />
                          </Col>
                        </Row>

                        {percentageChange.result !== null && (
                          <Alert variant="success">
                            <strong>Kết quả:</strong> {percentageChange.isIncrease ? 'Tăng' : 'Giảm'}{' '}
                            <strong>{percentageChange.result}%</strong> từ {percentageChange.from} đến {percentageChange.to}
                          </Alert>
                        )}
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </Card.Body>
            </Card>

            <Card className="bg-light">
              <Card.Body>
                <h5>Hướng dẫn sử dụng:</h5>
                <p>Công cụ này giúp bạn thực hiện các phép tính phần trăm phổ biến:</p>
                
                <ul>
                  <li><strong>X% của Y là gì?</strong> - Tính một phần trăm cụ thể của một giá trị</li>
                  <li><strong>X là bao nhiêu % của Y?</strong> - Tính tỉ lệ phần trăm giữa hai giá trị</li>
                  <li><strong>% Tăng/Giảm</strong> - Tính phần trăm tăng hoặc giảm giữa hai giá trị</li>
                </ul>
                
                <p>Nhập các giá trị vào ô tương ứng và kết quả sẽ được tính toán tự động.</p>
              </Card.Body>
            </Card>
          </Col>
      </Row>
    </div>
  );
};

export default PercentageCalculator;