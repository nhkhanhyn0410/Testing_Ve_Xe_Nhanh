/**
 * Kịch bản 5: Tấn công DDoS / Flood Request
 *
 * Mục tiêu: Gửi hàng loạt request trong thời gian ngắn
 * để kiểm tra cơ chế Rate Limiting
 */
const axios = require('axios');
const config = require('./config');
const { saveResult, printHeader, printComparison } = require('./utils');

const ATTACK_NAME = 'DDOS_FLOOD';
const TOTAL_REQUESTS = 200;
const CONCURRENCY = 20; // Số request song song

const runFloodAttack = async (target) => {
  printHeader(ATTACK_NAME, target.name);

  const results = {
    target: target.name,
    totalRequests: TOTAL_REQUESTS,
    concurrency: CONCURRENCY,
    successCount: 0,
    rateLimitedCount: 0,
    errorCount: 0,
    responseTimes: [],
    startTime: new Date().toISOString(),
  };

  console.log(`  Gửi ${TOTAL_REQUESTS} requests (${CONCURRENCY} song song)...\n`);
  const startTime = Date.now();

  // Gửi request theo batch
  for (let batch = 0; batch < TOTAL_REQUESTS; batch += CONCURRENCY) {
    const batchSize = Math.min(CONCURRENCY, TOTAL_REQUESTS - batch);
    const promises = [];

    for (let i = 0; i < batchSize; i++) {
      const reqStart = Date.now();
      const promise = axios.get(`${target.api}`, { timeout: 10000 })
        .then(res => {
          const elapsed = Date.now() - reqStart;
          results.successCount++;
          results.responseTimes.push(elapsed);
          return { status: res.status, elapsed };
        })
        .catch(err => {
          const elapsed = Date.now() - reqStart;
          const status = err.response?.status || 0;
          results.responseTimes.push(elapsed);
          if (status === 429) {
            results.rateLimitedCount++;
          } else {
            results.errorCount++;
          }
          return { status, elapsed };
        });

      promises.push(promise);
    }

    await Promise.all(promises);

    // Progress
    const done = batch + batchSize;
    const pct = Math.round((done / TOTAL_REQUESTS) * 100);
    process.stdout.write(`\r  Progress: ${done}/${TOTAL_REQUESTS} (${pct}%) | OK: ${results.successCount} | Rate Limited: ${results.rateLimitedCount} | Error: ${results.errorCount}`);
  }

  const totalTime = Date.now() - startTime;
  results.endTime = new Date().toISOString();
  results.totalTimeMs = totalTime;
  results.avgResponseTime = Math.round(results.responseTimes.reduce((a, b) => a + b, 0) / results.responseTimes.length);
  results.reqPerSecond = Math.round((TOTAL_REQUESTS / totalTime) * 1000);

  console.log(`\n\n  Tổng thời gian: ${totalTime}ms`);
  console.log(`  Throughput: ${results.reqPerSecond} req/s`);
  console.log(`  Avg response: ${results.avgResponseTime}ms`);

  saveResult(ATTACK_NAME, target.name, results);

  return {
    'Total Requests': TOTAL_REQUESTS,
    'Success (2xx)': results.successCount,
    'Rate Limited (429)': results.rateLimitedCount,
    'Errors': results.errorCount,
    'Avg Response (ms)': results.avgResponseTime,
    'Throughput (req/s)': results.reqPerSecond,
  };
};

const main = async () => {
  console.log('\n*** DDOS / FLOOD REQUEST ATTACK ***\n');

  const insecureResult = await runFloodAttack(config.insecure);
  const secureResult = await runFloodAttack(config.secure);

  printComparison(ATTACK_NAME, insecureResult, secureResult);
};

main().catch(console.error);
