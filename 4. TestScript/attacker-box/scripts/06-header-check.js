/**
 * Kịch bản 6: Kiểm tra Security Headers + Data Exposure
 *
 * Mục tiêu:
 * - Kiểm tra HTTP response headers bảo mật (Helmet.js)
 * - Kiểm tra xem response có lộ thông tin nhạy cảm không
 */
const axios = require('axios');
const config = require('./config');
const { saveResult, printHeader } = require('./utils');

const ATTACK_NAME = 'SECURITY_HEADERS';

const SECURITY_HEADERS = [
  { header: 'x-content-type-options', expected: 'nosniff', description: 'Chống MIME sniffing' },
  { header: 'x-frame-options', expected: 'DENY', description: 'Chống clickjacking' },
  { header: 'x-xss-protection', expected: '1; mode=block', description: 'XSS filter' },
  { header: 'strict-transport-security', expected: null, description: 'HSTS (HTTPS)' },
  { header: 'content-security-policy', expected: null, description: 'CSP' },
  { header: 'x-powered-by', expected: null, description: 'Tiết lộ công nghệ (nên ẩn)' },
  { header: 'x-download-options', expected: 'noopen', description: 'Chống download tự động' },
  { header: 'x-dns-prefetch-control', expected: 'off', description: 'DNS prefetch control' },
];

const main = async () => {
  const target = config.target;
  printHeader(ATTACK_NAME, target.name);

  const results = {
    target: target.name,
    headers: [],
    dataExposure: [],
    startTime: new Date().toISOString(),
  };

  // Part 1: Security Headers
  console.log('  === PHẦN 1: SECURITY HEADERS ===\n');
  try {
    const res = await axios.get(`${target.base}/health`);
    let presentCount = 0;
    let missingCount = 0;

    for (const check of SECURITY_HEADERS) {
      const value = res.headers[check.header];
      const isPresent = !!value;

      if (check.header === 'x-powered-by') {
        const isGood = !isPresent;
        results.headers.push({ header: check.header, value: value || '(hidden)', secure: isGood, description: check.description });
        console.log(`  ${isGood ? '[OK]' : '[!!]'} ${check.header.padEnd(30)} : ${isPresent ? value + ' (EXPOSED!)' : '(hidden)'}`);
        if (isGood) presentCount++; else missingCount++;
      } else {
        results.headers.push({ header: check.header, value: value || '(missing)', secure: isPresent, description: check.description });
        console.log(`  ${isPresent ? '[OK]' : '[!!]'} ${check.header.padEnd(30)} : ${value || '(MISSING!)'}`);
        if (isPresent) presentCount++; else missingCount++;
      }
    }

    results.headerScore = `${presentCount}/${SECURITY_HEADERS.length}`;
    console.log(`\n  Score: ${results.headerScore}`);
  } catch (err) {
    console.log(`  Error: ${err.message}`);
  }

  // Part 2: Data Exposure - kiểm tra response có lộ sensitive data không
  console.log('\n\n  === PHẦN 2: DATA EXPOSURE CHECK ===\n');
  try {
    const loginRes = await axios.post(`${target.api}/auth/login`, {
      identifier: config.accounts.customer.identifier,
      password: config.accounts.customer.password,
    });

    const responseData = JSON.stringify(loginRes.data);
    const sensitiveFields = ['password', 'passwordHash', 'secret', 'jwt_secret', 'creditCard', 'ssn'];
    for (const field of sensitiveFields) {
      const found = responseData.toLowerCase().includes(field.toLowerCase());
      results.dataExposure.push({ field, exposed: found });
      console.log(`  ${found ? '[!!]' : '[OK]'} Login response chứa "${field}": ${found ? 'CÓ - LỘ THÔNG TIN!' : 'Không'}`);
    }

    // Kiểm tra user profile response
    const token = loginRes.data.data?.accessToken || loginRes.data.accessToken;
    if (token) {
      const profileRes = await axios.get(`${target.api}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = JSON.stringify(profileRes.data);
      for (const field of sensitiveFields) {
        const found = profileData.toLowerCase().includes(field.toLowerCase());
        results.dataExposure.push({ field: `profile_${field}`, exposed: found });
        if (found) console.log(`  [!!] Profile response chứa "${field}": CÓ - LỘ THÔNG TIN!`);
      }
    }
  } catch (err) {
    console.log(`  Error: ${err.response?.status || err.message}`);
  }

  results.endTime = new Date().toISOString();
  saveResult(ATTACK_NAME, target.name, results);

  const exposed = results.dataExposure.filter(d => d.exposed).length;
  console.log('\n  ' + '='.repeat(50));
  console.log(`  TỔNG KẾT: Headers ${results.headerScore || 'N/A'} | Data Exposure: ${exposed} fields lộ`);
  console.log('  ' + '='.repeat(50));
};

main().catch(console.error);
