const users = require('../../data/users.json');

Feature('Admin Authentication - Đăng nhập Admin');

Before(({ I }) => {
  I.amOnPage('/');
  I.waitForElement('body', 30);
  I.clearCookie();
});

Scenario('TC_ADMIN_001: Hiển thị form đăng nhập Admin', ({ I, adminLoginPage }) => {
  adminLoginPage.open();
  adminLoginPage.seeLoginForm();
  I.saveScreenshot('TC_ADMIN_001_login_form.png');
});

Scenario('TC_ADMIN_002: Đăng nhập Admin thành công', ({ I, adminLoginPage }) => {
  const admin = users.admin.valid;
  adminLoginPage.open();
  adminLoginPage.login(admin.email, admin.password);
  I.wait(5);
  I.seeInCurrentUrl('/admin');
  I.saveScreenshot('TC_ADMIN_002_login_success.png');
});

Scenario('TC_ADMIN_003: Đăng nhập Admin với thông tin sai', ({ I, adminLoginPage }) => {
  const invalid = users.admin.invalid;
  adminLoginPage.open();
  adminLoginPage.login(invalid.email, invalid.password);
  I.wait(3);
  I.saveScreenshot('TC_ADMIN_003_login_fail.png');
});

Scenario('TC_ADMIN_004: Đăng nhập Admin với trường trống', ({ I, adminLoginPage }) => {
  adminLoginPage.open();
  adminLoginPage.clickSubmit();
  I.wait(2);
  I.saveScreenshot('TC_ADMIN_004_empty_fields.png');
});
