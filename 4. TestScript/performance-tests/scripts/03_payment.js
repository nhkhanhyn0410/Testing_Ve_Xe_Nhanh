/**
 * ============================================================================
 * 1.1.3. KỊCH BẢN KIỂM THỬ HIỆU NĂNG THANH TOÁN
 * ============================================================================
 * Mục tiêu: Đánh giá hiệu năng hệ thống thanh toán (tạo payment, kiểm tra
 *           trạng thái, lấy danh sách phương thức thanh toán).
 *
 * API được test:
 *   GET  /api/v1/payments/methods
 *   GET  /api/v1/payments/banks
 *   POST /api/v1/payments/create
 *   GET  /api/v1/payments/code/:paymentCode
 *   GET  /api/v1/payments/:paymentCode/status
 *
 * Chạy:
 *   k6 run -e PROFILE=smoke  scripts/03_payment.js
 *   k6 run -e PROFILE=load   scripts/03_payment.js
 *   k6 run -e PROFILE=stress scripts/03_payment.js
 * ============================================================================
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';
import {
  BASE_URL, HEADERS, TEST_USERS, ROUTES, DEFAULT_THRESHOLDS,
  getProfile, futureDate, authHeaders,
} from '../helpers/config.js';

// ==================== CUSTOM METRICS ====================
const paymentMethodsDuration = new Trend('payment_methods_duration', true);
const bankListDuration = new Trend('bank_list_duration', true);
const createPaymentDuration = new Trend('create_payment_duration', true);
const paymentStatusDuration = new Trend('payment_status_duration', true);
const paymentSuccessRate = new Rate('payment_success_rate');
const totalPayments = new Counter('total_payment_attempts');

// ==================== CẤU HÌNH K6 ====================
export const options = {
  stages: getProfile().stages,
  thresholds: {
    ...DEFAULT_THRESHOLDS,
    payment_methods_duration: ['p(95)<1000'],   // Lấy PT thanh toán < 1s
    bank_list_duration: ['p(95)<1000'],         // Lấy danh sách bank < 1s
    create_payment_duration: ['p(95)<5000'],    // Tạo thanh toán < 5s
    payment_success_rate: ['rate>0.80'],        // 80% thanh toán thành công
  },
};

// ==================== KỊCH BẢN CHÍNH ====================
export default function () {
  let token = null;

  // --- Bước 1: Đăng nhập ---
  group('Đăng nhập', () => {
    const res = http.post(`${BASE_URL}/auth/login`,
      JSON.stringify(TEST_USERS.customer),
      { headers: HEADERS, tags: { name: 'POST /auth/login' } }
    );
    if (res.status === 200) {
      const body = res.json();
      token = body.token || body.accessToken || (body.data && (body.data.token || body.data.accessToken));
    }
  });

  if (!token) { sleep(2); return; }
  const hdrs = authHeaders(token);

  // --- Bước 2: Lấy danh sách phương thức thanh toán ---
  group('Lấy phương thức thanh toán', () => {
    const res = http.get(`${BASE_URL}/payments/methods`, {
      headers: hdrs,
      tags: { name: 'GET /payments/methods' },
    });

    paymentMethodsDuration.add(res.timings.duration);

    check(res, {
      'methods status 200': (r) => r.status === 200,
      'methods response < 1s': (r) => r.timings.duration < 1000,
    });
  });

  // --- Bước 3: Lấy danh sách ngân hàng VNPay ---
  group('Lấy danh sách ngân hàng', () => {
    const res = http.get(`${BASE_URL}/payments/banks`, {
      headers: hdrs,
      tags: { name: 'GET /payments/banks' },
    });

    bankListDuration.add(res.timings.duration);

    check(res, {
      'banks status 200': (r) => r.status === 200,
      'banks response < 1s': (r) => r.timings.duration < 1000,
    });
  });

  // --- Bước 4: Tạo booking + thanh toán ---
  group('Luồng tạo thanh toán', () => {
    // Tìm chuyến
    const route = ROUTES.hcmVungTau;
    const searchRes = http.get(
      `${BASE_URL}/trips/search?origin=${encodeURIComponent(route.origin)}&destination=${encodeURIComponent(route.destination)}&date=${futureDate(3)}`,
      { headers: hdrs, tags: { name: 'GET /trips/search' } }
    );

    if (searchRes.status !== 200) return;
    const trips = searchRes.json().data || searchRes.json().trips || [];
    if (trips.length === 0) return;

    const tripId = trips[0]._id || trips[0].id;

    // Kiểm tra ghế trống
    const seatRes = http.get(`${BASE_URL}/bookings/trips/${tripId}/available-seats`, {
      headers: hdrs,
      tags: { name: 'GET /bookings/trips/:tripId/available-seats' },
    });

    if (seatRes.status !== 200) return;
    const seats = seatRes.json().data || seatRes.json().seats || seatRes.json().availableSeats || [];
    if (seats.length === 0) return;

    const seatCode = seats[0].seatNumber || seats[0].code || seats[0];

    // Giữ ghế
    const holdRes = http.post(`${BASE_URL}/bookings/hold-seats`,
      JSON.stringify({
        tripId,
        seats: [seatCode],
        contactInfo: { fullName: `K6 Payment ${__VU}`, phone: '0901234567', email: 'perf@test.com' },
        pickupPoint: { name: 'Bến xe Miền Đông', address: '292 Đinh Bộ Lĩnh' },
        dropoffPoint: { name: 'Bến xe Vũng Tàu', address: '192 Nam Kỳ Khởi Nghĩa' },
      }),
      { headers: hdrs, tags: { name: 'POST /bookings/hold-seats' } }
    );

    if (holdRes.status !== 200 && holdRes.status !== 201) return;
    const holdBody = holdRes.json();
    const bookingId = holdBody.bookingId || (holdBody.data && (holdBody.data.bookingId || holdBody.data._id));

    if (!bookingId) return;

    // Tạo payment (tiền mặt)
    totalPayments.add(1);
    const payRes = http.post(`${BASE_URL}/payments/create`,
      JSON.stringify({
        bookingId: bookingId,
        amount: trips[0].finalPrice || trips[0].basePrice || 120000,
        method: 'cash',
      }),
      { headers: hdrs, tags: { name: 'POST /payments/create' } }
    );

    createPaymentDuration.add(payRes.timings.duration);

    const success = check(payRes, {
      'payment status 200/201': (r) => r.status === 200 || r.status === 201,
      'payment response < 5s': (r) => r.timings.duration < 5000,
    });

    paymentSuccessRate.add(success);

    // Kiểm tra trạng thái payment
    if (payRes.status === 200 || payRes.status === 201) {
      const payBody = payRes.json();
      const paymentCode = payBody.paymentCode || (payBody.data && payBody.data.paymentCode);

      if (paymentCode) {
        const statusRes = http.get(`${BASE_URL}/payments/${paymentCode}/status`, {
          headers: hdrs,
          tags: { name: 'GET /payments/:code/status' },
        });

        paymentStatusDuration.add(statusRes.timings.duration);

        check(statusRes, {
          'payment status check 200': (r) => r.status === 200,
        });
      }
    }

    // Cleanup
    http.post(`${BASE_URL}/bookings/${bookingId}/release`, null, {
      headers: hdrs,
      tags: { name: 'POST /bookings/:id/release' },
    });
  });

  sleep(Math.random() * 2 + 1);
}

// ==================== BÁO CÁO ====================
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export function handleSummary(data) {
  console.log('\n========== KẾT QUẢ KIỂM THỬ THANH TOÁN ==========');
  console.log(`Tổng lần thanh toán: ${data.metrics.total_payment_attempts ? data.metrics.total_payment_attempts.values.count : 0}`);
  console.log(`Thời gian tạo payment p(95): ${data.metrics.create_payment_duration ? data.metrics.create_payment_duration.values['p(95)'].toFixed(0) : 'N/A'} ms`);
  console.log(`Tỉ lệ thành công: ${data.metrics.payment_success_rate ? (data.metrics.payment_success_rate.values.rate * 100).toFixed(1) : 0}%`);
  console.log('===================================================\n');

  return { 'stdout': textSummary(data, { indent: ' ', enableColors: true }) };
}
