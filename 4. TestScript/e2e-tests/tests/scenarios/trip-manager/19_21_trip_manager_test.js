const users = require("../../data/users.json");

Feature("Trip Manager Authentication - Đăng nhập");

Before(({ I }) => {
  I.amOnPage("/");
  I.waitForElement("body", 30);
  I.clearCookie();
});

Scenario(
  "TC_TM_AUTH_001: Hiển thị form đăng nhập Trip Manager",
  ({ I, tripManagerLoginPage }) => {
    tripManagerLoginPage.open();
    tripManagerLoginPage.seeLoginForm();
    I.see("Mã nhân viên");
    I.see("Mật khẩu");
    I.saveScreenshot("TC_TM_AUTH_001_login_form.png");
  },
);

Scenario(
  "TC_TM_AUTH_002: Đăng nhập TM thành công",
  ({ I, tripManagerLoginPage }) => {
    const tm = users.tripManager.valid;

    tripManagerLoginPage.open();
    tripManagerLoginPage.login(tm.employeeCode, tm.password);
    I.wait(5);
    I.seeInCurrentUrl("/trip-manager");
    I.saveScreenshot("TC_TM_AUTH_002_login_success.png");
  },
);

Scenario(
  "TC_TM_AUTH_003: Đăng nhập TM với mã NV sai",
  ({ I, tripManagerLoginPage }) => {
    const invalidEmployeeCode = users.tripManager.invalid.employeeCode;
    const validPassword = users.tripManager.valid.password;

    tripManagerLoginPage.open();
    tripManagerLoginPage.login(invalidEmployeeCode, validPassword);
    I.wait(3);
    tripManagerLoginPage.seeLoginError();
    I.saveScreenshot("TC_TM_AUTH_003_invalid_employee_code.png");
  },
);

Scenario(
  "TC_TM_AUTH_004: Đăng nhập TM với mật khẩu sai",
  ({ I, tripManagerLoginPage }) => {
    const validEmployeeCode = users.tripManager.valid.employeeCode;

    tripManagerLoginPage.open();
    tripManagerLoginPage.login(validEmployeeCode, "wrongpass");
    I.wait(3);
    tripManagerLoginPage.seeLoginError("Mã nhân viên hoặc mật khẩu không đúng");
    I.saveScreenshot("TC_TM_AUTH_004_wrong_password.png");
  },
);

Scenario(
  "TC_TM_AUTH_005: Đăng nhập TM với trường trống",
  ({ I, tripManagerLoginPage }) => {
    tripManagerLoginPage.open();
    tripManagerLoginPage.clickSubmit();
    I.wait(2);
    I.saveScreenshot("TC_TM_AUTH_005_empty_fields.png");
  },
);
