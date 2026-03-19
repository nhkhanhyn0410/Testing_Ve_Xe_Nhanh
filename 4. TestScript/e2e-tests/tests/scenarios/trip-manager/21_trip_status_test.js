const users = require('../../data/users.json');

Feature('Trip Manager: Cập nhật trạng thái chuyến - bắt đầu/hoàn thành (STT 21)');

const tm = users.tripManager.valid;

/**
 * Kịch bản chạy tuần tự, CHỈ 1 LẦN đăng nhập:
 *
 * Login → Dashboard (TC_TM_STATUS_001)
 *   → Bắt đầu chuyến gần nhất (TC_TM_STATUS_002)
 *   → Hoàn thành chuyến (TC_TM_STATUS_003)
 *   → Đăng xuất (TC_TM_STATUS_004)
 */
Scenario('TC_TM_STATUS_001→004: Cập nhật trạng thái chuyến xe',
  async ({ I, tripManagerLoginPage, tripManagerDashboardPage, activeTripPage }) => {

    // =====================================================================
    // BƯỚC 0: Đăng nhập Trip Manager (1 lần duy nhất)
    // =====================================================================
    tripManagerLoginPage.open();
    tripManagerLoginPage.login(tm.employeeCode, tm.password);
    I.wait(15); // Chờ Render cold start

    // =====================================================================
    // TC_TM_STATUS_001: Hiển thị danh sách chuyến được phân công
    // Steps: Đăng nhập Trip Manager → Xem dashboard
    // Expected: Hiển thị chuyến được phân công: tuyến, ngày giờ, trạng thái
    // =====================================================================
    tripManagerDashboardPage.open();
    tripManagerDashboardPage.seeDashboard();
    tripManagerDashboardPage.seeGreeting();

    // Kiểm tra bảng chuyến xe có dữ liệu
    I.seeElement(tripManagerDashboardPage.elements.tripsTable);
    I.seeElement(tripManagerDashboardPage.elements.tableRow);

    // Kiểm tra thống kê hiển thị
    tripManagerDashboardPage.seeStatistics();
    I.saveScreenshot('TC_TM_STATUS_001_dashboard_trips.png');

    // =====================================================================
    // TC_TM_STATUS_002: Bắt đầu chuyến (Scheduled → In Progress)
    // Pre-condition: Chuyến đang "Scheduled"
    // Steps: Click "Bắt đầu chuyến" → Xác nhận
    // Expected: Trạng thái chuyển đổi thành "In Progress"
    // =====================================================================

    // Click nút "Bắt đầu" chuyến gần nhất → confirm modal → navigate active-trip
    tripManagerDashboardPage.startNearestTrip();

    // Kiểm tra đang ở trang Active Trip
    I.seeInCurrentUrl('/trip-manager/active-trip');
    activeTripPage.seeActiveTripPage();

    // Kiểm tra trạng thái hiển thị "Đang diễn ra"
    I.see('Đang diễn ra');
    I.saveScreenshot('TC_TM_STATUS_002_trip_started.png');

    // =====================================================================
    // TC_TM_STATUS_003: Hoàn thành chuyến (In Progress → Completed)
    // Pre-condition: Chuyến đang "In Progress"
    // Steps: Click "Hoàn thành chuyến" → Xác nhận
    // Expected: Trạng thái chuyển đổi thành "Completed"
    // =====================================================================

    // Click nút "Hoàn thành chuyến"
    activeTripPage.clickCompleteTrip();

    // Modal xác nhận với title "Hoàn thành chuyến xe"
    I.waitForText('Hoàn thành chuyến xe', 10);
    I.saveScreenshot('TC_TM_STATUS_003_confirm_modal.png');

    // Click "Xác nhận hoàn thành" (okText trong modal)
    I.click('//div[contains(@class,"ant-modal")]//button[contains(.,"Xác nhận hoàn thành")]');

    // Chờ API + navigate về dashboard (Render có thể chậm)
    I.waitInUrl('/trip-manager/dashboard', 30);
    I.wait(3);

    // Kiểm tra về dashboard, chuyến đã hoàn thành
    tripManagerDashboardPage.seeDashboard();
    I.saveScreenshot('TC_TM_STATUS_003_trip_completed.png');

    // =====================================================================
    // TC_TM_STATUS_004: Đăng xuất khỏi Trip Manager
    // Steps: Click "Đăng xuất"
    // Expected: Đăng xuất thành công, chuyển về trang đăng nhập TM
    // =====================================================================
    tripManagerDashboardPage.clickLogout();
    I.waitInUrl('/trip-manager/login', 10);
    I.saveScreenshot('TC_TM_STATUS_004_logout.png');
  }
);
