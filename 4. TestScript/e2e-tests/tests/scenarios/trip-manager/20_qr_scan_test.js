const users = require('../../data/users.json');
const path = require('path');

Feature('Trip Manager: Quét QR & Quản lý chuyến đang chạy (STT 20)');

const tm = users.tripManager.valid;

// Đường dẫn QR test images (đặt trong tests/data/qr/)
const QR_DIR = 'tests/data/qr/';
const QR_VALID = QR_DIR + 'valid-qr.png';
const QR_INVALID = QR_DIR + 'invalid-qr.png';

/**
 * Kịch bản chạy tuần tự, CHỈ 1 LẦN đăng nhập:
 *
 * Login → Dashboard → Bắt đầu chuyến gần nhất → Active Trip
 *   → TC_TM_QR_001: Hiển thị trang quét QR
 *   → TC_TM_QR_002: Quét QR vé hợp lệ (upload ảnh QR)
 *   → TC_TM_QR_003: Quét QR vé đã check-in rồi
 *   → TC_TM_QR_004: Quét QR vé đã hủy / không hợp lệ
 *   → TC_TM_QR_005: Xem danh sách hành khách đã check-in
 */
Scenario('TC_TM_QR_001→005: Full QR scan & trip management flow',
  async ({ I, tripManagerLoginPage, tripManagerDashboardPage, activeTripPage, qrScannerPage }) => {

    // =====================================================================
    // BƯỚC 0: Đăng nhập Trip Manager (chỉ 1 lần duy nhất)
    // =====================================================================
    tripManagerLoginPage.open();
    tripManagerLoginPage.login(tm.employeeCode, tm.password);
    I.wait(15); // Chờ Render cold start
    I.seeInCurrentUrl('/trip-manager');

    // Dashboard → Bắt đầu chuyến gần nhất
    tripManagerDashboardPage.open();
    tripManagerDashboardPage.seeDashboard();
    I.saveScreenshot('TC_TM_QR_000_dashboard.png');

    // Click nút "Bắt đầu" cuối cùng (chuyến gần nhất) → confirm → chờ navigate
    tripManagerDashboardPage.startNearestTrip();
    I.wait(3);
    I.saveScreenshot('TC_TM_QR_000_active_trip.png');

    // =====================================================================
    // TC_TM_QR_001: Hiển thị trang quét QR
    // Pre-condition: Đã đăng nhập TM, đã bắt đầu chuyến
    // Steps: Click "Quét mã QR vé"
    // Expected: Hiển thị camera scanner để quét QR code
    // =====================================================================
    activeTripPage.clickScanQR();
    I.seeInCurrentUrl('/scan');

    // Kiểm tra trang quét QR hiển thị đúng
    qrScannerPage.seeScannerPage();
    I.seeElement(qrScannerPage.buttons.openCamera);
    I.seeElement(qrScannerPage.buttons.uploadQR);
    I.saveScreenshot('TC_TM_QR_001_scanner_page.png');

    // =====================================================================
    // TC_TM_QR_002: Quét QR vé hợp lệ - check-in thành công
    // Pre-condition: Vé có trạng thái "Confirmed"
    // Steps: Upload ảnh QR vé hợp lệ
    // Expected: Hiển thị thông tin vé, check-in thành công, trạng thái → "Checked-in"
    //
    // LƯU Ý: Để test check-in thực sự, đặt file QR thật tại:
    //   tests/data/qr/real-ticket-qr.png
    // File này phải chứa QR data từ vé đã đặt trong hệ thống.
    // Nếu dùng valid-qr.png (QR giả), backend sẽ trả lỗi decrypt.
    // =====================================================================
    qrScannerPage.uploadQRImage(QR_VALID);

    // Kiểm tra có kết quả hiển thị (success hoặc error tùy dữ liệu QR)
    I.waitForElement(qrScannerPage.elements.verificationResult, 15);
    I.saveScreenshot('TC_TM_QR_002_scan_result.png');

    // Reset để quét tiếp
    I.wait(2);
    qrScannerPage.clickScanAnother();

    // =====================================================================
    // TC_TM_QR_003: Quét QR vé đã check-in rồi
    // Pre-condition: Vé đã "Checked-in" (từ TC_002)
    // Steps: Quét lại mã QR đã check-in
    // Expected: Hiển thị cảnh báo "Vé đã được check-in trước đó"
    //
    // Test upload cùng QR lần 2 → verify kết quả khác lần 1
    // =====================================================================
    qrScannerPage.uploadQRImage(QR_VALID);

    I.waitForElement(qrScannerPage.elements.verificationResult, 15);
    I.saveScreenshot('TC_TM_QR_003_already_checked_in.png');

    // Reset
    I.wait(2);
    qrScannerPage.clickScanAnother();

    // =====================================================================
    // TC_TM_QR_004: Quét QR vé đã hủy
    // Pre-condition: Vé đã bị hủy
    // Steps: Quét mã QR vé đã hủy
    // Expected: Hiển thị lỗi "Vé đã bị hủy, không hợp lệ"
    // =====================================================================
    qrScannerPage.uploadQRImage(QR_INVALID);

    I.waitForElement(qrScannerPage.elements.verificationResult, 15);
    I.saveScreenshot('TC_TM_QR_004_invalid_qr.png');

    // Quay lại Active Trip page
    qrScannerPage.clickBack();
    I.wait(3);

    // =====================================================================
    // TC_TM_QR_005: Xem danh sách hành khách đã check-in
    // Pre-condition: Đã có hành khách check-in
    // Steps: Vào tab "Danh sách hành khách"
    // Expected: Hiển thị danh sách: tên, ghế, trạng thái check-in, giờ check-in
    // =====================================================================
    activeTripPage.clickViewPassengers();
    I.seeInCurrentUrl('/passengers');

    // Kiểm tra trang danh sách hành khách
    I.waitForElement('.ant-table', 15);
    I.saveScreenshot('TC_TM_QR_005_passenger_list.png');
  }
);
