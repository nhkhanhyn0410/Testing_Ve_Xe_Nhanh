/**
 * Kịch bản 4: Tấn công XSS (Cross-Site Scripting)
 *
 * Mục tiêu: Chèn mã JavaScript độc hại vào các input
 * để kiểm tra cơ chế sanitize đầu vào
 */
const axios = require('axios');
const config = require('./config');
const { saveResult, printHeader } = require('./utils');

const ATTACK_NAME = 'XSS_ATTACK';

const xssPayloads = [
  { name: 'Basic script tag', value: '<script>alert("XSS")</script>' },
  { name: 'Event handler (onerror)', value: '<img src=x onerror=alert("XSS")>' },
  { name: 'Iframe injection', value: '<iframe src="javascript:alert(\'XSS\')">' },
  { name: 'SVG onload', value: '<svg onload=alert("XSS")>' },
  { name: 'Body onload', value: '<body onload=alert("XSS")>' },
  { name: 'Input onfocus', value: '<input onfocus=alert("XSS") autofocus>' },
  { name: 'Encoded script', value: '&#60;script&#62;alert("XSS")&#60;/script&#62;' },
];

const main = async () => {
  const target = config.target;
  printHeader(ATTACK_NAME, target.name);

  // Đăng nhập để lấy token
  let token = null;
  try {
    const loginRes = await axios.post(`${target.api}/auth/login`, {
      identifier: config.accounts.customer.identifier,
      password: config.accounts.customer.password,
    });
    token = loginRes.data.data?.accessToken || loginRes.data.accessToken;
    console.log('  [*] Đăng nhập: OK\n');
  } catch (err) {
    console.log('  [!] Đăng nhập thất bại\n');
    return;
  }

  const results = {
    target: target.name,
    tests: [],
    startTime: new Date().toISOString(),
  };

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  for (let i = 0; i < xssPayloads.length; i++) {
    const payload = xssPayloads[i];
    console.log(`  --- Test ${i + 1}: ${payload.name} ---`);
    console.log(`  Payload: ${payload.value}`);

    try {
      const res = await axios.put(`${target.api}/users/profile`, {
        fullName: payload.value,
      }, { headers });

      const returnedName = res.data.data?.user?.fullName || res.data.data?.fullName || '';
      const isSanitized = returnedName !== payload.value;

      results.tests.push({ name: payload.name, payload: payload.value, status: res.status, returnedValue: returnedName, result: isSanitized ? 'SANITIZED' : 'STORED_RAW' });
      console.log(`  → ${res.status} ${isSanitized ? 'SANITIZED' : 'STORED RAW !!!'}`);
      console.log(`  → Stored as: "${returnedName}"\n`);
    } catch (err) {
      const status = err.response?.status || 'ERROR';
      const message = err.response?.data?.message || err.message;
      results.tests.push({ name: payload.name, payload: payload.value, status, result: status === 400 ? 'REJECTED' : 'ERROR', message });
      console.log(`  → ${status} ${status === 400 ? 'REJECTED' : 'ERROR'} (${message})\n`);
    }
  }

  results.endTime = new Date().toISOString();
  saveResult(ATTACK_NAME, target.name, results);

  const rejected = results.tests.filter(t => t.result === 'REJECTED').length;
  const sanitized = results.tests.filter(t => t.result === 'SANITIZED').length;
  const storedRaw = results.tests.filter(t => t.result === 'STORED_RAW').length;
  console.log('\n  ' + '='.repeat(50));
  console.log(`  TỔNG KẾT: ${rejected} REJECTED | ${sanitized} SANITIZED | ${storedRaw} STORED RAW`);
  console.log('  ' + '='.repeat(50));
};

main().catch(console.error);
