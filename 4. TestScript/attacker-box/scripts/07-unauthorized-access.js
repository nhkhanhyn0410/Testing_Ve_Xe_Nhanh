/**
 * Kịch bản 7: Truy cập trái phép vào trang Operator, Trip Manager, Admin
 *
 * Mục tiêu:
 * - Customer truy cập API Operator → phải bị chặn
 * - Customer truy cập API Admin → phải bị chặn
 * - Operator truy cập API Admin → phải bị chặn
 * - Không có token truy cập API bảo vệ → phải bị chặn
 */
const axios = require('axios');
const config = require('./config');
const { saveResult, printHeader } = require('./utils');

const ATTACK_NAME = 'UNAUTHORIZED_ACCESS';

// Các endpoint cần bảo vệ theo role
const PROTECTED_ENDPOINTS = [
  // Admin endpoints
  { path: '/admin/users', method: 'GET', requiredRole: 'admin', description: 'Danh sách người dùng' },
  { path: '/admin/operators', method: 'GET', requiredRole: 'admin', description: 'Quản lý nhà xe' },
  { path: '/admin/complaints', method: 'GET', requiredRole: 'admin', description: 'Quản lý khiếu nại' },
  // Operator endpoints
  { path: '/operator/routes', method: 'GET', requiredRole: 'operator', description: 'Quản lý tuyến đường' },
  { path: '/operator/buses', method: 'GET', requiredRole: 'operator', description: 'Quản lý xe' },
  { path: '/operator/employees', method: 'GET', requiredRole: 'operator', description: 'Quản lý nhân viên' },
  { path: '/operator/trips', method: 'GET', requiredRole: 'operator', description: 'Quản lý chuyến' },
  { path: '/operator/vouchers', method: 'GET', requiredRole: 'operator', description: 'Quản lý voucher' },
  { path: '/operator/reports/revenue', method: 'GET', requiredRole: 'operator', description: 'Báo cáo doanh thu' },
  // Trip Manager endpoints
  { path: '/trip-manager/trips', method: 'GET', requiredRole: 'trip_manager', description: 'Danh sách chuyến TM' },
];

const loginAs = async (role) => {
  const target = config.target;
  let loginData;

  if (role === 'customer') {
    loginData = { identifier: config.accounts.customer.identifier, password: config.accounts.customer.password };
  } else if (role === 'operator') {
    loginData = { identifier: config.accounts.operator.identifier, password: config.accounts.operator.password };
  } else if (role === 'admin') {
    loginData = { identifier: config.accounts.admin.identifier, password: config.accounts.admin.password };
  } else if (role === 'trip_manager') {
    loginData = { employeeCode: config.accounts.tripManager.employeeCode, password: config.accounts.tripManager.password };
  }

  try {
    const endpoint = role === 'trip_manager'
      ? `${target.api}/trip-manager/auth/login`
      : `${target.api}/auth/login`;

    const res = await axios.post(endpoint, loginData);
    return res.data.data?.accessToken || res.data.accessToken;
  } catch (err) {
    console.log(`  [!] Đăng nhập ${role} thất bại: ${err.response?.status || err.message}`);
    return null;
  }
};

const testAccess = async (token, endpoint, attackerRole) => {
  const target = config.target;
  const url = `${target.api}${endpoint.path}`;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const res = await axios({ method: endpoint.method, url, headers, timeout: 15000 });
    return { status: res.status, result: 'BYPASSED', attackerRole };
  } catch (err) {
    const status = err.response?.status || 'ERROR';
    const isBlocked = [401, 403].includes(status);
    return { status, result: isBlocked ? 'BLOCKED' : 'ERROR', attackerRole };
  }
};

const runUnauthorizedAccess = async () => {
  const target = config.target;
  printHeader(ATTACK_NAME, target.name);

  const results = {
    target: target.name,
    tests: [],
    startTime: new Date().toISOString(),
  };

  // Lấy token cho từng role
  console.log('  [*] Đăng nhập các role...');
  const tokens = {
    customer: await loginAs('customer'),
    operator: await loginAs('operator'),
    admin: await loginAs('admin'),
    none: null,
  };
  console.log('');

  // Test 1: Không có token → truy cập tất cả endpoint
  console.log('  === Test 1: Không có token (Anonymous) ===\n');
  for (const ep of PROTECTED_ENDPOINTS) {
    const res = await testAccess(null, ep, 'anonymous');
    results.tests.push({ ...res, endpoint: ep.path, requiredRole: ep.requiredRole, description: ep.description });
    const icon = res.result === 'BLOCKED' ? '[OK]' : '[!!]';
    console.log(`  ${icon} anonymous → ${ep.path} → ${res.status} ${res.result}`);
  }

  // Test 2: Customer → truy cập Admin + Operator endpoints
  console.log('\n  === Test 2: Customer truy cập Admin/Operator ===\n');
  for (const ep of PROTECTED_ENDPOINTS.filter(e => e.requiredRole !== 'customer')) {
    const res = await testAccess(tokens.customer, ep, 'customer');
    results.tests.push({ ...res, endpoint: ep.path, requiredRole: ep.requiredRole, description: ep.description });
    const icon = res.result === 'BLOCKED' ? '[OK]' : '[!!]';
    console.log(`  ${icon} customer → ${ep.path} → ${res.status} ${res.result}`);
  }

  // Test 3: Operator → truy cập Admin endpoints
  console.log('\n  === Test 3: Operator truy cập Admin ===\n');
  for (const ep of PROTECTED_ENDPOINTS.filter(e => e.requiredRole === 'admin')) {
    const res = await testAccess(tokens.operator, ep, 'operator');
    results.tests.push({ ...res, endpoint: ep.path, requiredRole: ep.requiredRole, description: ep.description });
    const icon = res.result === 'BLOCKED' ? '[OK]' : '[!!]';
    console.log(`  ${icon} operator → ${ep.path} → ${res.status} ${res.result}`);
  }

  results.endTime = new Date().toISOString();

  // Summary
  const bypassed = results.tests.filter(t => t.result === 'BYPASSED').length;
  const blocked = results.tests.filter(t => t.result === 'BLOCKED').length;
  const errors = results.tests.filter(t => t.result === 'ERROR').length;

  console.log('\n  ' + '='.repeat(50));
  console.log(`  TỔNG KẾT: ${blocked} BLOCKED | ${bypassed} BYPASSED | ${errors} ERROR`);
  console.log('  ' + '='.repeat(50));

  if (bypassed > 0) {
    console.log('\n  [!!!] CÁC ENDPOINT BỊ BYPASS:');
    results.tests.filter(t => t.result === 'BYPASSED').forEach(t => {
      console.log(`    - ${t.attackerRole} → ${t.endpoint} (cần role: ${t.requiredRole})`);
    });
  }

  saveResult(ATTACK_NAME, target.name, results);
};

const main = async () => {
  console.log('\n*** UNAUTHORIZED ACCESS TEST ***\n');
  await runUnauthorizedAccess();
};

main().catch(console.error);
