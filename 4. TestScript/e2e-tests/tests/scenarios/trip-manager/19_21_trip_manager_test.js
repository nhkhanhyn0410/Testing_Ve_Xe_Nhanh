const users = require('../../data/users.json');

Feature('Trip Manager - Đăng nhập & Dashboard');

Before(({ I }) => {
  I.amOnPage('/');
  I.waitForElement('body', 30);
  I.clearCookie();
});

// --- LOGIN ---

Scenario('TC_TM_001: Hiển thị form đăng nhập Trip Manager', ({ I, tripManagerLoginPage }) => {
  tripManagerLoginPage.open();
  tripManagerLoginPage.seeLoginForm();
  I.saveScreenshot('TC_TM_001_login_form.png');
});

Scenario('TC_TM_002: Đăng nhập Trip Manager thành công', ({ I, tripManagerLoginPage }) => {
  const tm = users.tripManager.valid;
  tripManagerLoginPage.open();
  tripManagerLoginPage.login(tm.employeeCode, tm.password);
  I.wait(15);
  I.seeInCurrentUrl('/trip-manager');
  I.saveScreenshot('TC_TM_002_login_success.png');
});

Scenario('TC_TM_003: Đăng nhập Trip Manager với mã nhân viên sai', ({ I, tripManagerLoginPage }) => {
  const invalid = users.tripManager.invalid;
  tripManagerLoginPage.open();
  tripManagerLoginPage.login(invalid.employeeCode, invalid.password);
  I.wait(3);
  I.saveScreenshot('TC_TM_003_login_fail.png');
});

Scenario('TC_TM_004: Đăng nhập Trip Manager với trường trống', ({ I, tripManagerLoginPage }) => {
  tripManagerLoginPage.open();
  tripManagerLoginPage.clickSubmit();
  I.wait(2);
  I.saveScreenshot('TC_TM_004_empty_fields.png');
});

// --- DASHBOARD ---

Scenario('TC_TM_005: Hiển thị Dashboard sau đăng nhập', ({ I, tripManagerLoginPage, tripManagerDashboardPage }) => {
  const tm = users.tripManager.valid;
  tripManagerLoginPage.open();
  tripManagerLoginPage.login(tm.employeeCode, tm.password);
  I.wait(5);

  tripManagerDashboardPage.seeDashboard();
  tripManagerDashboardPage.seeGreeting();
  tripManagerDashboardPage.seeStatistics();
  I.saveScreenshot('TC_TM_005_dashboard.png');
});

Scenario('TC_TM_006: Đăng xuất khỏi Trip Manager', ({ I, tripManagerLoginPage, tripManagerDashboardPage }) => {
  const tm = users.tripManager.valid;
  tripManagerLoginPage.open();
  tripManagerLoginPage.login(tm.employeeCode, tm.password);
  I.wait(5);

  tripManagerDashboardPage.clickLogout();
  I.wait(3);
  I.seeInCurrentUrl('/trip-manager/login');
  I.saveScreenshot('TC_TM_006_logout.png');
});
