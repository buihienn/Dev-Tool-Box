import {
  Key,
  Hash,
  ShieldLock,
  ClockHistory,
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
    id: 'ulid-generator',
    name: 'ULID Generator',
    description: 'Tạo ULID ngẫu nhiên (Universally Unique Lexicographically Sortable Identifier)',
    icon: ClockHistory, 
    category: 'crypto', 
    isNew: true,
    isPremium: false, 
  },
];

export default toolsData;