/**
 * Chạy tất cả kịch bản tấn công tuần tự
 * Target: https://ve-xe-nhanh.onrender.com
 */
const { execSync } = require('child_process');
const path = require('path');

const scripts = [
  { file: '01-brute-force.js', name: '1.1.2 Brute Force Login' },
  { file: '02-jwt-attack.js', name: '1.1.1 JWT Attack (Xác thực & Phân quyền)' },
  { file: '03-nosql-injection.js', name: '1.1.4 NoSQL Injection' },
  { file: '04-xss-attack.js', name: '1.1.4 XSS Attack' },
  { file: '06-header-check.js', name: '1.1.3 Security Headers & Data Exposure' },
  { file: '07-unauthorized-access.js', name: '1.1.5 Unauthorized Access (Role-based)' },
];

console.log('\n' + '='.repeat(60));
console.log('  SECURITY TEST - VE XE NHANH');
console.log('  Target: https://ve-xe-nhanh.onrender.com');
console.log('  Time: ' + new Date().toISOString());
console.log('='.repeat(60) + '\n');

for (let i = 0; i < scripts.length; i++) {
  const script = scripts[i];
  console.log(`\n[${i + 1}/${scripts.length}] Running: ${script.name}...`);
  console.log('-'.repeat(60));

  try {
    const scriptPath = path.join(__dirname, script.file);
    execSync(`node "${scriptPath}"`, {
      stdio: 'inherit',
      timeout: 120000,
    });
  } catch (err) {
    console.error(`\n  [ERROR] ${script.name} failed: ${err.message}`);
  }
}

console.log('\n' + '='.repeat(60));
console.log('  ALL SECURITY TESTS COMPLETED');
console.log('  Results saved to: attacker-box/results/');
console.log('='.repeat(60) + '\n');
