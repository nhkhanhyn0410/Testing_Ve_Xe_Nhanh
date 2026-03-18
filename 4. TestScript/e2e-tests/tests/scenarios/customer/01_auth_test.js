Feature("Customer Authentication");

const testData = require("../../data/users.json");

Before(({ I }) => {
  I.amOnPage("/");
  I.waitForElement("body", 30);
  I.clearCookie();
});

Scenario("TC_AUTH_001: Hiển thị form đăng nhập", ({ I, loginPage }) => {
  loginPage.open();
  loginPage.seeLoginForm();
  I.see("Đăng nhập");
});

Scenario(
  "TC_AUTH_002: Đăng nhập thành công với tài khoản hợp lệ",
  ({ I, loginPage }) => {
    const user = testData.customer.valid;

    loginPage.open();
    loginPage.login(user.email, user.password);
    I.wait(10);
    I.dontSeeInCurrentUrl("/login");
    I.dontSee("Email hoặc mật khẩu không đúng");
  },
);

Scenario("TC_AUTH_003: Đăng nhập với mật khẩu sai", ({ I, loginPage }) => {
  const user = testData.customer.valid;
  const invalidUser = testData.customer.invalid;

  loginPage.open();
  loginPage.login(user.email, invalidUser.password);
  I.wait(5);
  I.seeInCurrentUrl("/login");
  I.see("Email/Số điện thoại hoặc mật khẩu không đúng");
});

Scenario(
  "TC_AUTH_004: Đăng nhập với email không tồn tại",
  ({ I, loginPage }) => {
    const invalidUser = testData.customer.invalid;

    loginPage.open();
    loginPage.login(invalidUser.email, "Test@123");
    I.wait(5);
    I.seeInCurrentUrl("/login");
    I.see("Email/Số điện thoại hoặc mật khẩu không đúng");
  },
);

Scenario("TC_AUTH_005: Đăng nhập với Email trống", ({ I, loginPage }) => {
  const user = testData.customer.valid;

  loginPage.open();
  loginPage.fillPassword(user.password);
  loginPage.clickSubmit();
  I.wait(5);
  I.seeInCurrentUrl("/login");
  I.see("Nhập email");
});

Scenario("TC_AUTH_006: Đăng nhập với Mật khẩu trống", ({ I, loginPage }) => {
  const user = testData.customer.valid;

  loginPage.open();
  loginPage.fillEmail(user.email);
  loginPage.clickSubmit();
  I.wait(5);
  I.seeInCurrentUrl("/login");
  I.see("Nhập mật khẩu");
});

Scenario("TC_AUTH_007: Đăng nhập với cả 2 trường trống", ({ I, loginPage }) => {
  loginPage.open();
  loginPage.clickSubmit();
  I.wait(5);
  I.seeInCurrentUrl("/login");
  I.see("Nhập email!");
  I.see("Nhập mật khẩu!");
});

Scenario("TC_AUTH_008: Mật khẩu được ẩn (masked)", async ({ I, loginPage }) => {
  loginPage.open();
  loginPage.fillPassword("Test@123");
  const inputType = await loginPage.grabPasswordType();
  I.assertEqual(inputType, "password");
});
