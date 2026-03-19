/**
 * ============================================================================
 * 1.1.4. KỊCH BẢN KIỂM THỬ HIỆU NĂNG TRA CỨU VÉ
 * ============================================================================
 * Mục tiêu: Đánh giá hiệu năng luồng tra cứu vé khách vãng lai (Guest).
 *           Bao gồm: yêu cầu OTP → xác thực OTP (demo: 123456) → xem vé.
 *
 * API được test:
 *   POST /api/v1/tickets/lookup/request-otp
 *   POST /api/v1/tickets/lookup/verify-otp
 *   GET  /api/v1/tickets/customer/my-tickets (authenticated)
 *
 * Chạy:
 *   k6 run -e PROFILE=smoke  scripts/04_ticket_lookup.js
 *   k6 run -e PROFILE=load   scripts/04_ticket_lookup.js
 *   k6 run -e PROFILE=stress scripts/04_ticket_lookup.js
 * ============================================================================
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';
import {
  BASE_URL, HEADERS, TEST_USERS, DEFAULT_THRESHOLDS,
  getProfile, authHeaders,
} from '../helpers/config.js';

// ==================== CUSTOM METRICS ====================
const requestOtpDuration = new Trend('request_otp_duration', true);
const verifyOtpDuration = new Trend('verify_otp_duration', true);
const myTicketsDuration = new Trend('my_tickets_duration', true);
const lookupSuccessRate = new Rate('lookup_success_rate');
const totalLookups = new Counter('total_lookups');

// ==================== CẤU HÌNH K6 ====================
export const options = {
  stages: getProfile().stages,
  thresholds: {
    ...DEFAULT_THRESHOLDS,
    request_otp_duration: ['p(95)<3000'],     // Gửi OTP < 3s
    verify_otp_duration: ['p(95)<2000'],      // Xác thực OTP < 2s
    my_tickets_duration: ['p(95)<2000'],      // Lấy danh sách vé < 2s
    lookup_success_rate: ['rate>0.90'],       // 90% tra cứu thành công
  },
};

// ==================== TEST PHONES ====================
const testPhones = ['0912345678', '0923456789', '0934567890', '0945678901'];

// ==================== KỊCH BẢN CHÍNH ====================
export default function () {

  // ===== LUỒNG 1: Guest tra cứu vé qua OTP =====
  group('Guest - Tra cứu vé qua OTP', () => {
    const phone = testPhones[Math.floor(Math.random() * testPhones.length)];
    totalLookups.add(1);

    // Bước 1: Yêu cầu OTP
    const otpRes = http.post(`${BASE_URL}/tickets/lookup/request-otp`,
      JSON.stringify({ phone }),
      { headers: HEADERS, tags: { name: 'POST /tickets/lookup/request-otp' } }
    );

    requestOtpDuration.add(otpRes.timings.duration);

    const otpSent = check(otpRes, {
      'request OTP status 200': (r) => r.status === 200,
      'request OTP < 3s': (r) => r.timings.duration < 3000,
    });

    if (!otpSent) return;

    sleep(1); // Mô phỏng thời gian user nhập OTP

    // Bước 2: Xác thực OTP (demo: 123456)
    const verifyRes = http.post(`${BASE_URL}/tickets/lookup/verify-otp`,
      JSON.stringify({ phone, otp: '123456' }),
      { headers: HEADERS, tags: { name: 'POST /tickets/lookup/verify-otp' } }
    );

    verifyOtpDuration.add(verifyRes.timings.duration);

    const success = check(verifyRes, {
      'verify OTP status 200': (r) => r.status === 200,
      'verify OTP có dữ liệu vé': (r) => {
        const body = r.json();
        return body && (body.data || body.tickets);
      },
      'verify OTP < 2s': (r) => r.timings.duration < 2000,
    });

    lookupSuccessRate.add(success);
  });

  sleep(1);

  // ===== LUỒNG 2: Customer xem danh sách vé =====
  group('Customer - Xem danh sách vé của tôi', () => {
    // Đăng nhập
    const loginRes = http.post(`${BASE_URL}/auth/login`,
      JSON.stringify(TEST_USERS.customer),
      { headers: HEADERS, tags: { name: 'POST /auth/login' } }
    );

    if (loginRes.status !== 200) return;
    const body = loginRes.json();
    const token = body.token || body.accessToken || (body.data && (body.data.token || body.data.accessToken));
    if (!token) return;

    // Lấy danh sách vé
    const ticketsRes = http.get(`${BASE_URL}/tickets/customer/my-tickets?page=1&limit=10`, {
      headers: authHeaders(token),
      tags: { name: 'GET /tickets/customer/my-tickets' },
    });

    myTicketsDuration.add(ticketsRes.timings.duration);

    check(ticketsRes, {
      'my-tickets status 200': (r) => r.status === 200,
      'my-tickets < 2s': (r) => r.timings.duration < 2000,
    });
  });

  sleep(Math.random() * 2 + 1);
}

// ==================== BÁO CÁO ====================
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export function handleSummary(data) {
  console.log('\n========== KẾT QUẢ KIỂM THỬ TRA CỨU VÉ ==========');
  console.log(`Tổng lần tra cứu: ${data.metrics.total_lookups ? data.metrics.total_lookups.values.count : 0}`);
  console.log(`Thời gian gửi OTP p(95): ${data.metrics.request_otp_duration ? data.metrics.request_otp_duration.values['p(95)'].toFixed(0) : 'N/A'} ms`);
  console.log(`Thời gian xác thực OTP p(95): ${data.metrics.verify_otp_duration ? data.metrics.verify_otp_duration.values['p(95)'].toFixed(0) : 'N/A'} ms`);
  console.log(`Tỉ lệ thành công: ${data.metrics.lookup_success_rate ? (data.metrics.lookup_success_rate.values.rate * 100).toFixed(1) : 0}%`);
  console.log('====================================================\n');

  return { 'stdout': textSummary(data, { indent: ' ', enableColors: true }) };
}
