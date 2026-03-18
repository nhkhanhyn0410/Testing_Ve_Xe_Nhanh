const users = require('../../data/users.json');
const dataGenerator = require('../../helpers/dataGenerator');

Feature('Operator Authentication - Đăng ký/Đăng nhập nhà xe');

Before(({ I }) => {
  I.amOnPage('/');
  I.waitForElement('body', 30);
  I.clearCookie();
});

// --- LOGIN ---

Scenario('TC_OP_AUTH_001: Hiển thị form đăng nhập nhà xe', ({ I, operatorLoginPage }) => {
  operatorLoginPage.open();
  operatorLoginPage.seeLoginForm();
  I.saveScreenshot('TC_OP_AUTH_001_login_form.png');
});

Scenario('TC_OP_AUTH_002: Đăng nhập nhà xe thành công', ({ I, operatorLoginPage }) => {
  const operator = users.operator.valid;
  operatorLoginPage.open();
  operatorLoginPage.login(operator.email, operator.password);
  I.wait(5);
  I.seeInCurrentUrl('/operator');
  I.saveScreenshot('TC_OP_AUTH_002_login_success.png');
});

Scenario('TC_OP_AUTH_003: Đăng nhập nhà xe với thông tin sai', ({ I, operatorLoginPage }) => {
  const invalid = users.operator.invalid;
  operatorLoginPage.open();
  operatorLoginPage.login(invalid.email, invalid.password);
  I.wait(3);
  I.saveScreenshot('TC_OP_AUTH_003_login_fail.png');
});

Scenario('TC_OP_AUTH_004: Đăng nhập nhà xe với trường trống', ({ I, operatorLoginPage }) => {
  operatorLoginPage.open();
  operatorLoginPage.clickSubmit();
  I.wait(2);
  I.saveScreenshot('TC_OP_AUTH_004_empty_fields.png');
});

// --- REGISTER ---

Scenario('TC_OP_AUTH_005: Hiển thị form đăng ký nhà xe', ({ I, operatorRegisterPage }) => {
  operatorRegisterPage.open();
  operatorRegisterPage.seeRegisterForm();
  I.saveScreenshot('TC_OP_AUTH_005_register_form.png');
});

Scenario('TC_OP_AUTH_006: Đăng ký nhà xe với thông tin hợp lệ', ({ I, operatorRegisterPage }) => {
  const user = dataGenerator.generateUser();
  operatorRegisterPage.open();
  operatorRegisterPage.register(
    'Nhà Xe Test ' + Date.now(),
    user.email,
    user.phone,
    'BL-' + Date.now(),
    'TX-' + Date.now(),
    user.password
  );
  I.wait(5);
  I.saveScreenshot('TC_OP_AUTH_006_register_success.png');
});

Scenario('TC_OP_AUTH_007: Đăng ký nhà xe với email đã tồn tại', ({ I, operatorRegisterPage }) => {
  const existing = users.operator.valid;
  const user = dataGenerator.generateUser();
  operatorRegisterPage.open();
  operatorRegisterPage.register(
    'Nhà Xe Duplicate',
    existing.email,
    user.phone,
    'BL-DUP-001',
    'TX-DUP-001',
    user.password
  );
  I.wait(3);
  I.saveScreenshot('TC_OP_AUTH_007_duplicate_email.png');
});

Scenario('TC_OP_AUTH_008: Chuyển từ trang đăng ký sang đăng nhập', ({ I, operatorRegisterPage }) => {
  operatorRegisterPage.open();
  I.click(operatorRegisterPage.buttons.loginLink);
  I.wait(3);
  I.seeInCurrentUrl('/operator/login');
  I.saveScreenshot('TC_OP_AUTH_008_navigate_login.png');
});
