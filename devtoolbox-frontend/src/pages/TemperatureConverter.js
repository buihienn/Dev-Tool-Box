import React, { useState, useEffect } from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import ToolHeader from '../components/ToolHeader';

const TemperatureConverter = () => {
  // Định nghĩa các đơn vị nhiệt độ và giá trị mặc định
  const temperatureUnits = [
    { id: 'kelvin', name: 'Kelvin', symbol: 'K', defaultValue: 0 },
    { id: 'celsius', name: 'Celsius', symbol: '°C', defaultValue: -273.15 },
    { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F', defaultValue: -459.67 },
    { id: 'rankine', name: 'Rankine', symbol: '°R', defaultValue: 0 },
    { id: 'delisle', name: 'Delisle', symbol: '°De', defaultValue: 559.72 },
    { id: 'newton', name: 'Newton', symbol: '°N', defaultValue: -90.14 },
    { id: 'reaumur', name: 'Réaumur', symbol: '°Ré', defaultValue: -218.52 },
    { id: 'romer', name: 'Rømer', symbol: '°Rø', defaultValue: -135.91 }
  ];

  // State để lưu trữ giá trị của từng đơn vị nhiệt độ
  const [temperatures, setTemperatures] = useState({});
  // State để theo dõi đơn vị nào đang được chỉnh sửa để tránh vòng lặp vô hạn
  const [activeUnit, setActiveUnit] = useState(null);

  // Khởi tạo state với giá trị mặc định
  useEffect(() => {
    const initialTemperatures = {};
    temperatureUnits.forEach(unit => {
      initialTemperatures[unit.id] = unit.defaultValue;
    });
    setTemperatures(initialTemperatures);
  }, []);

  // Hàm chuyển đổi từ bất kỳ đơn vị nào sang Kelvin
  const convertToKelvin = (value, fromUnit) => {
    switch (fromUnit) {
      case 'kelvin':
        return value;
      case 'celsius':
        return value + 273.15;
      case 'fahrenheit':
        return (value + 459.67) * 5/9;
      case 'rankine':
        return value * 5/9;
      case 'delisle':
        return 373.15 - (value * 2/3);
      case 'newton':
        return value * 100/33 + 273.15;
      case 'reaumur':
        return value * 5/4 + 273.15;
      case 'romer':
        return (value - 7.5) * 40/21 + 273.15;
      default:
        return value;
    }
  };

  // Hàm chuyển đổi từ Kelvin sang bất kỳ đơn vị nào
  const convertFromKelvin = (kelvin, toUnit) => {
    switch (toUnit) {
      case 'kelvin':
        return kelvin;
      case 'celsius':
        return kelvin - 273.15;
      case 'fahrenheit':
        return kelvin * 9/5 - 459.67;
      case 'rankine':
        return kelvin * 9/5;
      case 'delisle':
        return (373.15 - kelvin) * 3/2;
      case 'newton':
        return (kelvin - 273.15) * 33/100;
      case 'reaumur':
        return (kelvin - 273.15) * 4/5;
      case 'romer':
        return (kelvin - 273.15) * 21/40 + 7.5;
      default:
        return kelvin;
    }
  };

  // Hàm xử lý khi người dùng thay đổi giá trị ở một đơn vị
  const handleTemperatureChange = (value, unit) => {
    // Đặt đơn vị đang được chỉnh sửa
    setActiveUnit(unit);
    
    // Chuyển đổi giá trị sang số
    const numericValue = parseFloat(value);
    
    // Kiểm tra nếu giá trị không hợp lệ thì không xử lý
    if (isNaN(numericValue)) {
      // Cập nhật chỉ giá trị hiện tại thành chuỗi rỗng hoặc giá trị gốc
      setTemperatures(prev => ({ ...prev, [unit]: value }));
      return;
    }
    
    // Chuyển đổi từ đơn vị được chỉnh sửa sang Kelvin
    const kelvin = convertToKelvin(numericValue, unit);
    
    // Chuyển đổi từ Kelvin sang tất cả các đơn vị khác
    const newTemperatures = {};
    temperatureUnits.forEach(tempUnit => {
      // Làm tròn đến 2 chữ số thập phân
      newTemperatures[tempUnit.id] = Math.round(convertFromKelvin(kelvin, tempUnit.id) * 100) / 100;
    });
    
    // Cập nhật state với tất cả các giá trị đã chuyển đổi
    setTemperatures(newTemperatures);
  };

  // Định dạng số để hiển thị
  const formatNumber = (number) => {
    // Kiểm tra nếu là số nguyên
    if (Number.isInteger(number)) {
      return number.toString();
    }
    // Nếu là số thập phân, giữ tối đa 2 chữ số thập phân
    return number.toFixed(2).replace(/\.?0+$/, '');
  };

  return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ToolHeader toolId="temperature-converter"/>

      <Row style={{ maxWidth: '800px', width: '100%' }}>
        <Col>
          <Card className="bg-light mb-4">
            <Card.Body>
              <p className="mb-4">
                Nhập giá trị vào bất kỳ ô nào để tự động chuyển đổi sang các đơn vị khác.
              </p>
              
              {temperatureUnits.map((unit) => (
                <Form.Group key={unit.id} className="mb-3">
                  <Form.Label>
                    <strong>{unit.name}</strong>
                  </Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="number"
                      step="any"
                      value={temperatures[unit.id] || ''}
                      onChange={(e) => handleTemperatureChange(e.target.value, unit.id)}
                      placeholder={`Nhập ${unit.name}`}
                    />
                    <span className="input-group-text">{unit.symbol}</span>
                  </div>
                </Form.Group>
              ))}
            </Card.Body>
          </Card>

          <Card className="bg-light">
            <Card.Body>
              <h5>Thông tin về các đơn vị nhiệt độ:</h5>
              <ul>
                <li><strong>Kelvin (K)</strong> - Đơn vị cơ bản trong hệ SI, 0K là nhiệt độ thấp nhất có thể đạt được (0K = -273.15°C)</li>
                <li><strong>Celsius (°C)</strong> - Thang đo phổ biến, 0°C là nhiệt độ đóng băng của nước</li>
                <li><strong>Fahrenheit (°F)</strong> - Thang đo phổ biến tại Mỹ, 32°F là nhiệt độ đóng băng của nước</li>
                <li><strong>Rankine (°R)</strong> - Phiên bản Kelvin của thang đo Fahrenheit (0°R = 0K)</li>
                <li><strong>Delisle (°De)</strong> - Thang đo lịch sử do Joseph-Nicolas Delisle tạo ra năm 1732</li>
                <li><strong>Newton (°N)</strong> - Thang đo do Isaac Newton phát triển</li>
                <li><strong>Réaumur (°Ré)</strong> - Thang đo được sử dụng ở Châu Âu trong thế kỷ 18-19</li>
                <li><strong>Rømer (°Rø)</strong> - Thang đo lịch sử được Ole Rømer phát triển năm 1701</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TemperatureConverter;