/**
 * ============================================================================
 * 1.1.1. KỊCH BẢN KIỂM THỬ HIỆU NĂNG TÌM KIẾM CHUYẾN XE
 * ============================================================================
 * Mục tiêu: Đánh giá khả năng xử lý tìm kiếm chuyến xe khi nhiều user
 *           truy cập đồng thời. Đây là chức năng được sử dụng nhiều nhất.
 *
 * API được test:
 *   GET /api/v1/trips/search?origin=...&destination=...&date=...
 *   GET /api/v1/trips/:id  (xem chi tiết chuyến)
 *
 * Chạy:
 *   k6 run -e PROFILE=smoke  scripts/01_search_trips.js   (1 user, kiểm tra cơ bản)
 *   k6 run -e PROFILE=load   scripts/01_search_trips.js   (50 users đồng thời)
 *   k6 run -e PROFILE=stress scripts/01_search_trips.js   (lên đến 200 users)
 *   k6 run -e PROFILE=spike  scripts/01_search_trips.js   (đột biến 300 users)
 * ============================================================================
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';
import {
  BASE_URL, HEADERS, ROUTES, DEFAULT_THRESHOLDS, getProfile, futureDate,
} from '../helpers/config.js';

// ==================== CUSTOM METRICS ====================
const searchDuration = new Trend('search_trip_duration', true);
const tripDetailDuration = new Trend('trip_detail_duration', true);
const searchSuccessRate = new Rate('search_success_rate');
const totalSearches = new Counter('total_searches');

// ==================== CẤU HÌNH K6 ====================
export const options = {
  stages: getProfile().stages,
  thresholds: {
    ...DEFAULT_THRESHOLDS,
    search_trip_duration: ['p(95)<1500'],     // Tìm kiếm phải < 1.5s
    trip_detail_duration: ['p(95)<1000'],     // Chi tiết chuyến phải < 1s
    search_success_rate: ['rate>0.95'],       // 95% tìm kiếm thành công
  },
};

// ==================== DANH SÁCH TUYẾN ĐỂ TEST ====================
const routes = [ROUTES.hcmVungTau, ROUTES.hcmDaLat, ROUTES.hcmNhaTrang];

// ==================== KỊCH BẢN CHÍNH ====================
export default function () {

  // Chọn ngẫu nhiên 1 tuyến đường
  const route = routes[Math.floor(Math.random() * routes.length)];
  const date = futureDate(Math.floor(Math.random() * 14) + 1);

  // --- Bước 1: Tìm kiếm chuyến xe ---
  group('Tìm kiếm chuyến xe', () => {
    const searchUrl = `${BASE_URL}/trips/search?origin=${encodeURIComponent(route.origin)}&destination=${encodeURIComponent(route.destination)}&date=${date}`;

    const res = http.get(searchUrl, { headers: HEADERS, tags: { name: 'GET /trips/search' } });

    searchDuration.add(res.timings.duration);
    totalSearches.add(1);

    const success = check(res, {
      'status 200': (r) => r.status === 200,
      'response có data': (r) => {
        const body = r.json();
        return body && (body.data !== undefined || body.trips !== undefined);
      },
      'response time < 2s': (r) => r.timings.duration < 2000,
    });

    searchSuccessRate.add(success);

    // --- Bước 2: Nếu có kết quả, xem chi tiết chuyến đầu tiên ---
    if (res.status === 200) {
      const body = res.json();
      const trips = body.data || body.trips || [];

      if (trips.length > 0) {
        const tripId = trips[0]._id || trips[0].id;

        group('Xem chi tiết chuyến xe', () => {
          const detailRes = http.get(`${BASE_URL}/trips/${tripId}`, {
            headers: HEADERS,
            tags: { name: 'GET /trips/:id' },
          });

          tripDetailDuration.add(detailRes.timings.duration);

          check(detailRes, {
            'chi tiết status 200': (r) => r.status === 200,
            'có thông tin chuyến': (r) => {
              const b = r.json();
              return b && (b.data || b.trip);
            },
            'chi tiết response < 1.5s': (r) => r.timings.duration < 1500,
          });
        });
      }
    }
  });

  sleep(Math.random() * 2 + 1); // Nghỉ 1-3 giây giữa mỗi lần lặp
}

// ==================== BÁO CÁO KẾT QUẢ ====================
export function handleSummary(data) {
  const med = data.metrics.search_trip_duration
    ? data.metrics.search_trip_duration.values['p(95)'].toFixed(0)
    : 'N/A';

  console.log('\n========== KẾT QUẢ KIỂM THỬ TÌM KIẾM CHUYẾN XE ==========');
  console.log(`Tổng số request tìm kiếm: ${data.metrics.total_searches ? data.metrics.total_searches.values.count : 0}`);
  console.log(`Thời gian tìm kiếm p(95): ${med} ms`);
  console.log(`Tỉ lệ thành công: ${data.metrics.search_success_rate ? (data.metrics.search_success_rate.values.rate * 100).toFixed(1) : 0}%`);
  console.log('=============================================================\n');

  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
  };
}

// k6 built-in text summary
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
