const fs = require('fs');
const path = require('path');
const config = require('./config');

/**
 * Lưu kết quả tấn công ra file JSON
 */
const saveResult = (attackName, target, result) => {
  const filename = `${attackName}_${target}_${Date.now()}.json`;
  const filepath = path.join(config.resultsDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(result, null, 2));
  console.log(`[+] Kết quả đã lưu: ${filename}`);
  return filepath;
};

/**
 * In header cho mỗi cuộc tấn công
 */
const printHeader = (attackName, targetName) => {
  console.log('\n' + '='.repeat(60));
  console.log(`  ATTACK: ${attackName}`);
  console.log(`  TARGET: ${targetName}`);
  console.log(`  TIME:   ${new Date().toISOString()}`);
  console.log('='.repeat(60) + '\n');
};

/**
 * In bảng so sánh kết quả
 */
const printComparison = (attackName, insecureResult, secureResult) => {
  console.log('\n' + '='.repeat(60));
  console.log(`  SO SÁNH: ${attackName}`);
  console.log('='.repeat(60));
  console.log(`  ${'Metric'.padEnd(30)} | ${'Insecure'.padEnd(12)} | ${'Secure'.padEnd(12)}`);
  console.log(`  ${'-'.repeat(30)} | ${'-'.repeat(12)} | ${'-'.repeat(12)}`);

  const allKeys = new Set([...Object.keys(insecureResult), ...Object.keys(secureResult)]);
  for (const key of allKeys) {
    const insVal = insecureResult[key] ?? 'N/A';
    const secVal = secureResult[key] ?? 'N/A';
    console.log(`  ${String(key).padEnd(30)} | ${String(insVal).padEnd(12)} | ${String(secVal).padEnd(12)}`);
  }
  console.log('='.repeat(60) + '\n');
};

module.exports = { saveResult, printHeader, printComparison };
