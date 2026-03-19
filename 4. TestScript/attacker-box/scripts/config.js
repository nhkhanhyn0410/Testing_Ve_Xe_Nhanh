/**
 * Cấu hình chung cho các script tấn công
 * TARGET: Backend deploy trên Render
 */
const TARGET_URL = process.env.TARGET_URL || 'https://ve-xe-nhanh.onrender.com';
const API_VERSION = process.env.API_VERSION || 'v1';

module.exports = {
  target: {
    base: TARGET_URL,
    api: `${TARGET_URL}/api/${API_VERSION}`,
    name: 'PRODUCTION',
  },
  // Tài khoản test (từ seed data)
  accounts: {
    admin: { identifier: 'admin@quikride.com', password: 'admin123' },
    customer: { identifier: 'customer1@gmail.com', password: '123456' },
    operator: { identifier: 'operator1@quikride.com', password: 'operator123' },
    tripManager: { employeeCode: 'TM-PT-001', password: 'manager123' },
  },
  // Thư mục lưu kết quả
  resultsDir: process.env.RESULTS_DIR || require('path').join(__dirname, '..', 'results'),
};
