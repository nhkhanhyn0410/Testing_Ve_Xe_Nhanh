const dataGenerator = require("../../helpers/dataGenerator");
const testData = require("../../data/users.json");

Feature("Customer Registration - Đăng ký tài khoản");

const validationMessages = {
  duplicateEmail: "Email đã được sử dụng",
  invalidEmail: "Email không hợp lệ",
  invalidPhone: "Số điện thoại không hợp lệ",
  weakPassword: "Mật khẩu phải có ít nhất 6 ký tự",
  passwordMismatch: "Mật khẩu không khớp!",
  requiredName: "Nhập họ tên!",
  requiredEmail: "Nhập email!",
  requiredPhone: "Nhập SĐT!",
  requiredPassword: "Nhập mật khẩu!",
  requiredConfirmPassword: "Xác Nhận mật khẩu!",
};

Before(({ I }) => {
  I.amOnPage("/");
  I.waitForElement("body", 30);
  I.clearCookie();
});

Scenario("TC_AUTH_009: Hiển thị form đăng ký", ({ I, registerPage }) => {
  registerPage.open();
  registerPage.seeRegisterForm();
  I.see("Đăng Ký");
});

Scenario(
  "TC_AUTH_010: Đăng ký thành công với thông tin hợp lệ",
  ({ I, registerPage }) => {
    const user = dataGenerator.generateUser();

    registerPage.open();
    registerPage.register(
      user.fullName,
      user.email,
      user.phone,
      user.password,
      user.password,
    );
    I.wait(5);
    I.dontSee(validationMessages.duplicateEmail);
  },
);

Scenario("TC_AUTH_011: Đăng ký với email đã tồn tại", ({ I, registerPage }) => {
  const existingUser = testData.customer.seed;
  const user = dataGenerator.generateUser();

  registerPage.open();
  registerPage.register(
    user.fullName,
    existingUser.email,
    user.phone,
    user.password,
    user.password,
  );
  I.wait(5);
  I.see(validationMessages.duplicateEmail);
});

Scenario(
  "TC_AUTH_012: Đăng ký với email không hợp lệ",
  ({ I, registerPage }) => {
    const user = dataGenerator.generateUser();

    registerPage.open();
    registerPage.register(
      user.fullName,
      "invalid-email",
      user.phone,
      user.password,
      user.password,
    );
    I.wait(2);
    I.see(validationMessages.invalidEmail);
  },
);

Scenario(
  "TC_AUTH_013: Đăng ký với SĐT không hợp lệ (9 số)",
  ({ I, registerPage }) => {
    const user = dataGenerator.generateUser();

    registerPage.open();
    registerPage.register(
      user.fullName,
      user.email,
      "091234567",
      user.password,
      user.password,
    );
    I.wait(2);
    I.see(validationMessages.invalidPhone);
  },
);

Scenario("TC_AUTH_014: Đăng ký với mật khẩu yếu", ({ I, registerPage }) => {
  const user = dataGenerator.generateUser();

  registerPage.open();
  registerPage.register(user.fullName, user.email, user.phone, "123", "123");
  I.wait(2);
  I.see(validationMessages.weakPassword);
});

Scenario(
  "TC_AUTH_015: Đăng ký với xác nhận mật khẩu không khớp",
  ({ I, registerPage }) => {
    const user = dataGenerator.generateUser();

    registerPage.open();
    registerPage.register(
      user.fullName,
      user.email,
      user.phone,
      "Test@1234",
      "DifferentPass@123",
    );
    I.wait(2);
    I.see(validationMessages.passwordMismatch);
  },
);

Scenario(
  "TC_AUTH_016: Đăng ký với tất cả trường trống",
  ({ I, registerPage }) => {
    registerPage.open();
    registerPage.clickSubmit();
    I.wait(2);
    I.see(validationMessages.requiredName);
    I.see(validationMessages.requiredEmail);
    I.see(validationMessages.requiredPhone);
    I.see(validationMessages.requiredPassword);
    I.see(validationMessages.requiredConfirmPassword);
  },
);

Scenario(
  "TC_AUTH_017: Chuyển từ form đăng nhập sang đăng ký",
  ({ I, loginPage }) => {
    loginPage.open();
    loginPage.clickRegisterLink();
    I.wait(2);
    I.seeInCurrentUrl("/register");
    I.see("Đăng ký");
  },
);

Scenario(
  "TC_AUTH_018: Chuyển từ form đăng ký sang đăng nhập",
  ({ I, registerPage }) => {
    registerPage.open();
    registerPage.clickLoginLink();
    I.wait(2);
    I.seeInCurrentUrl("/login");
    I.see("Đăng nhập");
  },
);
