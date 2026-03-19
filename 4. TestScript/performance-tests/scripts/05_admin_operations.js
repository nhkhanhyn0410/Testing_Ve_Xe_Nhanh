/**
 * ============================================================================
 * 1.1.5. KỊCH BẢN KIỂM THỬ HIỆU NĂNG QUẢN TRỊ VÀ VẬN HÀNH
 * ============================================================================
 * Mục tiêu: Đánh giá hiệu năng các API quản trị (Admin, Operator, Trip Manager)
 *           khi nhiều nhân viên truy cập đồng thời.
 *
 * API được test:
 *   -- Admin --
 *   POST /api/v1/admin/login  (dùng auth/login với role admin)
 *   GET  /api/v1/admin/operators
 *   GET  /api/v1/admin/users
 *   GET  /api/v1/admin/complaints
 *   GET  /api/v1/admin/reports/overview
 *
 *   -- Operator --
 *   POST /api/v1/operators/login
 *   GET  /api/v1/operators/dashboard/stats
 *   GET  /api/v1/operators/routes
 *   GET  /api/v1/operators/buses
 *   GET  /api/v1/operators/trips
 *   GET  /api/v1/operators/bookings
 *   GET  /api/v1/operators/vouchers
 *   GET  /api/v1/operators/reports/revenue
 *
 *   -- Trip Manager --
 *   POST /api/v1/trip-manager/login
 *   GET  /api/v1/trip-manager/trips
 *
 * Chạy:
 *   k6 run -e PROFILE=smoke  scripts/05_admin_operations.js
 *   k6 run -e PROFILE=load   scripts/05_admin_operations.js
 * ============================================================================
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import {
  BASE_URL, HEADERS, TEST_USERS, DEFAULT_THRESHOLDS,
  getProfile, authHeaders,
} from '../helpers/config.js';

// ==================== CUSTOM METRICS ====================
// Admin
const adminDashboardDuration = new Trend('admin_dashboard_duration', true);
const adminOperatorsDuration = new Trend('admin_operators_list_duration', true);
const adminUsersDuration = new Trend('admin_users_list_duration', true);
const adminComplaintsDuration = new Trend('admin_complaints_list_duration', true);

// Operator
const opDashboardDuration = new Trend('op_dashboard_duration', true);
const opRoutesDuration = new Trend('op_routes_list_duration', true);
const opBusesDuration = new Trend('op_buses_list_duration', true);
const opTripsDuration = new Trend('op_trips_list_duration', true);
const opRevenueDuration = new Trend('op_revenue_report_duration', true);

// Trip Manager
const tmTripsDuration = new Trend('tm_trips_list_duration', true);

// General
const adminSuccessRate = new Rate('admin_api_success_rate');

// ==================== CẤU HÌNH K6 ====================
export const options = {
  stages: getProfile().stages,
  thresholds: {
    ...DEFAULT_THRESHOLDS,
    admin_dashboard_duration: ['p(95)<3000'],
    admin_operators_list_duration: ['p(95)<2000'],
    admin_users_list_duration: ['p(95)<2000'],
    op_dashboard_duration: ['p(95)<3000'],
    op_routes_list_duration: ['p(95)<2000'],
    op_revenue_report_duration: ['p(95)<5000'],
    admin_api_success_rate: ['rate>0.90'],
  },
};

// ==================== HELPER: Login + trả về token ====================
function login(endpoint, credentials) {
  const res = http.post(`${BASE_URL}${endpoint}`,
    JSON.stringify(credentials),
    { headers: HEADERS }
  );
  if (res.status === 200) {
    const body = res.json();
    return body.token || body.accessToken
      || (body.data && (body.data.token || body.data.accessToken));
  }
  return null;
}

// ==================== HELPER: GET + đo metric ====================
function timedGet(url, headers, metricTrend, tags) {
  const res = http.get(url, { headers, tags });
  metricTrend.add(res.timings.duration);
  const ok = check(res, { [`${tags.name} status 200`]: (r) => r.status === 200 });
  adminSuccessRate.add(ok);
  return res;
}

// ==================== KỊCH BẢN CHÍNH ====================
export default function () {
  const scenario = Math.floor(Math.random() * 3); // 0: Admin, 1: Operator, 2: TM

  // ===== ADMIN =====
  if (scenario === 0) {
    group('Admin Dashboard', () => {
      const token = login('/auth/login', TEST_USERS.admin);
      if (!token) return;
      const hdrs = authHeaders(token);

      timedGet(`${BASE_URL}/admin/reports/overview`, hdrs,
        adminDashboardDuration, { name: 'GET /admin/reports/overview' });

      timedGet(`${BASE_URL}/admin/operators?page=1&limit=10`, hdrs,
        adminOperatorsDuration, { name: 'GET /admin/operators' });

      timedGet(`${BASE_URL}/admin/users?page=1&limit=10`, hdrs,
        adminUsersDuration, { name: 'GET /admin/users' });

      timedGet(`${BASE_URL}/admin/complaints?page=1&limit=10`, hdrs,
        adminComplaintsDuration, { name: 'GET /admin/complaints' });
    });
  }

  // ===== OPERATOR =====
  if (scenario === 1) {
    group('Operator Dashboard', () => {
      const token = login('/operators/login', TEST_USERS.operator);
      if (!token) return;
      const hdrs = authHeaders(token);

      timedGet(`${BASE_URL}/operators/dashboard/stats`, hdrs,
        opDashboardDuration, { name: 'GET /operators/dashboard/stats' });

      timedGet(`${BASE_URL}/operators/routes?page=1&limit=10`, hdrs,
        opRoutesDuration, { name: 'GET /operators/routes' });

      timedGet(`${BASE_URL}/operators/buses?page=1&limit=10`, hdrs,
        opBusesDuration, { name: 'GET /operators/buses' });

      timedGet(`${BASE_URL}/operators/trips?page=1&limit=10`, hdrs,
        opTripsDuration, { name: 'GET /operators/trips' });

      timedGet(`${BASE_URL}/operators/reports/revenue`, hdrs,
        opRevenueDuration, { name: 'GET /operators/reports/revenue' });
    });
  }

  // ===== TRIP MANAGER =====
  if (scenario === 2) {
    group('Trip Manager Dashboard', () => {
      const token = login('/trip-manager/login', {
        username: TEST_USERS.tripManager.username,
        password: TEST_USERS.tripManager.password,
      });
      if (!token) return;
      const hdrs = authHeaders(token);

      timedGet(`${BASE_URL}/trip-manager/trips`, hdrs,
        tmTripsDuration, { name: 'GET /trip-manager/trips' });
    });
  }

  sleep(Math.random() * 2 + 1);
}

// ==================== BÁO CÁO ====================
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export function handleSummary(data) {
  const m = (name) => data.metrics[name] ? data.metrics[name].values['p(95)'].toFixed(0) : 'N/A';

  console.log('\n========== KẾT QUẢ KIỂM THỬ QUẢN TRỊ & VẬN HÀNH ==========');
  console.log(`[Admin]    Overview p(95): ${m('admin_dashboard_duration')} ms`);
  console.log(`[Admin]    DS Nhà xe p(95): ${m('admin_operators_list_duration')} ms`);
  console.log(`[Admin]    DS Users  p(95): ${m('admin_users_list_duration')} ms`);
  console.log(`[Admin]    DS Khiếu nại p(95): ${m('admin_complaints_list_duration')} ms`);
  console.log(`[Operator] Dashboard p(95): ${m('op_dashboard_duration')} ms`);
  console.log(`[Operator] Routes    p(95): ${m('op_routes_list_duration')} ms`);
  console.log(`[Operator] Revenue   p(95): ${m('op_revenue_report_duration')} ms`);
  console.log(`[TM]       Trips     p(95): ${m('tm_trips_list_duration')} ms`);
  console.log(`Tỉ lệ thành công: ${data.metrics.admin_api_success_rate ? (data.metrics.admin_api_success_rate.values.rate * 100).toFixed(1) : 0}%`);
  console.log('==============================================================\n');

  return { 'stdout': textSummary(data, { indent: ' ', enableColors: true }) };
}
