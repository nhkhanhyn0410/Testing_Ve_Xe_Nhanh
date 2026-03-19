const users = require('../../data/users.json');

Feature('Trip Manager: Cập nhật trạng thái chuyến - bắt đầu/hoàn thành (STT 21)');

const tm = users.tripManager.valid;

Scenario('TC_TM_STATUS_001→004: Cập nhật trạng thái chuyến xe',
  async ({ I, tripManagerLoginPage, tripManagerDashboardPage, activeTripPage }) => {

    tripManagerLoginPage.open();
    tripManagerLoginPage.login(tm.employeeCode, tm.password);
    I.wait(15);
    tripManagerDashboardPage.open();
    tripManagerDashboardPage.seeDashboard();
    tripManagerDashboardPage.seeGreeting();
    I.seeElement(tripManagerDashboardPage.elements.tripsTable);
    I.seeElement(tripManagerDashboardPage.elements.tableRow);
    tripManagerDashboardPage.seeStatistics();
    I.saveScreenshot('TC_TM_STATUS_001_dashboard_trips.png');
    tripManagerDashboardPage.startNearestTrip();
    I.seeInCurrentUrl('/trip-manager/active-trip');
    activeTripPage.seeActiveTripPage();
    I.see('Đang diễn ra');
    I.saveScreenshot('TC_TM_STATUS_002_trip_started.png');
    activeTripPage.clickCompleteTrip();
    I.waitForText('Hoàn thành chuyến xe', 10);
    I.saveScreenshot('TC_TM_STATUS_003_confirm_modal.png');
    I.click('//div[contains(@class,"ant-modal")]//button[contains(.,"Xác nhận hoàn thành")]');
    I.waitInUrl('/trip-manager/dashboard', 30);
    I.wait(3);
    tripManagerDashboardPage.seeDashboard();
    I.saveScreenshot('TC_TM_STATUS_003_trip_completed.png');
    tripManagerDashboardPage.clickLogout();
    I.waitInUrl('/trip-manager/login', 10);
    I.saveScreenshot('TC_TM_STATUS_004_logout.png');
  }
);
