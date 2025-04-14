import {
  Key,
  Hash,
  ShieldLock,
  Calculator,
  ClockHistory,
  Globe,
} from 'react-bootstrap-icons';

const toolsData = [
  {
    id: 'token-generator',
    name: 'Token generator',
    description: 'Tạo token ngẫu nhiên để sử dụng trong xác thực hoặc mã hóa',
    icon: Key,
    category: 'crypto',
    isNew: true,
    isPremium: false
  },
  {
    id: 'hash-text',
    name: 'Hash text',
    description: 'Chuyển văn bản thành mã băm bằng các thuật toán như SHA, MD5,...',
    icon: Hash,
    category: 'crypto',
    isNew: false,
    isPremium: false
  },
  {
    id: 'bcrypt',
    name: 'Bcrypt',
    description: 'Mã hóa mật khẩu với thuật toán Bcrypt an toàn',
    icon: ShieldLock,
    category: 'crypto',
    isNew: false,
    isPremium: false
  },
  {
    id: 'math-evaluator',
    name: 'Math Evaluator',
    description: 'Đánh giá biểu thức toán học và trả về kết quả chính xác',
    icon: Calculator,
    category: 'math',
    isNew: true,
    isPremium: false
  },
  {
    id: 'ulid-generator',
    name: 'ULID Generator',
    description: 'Tạo ULID ngẫu nhiên (Universally Unique Lexicographically Sortable Identifier)',
    icon: ClockHistory, 
    category: 'crypto', 
    isNew: true,
    isPremium: false, 
  },
  {
    id: 'base-converter',
    name: 'Integer Base Converter',
    description: 'Chuyển đổi số nguyên giữa các hệ cơ số khác nhau',
    icon: Calculator,
    category: 'converter',
    isNew: false,
    isPremium: false,
  },
  {
    id: 'text-to-nato-alphabet',
    name: 'Text to NATO Alphabet',
    description: 'Chuyển đổi văn bản thành bảng chữ cái NATO',
    icon: Globe,
    category: 'converter',
    isNew: false,
    isPremium: false,
  },
  {
    id: 'xml-to-json',
    name: 'XML to JSON',
    description: 'Chuyển đổi XML thành JSON dễ đọc và sử dụng',
    icon: Globe,
    category: 'converter',
    isNew: false,
    isPremium: false,
  },
  {
    id: 'url-parser',
    name: 'URL Parser',
    description: 'Phân tích và trích xuất thông tin từ URL',
    icon: Globe,
    category: 'web',
    isNew: false,
    isPremium: false,
  },
];

export default toolsData;