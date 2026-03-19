const users = require("../../data/users.json");
const dataGenerator = require("../../helpers/dataGenerator");

Feature("Operator Authentication - Đăng ký/Đăng nhập nhà xe");

Before(({ I }) => {
  I.amOnPage("/");
  I.waitForElement("body", 30);
  I.clearCookie();
});

Scenario(
  "TC_OP_AUTH_001: Hiển thị form đăng nhập nhà xe",
  ({ I, operatorLoginPage }) => {
    operatorLoginPage.open();
    I.seeInCurrentUrl("/operator/login");
    I.waitForElement("#operator-login_email", 30);
    I.waitForElement("#operator-login_password", 30);
    I.waitForElement('button[type="submit"]', 30);
    I.seeElement("#operator-login_email");
    I.seeElement("#operator-login_password");
    I.seeElement('button[type="submit"]');
    I.saveScreenshot("TC_OP_AUTH_001_login_form.png");
  },
);

Scenario(
  "TC_OP_AUTH_002: Đăng nhập nhà xe thành công",
  ({ I, operatorLoginPage }) => {
    const operator = users.operator.valid;

    operatorLoginPage.open();
    operatorLoginPage.login(operator.email, operator.password);
    I.wait(10);
    I.seeInCurrentUrl("/operator");
    I.saveScreenshot("TC_OP_AUTH_002_login_success.png");
  },
);

Scenario(
  "TC_OP_AUTH_003: Đăng nhập nhà xe với thông tin sai",
  ({ I, operatorLoginPage }) => {
    operatorLoginPage.open();
    operatorLoginPage.login("fake@gmail.com", "wrong");
    I.wait(3);
    I.saveScreenshot("TC_OP_AUTH_003_login_fail.png");
  },
);

Scenario(
  "TC_OP_AUTH_004: Đăng nhập nhà xe với trường trống",
  ({ I, operatorLoginPage }) => {
    operatorLoginPage.open();
    operatorLoginPage.clickSubmit();
    I.wait(2);
    I.saveScreenshot("TC_OP_AUTH_004_empty_fields.png");
  },
);

Scenario(
  "TC_OP_AUTH_005: Hiển thị form đăng ký nhà xe",
  ({ I, operatorRegisterPage }) => {
    operatorRegisterPage.open();
    I.seeInCurrentUrl("/operator/register");
    operatorRegisterPage.seeRegisterForm();
    I.saveScreenshot("TC_OP_AUTH_005_register_form.png");
  },
);

Scenario(
  "TC_OP_AUTH_006: Đăng ký nhà xe với thông tin hợp lệ",
  ({ I, operatorRegisterPage }) => {
    const ts = Date.now();
    operatorRegisterPage.open();
    operatorRegisterPage.register(
      `Nha Xe Test ${ts}`,
      `operator.${ts}@mailinator.com`,
      `09${String(ts).slice(-8)}`,
      `${ts}`.slice(-9),
      `03${String(ts).slice(-8)}`,
      "Operator@123",
    );
    I.wait(5);
    I.saveScreenshot("TC_OP_AUTH_006_register_success.png");
  },
);

Scenario(
  "TC_OP_AUTH_007: Đăng ký nhà xe với email đã tồn tại",
  ({ I, operatorRegisterPage }) => {
    const existing = users.operator.valid;
    const user = dataGenerator.generateUser();
    const suffix = Date.now();

    operatorRegisterPage.open();
    operatorRegisterPage.register(
      "Nhà Xe Duplicate",
      existing.email,
      user.phone,
      `GPKD-DUP-${suffix}`,
      `MST-DUP-${suffix}`,
      user.password,
    );
    I.wait(3);
    I.saveScreenshot("TC_OP_AUTH_007_duplicate_email.png");
  },
);
