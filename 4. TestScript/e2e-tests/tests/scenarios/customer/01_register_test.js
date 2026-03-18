const dataGenerator = require("../../helpers/dataGenerator");

Feature("Customer Registration - Đăng ký tài khoản");

Before(({ I }) => {
  I.amOnPage("/");
  I.waitForElement("body", 30);
  I.clearCookie();
});

Scenario("TC_REG_009: Hiển thị form đăng ký", ({ I, registerPage }) => {
  registerPage.open();
  registerPage.seeRegisterForm();
  I.see("Đăng Ký");
  I.saveScreenshot("TC_REG_001_register_form.png");
});

Scenario(
  "TC_REG_010: Đăng ký thành công với thông tin hợp lệ",
  ({ I, registerPage }) => {
    const user = dataGenerator.generateUser();
    registerPage.open();
    registerPage.register(user.fullName, user.email, user.phone, user.password);
    I.wait(5);
    I.saveScreenshot("TC_REG_002_register_success.png");
  },
);

Scenario("TC_REG_011: Đăng ký với email đã tồn tại", ({ I, registerPage }) => {
  const testData = require("../../data/users.json");
  const existingUser = testData.customer.valid;
  const user = dataGenerator.generateUser();

  registerPage.open();
  registerPage.register(
    user.fullName,
    existingUser.email,
    user.phone,
    user.password,
  );
  I.wait(3);
  I.saveScreenshot("TC_REG_003_duplicate_email.png");
});

Scenario(
  "TC_REG_012: Đăng ký với các trường bắt buộc để trống",
  ({ I, registerPage }) => {
    registerPage.open();
    registerPage.clickSubmit();
    I.wait(2);
    I.saveScreenshot("TC_REG_004_empty_fields.png");
  },
);

Scenario(
  "TC_REG_013: Đăng ký với email không hợp lệ",
  ({ I, registerPage }) => {
    const user = dataGenerator.generateUser();
    registerPage.open();
    registerPage.register(
      user.fullName,
      "invalid-email",
      user.phone,
      user.password,
    );
    I.wait(2);
    I.saveScreenshot("TC_REG_005_invalid_email.png");
  },
);

Scenario("TC_REG_014: Đăng ký với SĐT không hợp lệ", ({ I, registerPage }) => {
  const user = dataGenerator.generateUser();
  registerPage.open();
  registerPage.register(user.fullName, user.email, "123", user.password);
  I.wait(2);
  I.saveScreenshot("TC_REG_006_invalid_phone.png");
});

Scenario("TC_REG_015: Đăng ký với mật khẩu yếu", ({ I, registerPage }) => {
  const user = dataGenerator.generateUser();
  registerPage.open();
  registerPage.register(user.fullName, user.email, user.phone, "123");
  I.wait(2);
  I.saveScreenshot("TC_REG_007_weak_password.png");
});

Scenario(
  "TC_REG_016: Đăng ký với mật khẩu xác nhận không khớp",
  ({ I, registerPage }) => {
    const user = dataGenerator.generateUser();
    registerPage.open();
    registerPage.fillName(user.fullName);
    registerPage.fillEmail(user.email);
    registerPage.fillPhone(user.phone);
    registerPage.fillPassword(user.password);
    registerPage.fillConfirmPassword("DifferentPassword@123");
    registerPage.clickSubmit();
    I.wait(2);
    I.saveScreenshot("TC_REG_008_password_mismatch.png");
  },
);

Scenario(
  "TC_REG_017: Chuyển sang trang đăng nhập từ form đăng ký",
  ({ I, registerPage }) => {
    registerPage.open();
    registerPage.clickLoginLink();
    I.wait(3);
    I.seeInCurrentUrl("/login");
    I.saveScreenshot("TC_REG_009_navigate_login.png");
  },
);
Scenario(
  "TC_AUTH_018: Chuyển từ form đăng ký sang đăng nhập",
  ({ I, registerPage }) => {
    registerPage.open();
    registerPage.clickLoginLink();
    I.wait(5);
    I.seeInCurrentUrl("/login");
    I.see("Đăng nhập");
  },
);
