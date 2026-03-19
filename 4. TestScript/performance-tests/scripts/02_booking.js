/**
 * ============================================================================
 * 1.1.2. KỊCH BẢN KIỂM THỬ HIỆU NĂNG ĐẶT VÉ XE
 * ============================================================================
 * Mục tiêu: Đánh giá hiệu năng luồng đặt vé hoàn chỉnh dưới tải cao.
 *           Bao gồm: đăng nhập → tìm chuyến → giữ ghế → xác nhận.
 *
 * API được test:
 *   POST /api/v1/auth/login
 *   GET  /api/v1/trips/search
 *   GET  /api/v1/bookings/trips/:tripId/available-seats
 *   POST /api/v1/bookings/hold-seats
 *   POST /api/v1/bookings/:bookingId/release  (cleanup)
 *
 * Chạy:
 *   k6 run -e PROFILE=smoke  scripts/02_booking.js
 *   k6 run -e PROFILE=load   scripts/02_booking.js
 *   k6 run -e PROFILE=stress scripts/02_booking.js
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
const loginDuration = new Trend('login_duration', true);
const seatCheckDuration = new Trend('seat_check_duration', true);
const holdSeatDuration = new Trend('hold_seat_duration', true);
const bookingSuccessRate = new Rate('booking_success_rate');
const totalBookings = new Counter('total_booking_attempts');

// ==================== CẤU HÌNH K6 ====================
export const options = {
  stages: getProfile().stages,
  thresholds: {
    ...DEFAULT_THRESHOLDS,
    login_duration: ['p(95)<3000'],           // Đăng nhập < 3s
    seat_check_duration: ['p(95)<2000'],      // Kiểm tra ghế < 2s
    hold_seat_duration: ['p(95)<3000'],       // Giữ ghế < 3s
    booking_success_rate: ['rate>0.80'],      // 80% đặt vé thành công
  },
};

// ==================== KỊCH BẢN CHÍNH ====================
export default function () {
  let token = null;
  let tripId = null;
  let bookingId = null;

  // --- Bước 1: Đăng nhập ---
  group('Đăng nhập Customer', () => {
    const res = http.post(`${BASE_URL}/auth/login`,
      JSON.stringify(TEST_USERS.customer),
      { headers: HEADERS, tags: { name: 'POST /auth/login' } }
    );

    loginDuration.add(res.timings.duration);

    check(res, {
      'login status 200': (r) => r.status === 200,
      'có access token': (r) => {
        const body = r.json();
        return body && (body.token || body.accessToken || (body.data && body.data.token));
      },
    });

    if (res.status === 200) {
      const body = res.json();
      token = body.token || body.accessToken || (body.data && body.data.token) || (body.data && body.data.accessToken);
    }
  });

  if (!token) { sleep(2); return; }

  // --- Bước 2: Tìm chuyến xe ---
  group('Tìm chuyến xe', () => {
    const route = ROUTES.hcmVungTau;
    const date = futureDate(3);
    const url = `${BASE_URL}/trips/search?origin=${encodeURIComponent(route.origin)}&destination=${encodeURIComponent(route.destination)}&date=${date}`;

    const res = http.get(url, {
      headers: authHeaders(token),
      tags: { name: 'GET /trips/search' },
    });

    if (res.status === 200) {
      const body = res.json();
      const trips = body.data || body.trips || [];
      if (trips.length > 0) {
        tripId = trips[0]._id || trips[0].id;
      }
    }
  });

  if (!tripId) { sleep(2); return; }

  // --- Bước 3: Kiểm tra ghế trống ---
  let availableSeats = [];
  group('Kiểm tra ghế trống', () => {
    const res = http.get(`${BASE_URL}/bookings/trips/${tripId}/available-seats`, {
      headers: authHeaders(token),
      tags: { name: 'GET /bookings/trips/:tripId/available-seats' },
    });

    seatCheckDuration.add(res.timings.duration);

    check(res, {
      'seat check status 200': (r) => r.status === 200,
    });

    if (res.status === 200) {
      const body = res.json();
      availableSeats = body.data || body.seats || body.availableSeats || [];
    }
  });

  if (availableSeats.length === 0) { sleep(2); return; }

  // --- Bước 4: Giữ ghế (hold seats) ---
  group('Giữ ghế đặt vé', () => {
    totalBookings.add(1);

    // Chọn ngẫu nhiên 1 ghế
    const seatIndex = Math.floor(Math.random() * availableSeats.length);
    const seat = availableSeats[seatIndex];
    const seatCode = seat.seatNumber || seat.code || seat;

    const payload = JSON.stringify({
      tripId: tripId,
      seats: [seatCode],
      contactInfo: {
        fullName: `K6 Perf User ${__VU}`,
        phone: '0901234567',
        email: 'perftest@test.com',
      },
      pickupPoint: { name: 'Bến xe Miền Đông', address: '292 Đinh Bộ Lĩnh' },
      dropoffPoint: { name: 'Bến xe Vũng Tàu', address: '192 Nam Kỳ Khởi Nghĩa' },
    });

    const res = http.post(`${BASE_URL}/bookings/hold-seats`, payload, {
      headers: authHeaders(token),
      tags: { name: 'POST /bookings/hold-seats' },
    });

    holdSeatDuration.add(res.timings.duration);

    const success = check(res, {
      'hold seats status 200/201': (r) => r.status === 200 || r.status === 201,
      'hold seats response < 3s': (r) => r.timings.duration < 3000,
    });

    bookingSuccessRate.add(success);

    // Lưu bookingId để cleanup
    if (res.status === 200 || res.status === 201) {
      const body = res.json();
      bookingId = body.bookingId || (body.data && body.data.bookingId) || (body.data && body.data._id);
    }
  });

  // --- Bước 5: Cleanup - giải phóng ghế ---
  if (bookingId) {
    group('Giải phóng ghế (cleanup)', () => {
      http.post(`${BASE_URL}/bookings/${bookingId}/release`, null, {
        headers: authHeaders(token),
        tags: { name: 'POST /bookings/:id/release' },
      });
    });
  }

  sleep(Math.random() * 2 + 1);
}

// ==================== BÁO CÁO ====================
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export function handleSummary(data) {
  console.log('\n========== KẾT QUẢ KIỂM THỬ ĐẶT VÉ XE ==========');
  console.log(`Tổng lần đặt vé: ${data.metrics.total_booking_attempts ? data.metrics.total_booking_attempts.values.count : 0}`);
  console.log(`Thời gian giữ ghế p(95): ${data.metrics.hold_seat_duration ? data.metrics.hold_seat_duration.values['p(95)'].toFixed(0) : 'N/A'} ms`);
  console.log(`Tỉ lệ đặt vé thành công: ${data.metrics.booking_success_rate ? (data.metrics.booking_success_rate.values.rate * 100).toFixed(1) : 0}%`);
  console.log('====================================================\n');

  return { 'stdout': textSummary(data, { indent: ' ', enableColors: true }) };
}
