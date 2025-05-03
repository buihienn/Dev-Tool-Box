import { lazy } from 'react';

/**
 * Cache lưu trữ các component đã tải
 * Giúp tránh tải lại component khi chuyển trang và quay lại
 */
const toolComponentCache = {};

/**
 * Danh sách các công cụ tích hợp sẵn trong ứng dụng
 * Giúp tải nhanh hơn và tránh lỗi khi import
 */
const staticTools = {
  'token': () => import('../pages/TokenGeneratorTool'),
  'hash': () => import('../pages/HashText'),
  'bcrypt': () => import('../pages/Bcrypt'),
  'math': () => import('../pages/MathEvaluator'),
  'ulid': () => import('../pages/UlidGenerator'),
  'eta-calculator': () => import('../pages/ETACalculator'),
  'percentage-calculator': () => import('../pages/PercentageCalculator'),
  'base-converter': () => import('../pages/IntegerBaseConverter'),
  'text-to-nato-alphabet': () => import('../pages/TextToNatoAlphabet'),
  'xml-to-json': () => import('../pages/XMLToJSON'),
  'url-parser': () => import('../pages/URLParser'),
  'url-formatter': () => import('../pages/URLFormatter'),
  'jwt-parser': () => import('../pages/JWTParser'),
  'chronometer': () => import('../pages/Chronometer'),
  'qr-code': () => import('../pages/QRCodeGenerator'),
  'wifi-qr-code': () => import('../pages/WiFiQRCodeGenerator'),
  'image-to-base64': () => import('../pages/ImageToBase64'),
  'json-formatter': () => import('../pages/JSONFormatter'),
  'json-to-csv': () => import('../pages/JSONToCSV'),
  'docker-compose-converter': () => import('../pages/DockerComposeConverter'),
  'temperature-converter': () => import('../pages/TemperatureConverter'),
  'benchmark': () => import('../pages/BenchmarkBuilder'),
  'lorem-ipsum': () => import('../pages/LoremIpsumGenerator'),
  'text-statistics': () => import('../pages/TextStatistics'),
  'numeronym': () => import('../pages/NumeronymGenerator'),
  'phone-parser': () => import('../pages/PhoneParser'),
  'iban': () => import('../pages/IbanValidator'),
  'credit-card': () => import('../pages/CreditCardValidator'),
  'mac-address': () => import('../pages/MacAddressGenerator'),
  'ipv4': () => import('../pages/Ipv4Converter'),
  'ipv4-range': () => import('../pages/Ipv4RangeExpander')
};

/**
 * Tải component tool dựa vào toolId
 * Ưu tiên tìm trong danh sách tĩnh, rồi tới thư mục pages, cuối cùng là plugins
 * 
 * @param {string} toolId - ID của công cụ cần tải
 * @returns {Promise<React.Component>} Component tương ứng với toolId
 * @throws {Error} Nếu không tìm thấy component
 */
export const loadToolComponent = async (toolId) => {
  // Kiểm tra xem đã có trong cache chưa
  if (toolComponentCache[toolId]) {
    return toolComponentCache[toolId];
  }
  
  try {
    // Sử dụng React.lazy để tải component động
    const Component = lazy(() => {
      // Thứ tự tìm kiếm:
      // 1. Kiểm tra trong danh sách static tools
      if (staticTools[toolId]) {
        return staticTools[toolId]();
      }
      
      // 2. Thử tải từ thư mục pages với các cấu trúc khác nhau
      return import(`../pages/${toolId}/${toolId}.jsx`)
        .catch(() => import(`../pages/${toolId}.jsx`))
        .catch(() => import(`../pages/${toolId}/${toolId}.js`))
        .catch(() => import(`../pages/${toolId}.js`))
        .catch(() => {
          // 3. Nếu không tìm thấy, thử tải từ thư mục plugins (công cụ động)
          return import(`../plugins/${toolId}.js`)
            .catch((error) => {
              console.error(`Tool ${toolId} not found in any location:`, error);
              throw new Error(`Tool component not found: ${toolId}`);
            });
        });
    });
    
    // Lưu vào cache để tối ưu hiệu suất
    toolComponentCache[toolId] = Component;
    return Component;
  } catch (error) {
    console.error(`Failed to load tool component: ${toolId}`, error);
    throw error;
  }
};

/**
 * Kiểm tra xem công cụ có tồn tại không
 * 
 * @param {string} toolId - ID của công cụ cần kiểm tra
 * @returns {Promise<boolean>} true nếu công cụ tồn tại, false nếu không
 */
export const isToolAvailable = async (toolId) => {
  try {
    await loadToolComponent(toolId);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Xóa cache của một công cụ cụ thể
 * Hữu ích khi cần tải lại công cụ sau khi cập nhật
 * 
 * @param {string} toolId - ID của công cụ cần xóa cache
 */
export const clearToolCache = (toolId) => {
  if (toolId) {
    delete toolComponentCache[toolId];
  }
};

/**
 * Xóa toàn bộ cache
 * Hữu ích khi cần tải lại tất cả công cụ sau khi có cập nhật lớn
 */
export const clearAllToolCache = () => {
  Object.keys(toolComponentCache).forEach(key => {
    delete toolComponentCache[key];
  });
};