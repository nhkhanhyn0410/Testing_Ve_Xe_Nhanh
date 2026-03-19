// ==================== CẤU HÌNH CHUNG CHO PERFORMANCE TEST ====================
// Sử dụng: import { BASE_URL, HEADERS, ... } from '../helpers/config.js';

export const BASE_URL = __ENV.BASE_URL || 'https://ve-xe-nhanh.onrender.com/api/v1';
export const FRONTEND_URL = __ENV.FRONTEND_URL || 'https://ve-xe-nhanh-testing-frontend.vercel.app';

// ==================== HEADERS ====================
export const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export function authHeaders(token) {
  return { ...HEADERS, Authorization: `Bearer ${token}` };
}

// ==================== TEST DATA ====================
export const TEST_USERS = {
  customer: { email: 'customer1@gmail.com', password: '123456' },
  operator: { email: 'operator1@quikride.com', password: 'operator123' },
  admin: { email: 'admin@quikride.com', password: 'admin123' },
  tripManager: { username: 'TM-PT-001', password: 'manager123' },
};

export const ROUTES = {
  hcmVungTau: { origin: 'TP. Hồ Chí Minh', destination: 'Vũng Tàu' },
  hcmDaLat: { origin: 'TP. Hồ Chí Minh', destination: 'Đà Lạt' },
  hcmNhaTrang: { origin: 'TP. Hồ Chí Minh', destination: 'Nha Trang' },
};

// ==================== NGƯỠNG HIỆU NĂNG (THRESHOLDS) ====================
// p95 < 2s: 95% request phải hoàn thành dưới 2 giây
// Error rate < 5%: Tỉ lệ lỗi dưới 5%
export const DEFAULT_THRESHOLDS = {
  http_req_duration: ['p(95)<2000', 'p(99)<5000'],
  http_req_failed: ['rate<0.05'],
};

// ==================== CÁC MỨC TẢI ====================
// Smoke: 1 user, kiểm tra hệ thống hoạt động
// Load:  50 users đồng thời trong 3 phút
// Stress: tăng dần đến 200 users
// Spike: đột ngột 300 users
export const LOAD_PROFILES = {
  smoke: {
    stages: [{ duration: '30s', target: 1 }],
  },
  load: {
    stages: [
      { duration: '30s', target: 20 },
      { duration: '2m', target: 50 },
      { duration: '30s', target: 0 },
    ],
  },
  stress: {
    stages: [
      { duration: '30s', target: 50 },
      { duration: '1m', target: 100 },
      { duration: '1m', target: 200 },
      { duration: '30s', target: 0 },
    ],
  },
  spike: {
    stages: [
      { duration: '10s', target: 10 },
      { duration: '10s', target: 300 },
      { duration: '30s', target: 300 },
      { duration: '10s', target: 0 },
    ],
  },
};

// ==================== HELPER: Chọn profile từ ENV ====================
// Chạy: k6 run -e PROFILE=load script.js
export function getProfile() {
  const name = __ENV.PROFILE || 'smoke';
  return LOAD_PROFILES[name] || LOAD_PROFILES.smoke;
}

// ==================== HELPER: Tạo ngày tương lai ====================
export function futureDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + (daysFromNow || 7));
  return d.toISOString().split('T')[0];
}
