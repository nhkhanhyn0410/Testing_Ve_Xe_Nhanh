const users = require('../../data/users.json');
const path = require('path');

Feature('Trip Manager: Quét QR & Quản lý chuyến đang chạy (STT 20)');

const tm = users.tripManager.valid;

const QR_DIR = 'tests/data/qr/';
const QR_VALID = QR_DIR + 'valid-qr.png';
const QR_INVALID = QR_DIR + 'invalid-qr.png';

Scenario('TC_TM_QR_001→005: Full QR scan & trip management flow',
  async ({ I, tripManagerLoginPage, tripManagerDashboardPage, activeTripPage, qrScannerPage }) => {
    tripManagerLoginPage.open();
    tripManagerLoginPage.login(tm.employeeCode, tm.password);
    I.wait(15); // Chờ Render cold start
    I.seeInCurrentUrl('/trip-manager');
    tripManagerDashboardPage.open();
    tripManagerDashboardPage.seeDashboard();
    I.saveScreenshot('TC_TM_QR_000_dashboard.png');
    tripManagerDashboardPage.startNearestTrip();
    I.wait(3);
    I.saveScreenshot('TC_TM_QR_000_active_trip.png');
    activeTripPage.clickScanQR();
    I.seeInCurrentUrl('/scan');
    qrScannerPage.seeScannerPage();
    I.seeElement(qrScannerPage.buttons.openCamera);
    I.seeElement(qrScannerPage.buttons.uploadQR);
    I.saveScreenshot('TC_TM_QR_001_scanner_page.png');
    qrScannerPage.uploadQRImage(QR_VALID);
    I.waitForElement(qrScannerPage.elements.verificationResult, 15);
    I.saveScreenshot('TC_TM_QR_002_scan_result.png');
    I.wait(2);
    qrScannerPage.clickScanAnother();
    qrScannerPage.uploadQRImage(QR_VALID);
    I.waitForElement(qrScannerPage.elements.verificationResult, 15);
    I.saveScreenshot('TC_TM_QR_003_already_checked_in.png');
    I.wait(2);
    qrScannerPage.clickScanAnother();
    qrScannerPage.uploadQRImage(QR_INVALID);
    I.waitForElement(qrScannerPage.elements.verificationResult, 15);
    I.saveScreenshot('TC_TM_QR_004_invalid_qr.png');
    qrScannerPage.clickBack();
    I.wait(3);
    activeTripPage.clickViewPassengers();
    I.seeInCurrentUrl('/passengers');

    I.waitForElement('.ant-table', 15);
    I.saveScreenshot('TC_TM_QR_005_passenger_list.png');
  }
);
