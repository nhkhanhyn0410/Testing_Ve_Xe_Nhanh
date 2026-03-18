const users = require("../../data/users.json");

Feature("Admin Authentication - Đăng nhập Admin");

Before(({ I }) => {
  I.amOnPage("/");
  I.waitForElement("body", 30);
  I.clearCookie();
});

Scenario(
  "TC_ADM_AUTH_001: Hiển thị form đăng nhập Admin",
  ({ I, adminLoginPage }) => {
    adminLoginPage.open();
    adminLoginPage.seeLoginForm();
    I.see("Email");
    I.see("Mật khẩu");
    I.saveScreenshot("TC_ADM_AUTH_001_login_form.png");
  },
);

Scenario(
  "TC_ADM_AUTH_002: Đăng nhập Admin thành công",
  ({ I, adminLoginPage }) => {
    const admin = users.admin.valid;
    adminLoginPage.open();
    adminLoginPage.login(admin.email, admin.password);
    I.wait(5);
    I.seeInCurrentUrl("/admin");
    I.saveScreenshot("TC_ADM_AUTH_002_login_success.png");
  },
);

Scenario(
  "TC_ADM_AUTH_003: Đăng nhập Admin với thông tin sai",
  ({ I, adminLoginPage }) => {
    adminLoginPage.open();
    adminLoginPage.login("fake@gmail.com", "wrong");
    adminLoginPage.seeLoginError();
    I.seeInCurrentUrl("/admin/login");
    I.saveScreenshot("TC_ADM_AUTH_003_login_fail.png");
  },
);

Scenario(
  "TC_ADM_AUTH_004: Đăng nhập Admin với trường trống",
  ({ I, adminLoginPage }) => {
    adminLoginPage.open();
    adminLoginPage.clickSubmit();
    adminLoginPage.seeValidationErrors();
    I.seeInCurrentUrl("/admin/login");
    I.saveScreenshot("TC_ADM_AUTH_004_empty_fields.png");
  },
);

Scenario(
  "TC_ADM_AUTH_005: Truy cập Admin dashboard khi chưa đăng nhập",
  ({ I, adminLoginPage }) => {
    I.amOnPage("/admin");
    I.wait(3);
    I.seeInCurrentUrl("/admin/login");
    adminLoginPage.seeLoginForm();
    I.saveScreenshot("TC_ADM_AUTH_005_redirect_to_login.png");
  },
);
