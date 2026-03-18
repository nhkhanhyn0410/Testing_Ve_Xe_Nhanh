Feature('Customer Authentication');

Before(({ I }) => {
  I.amOnPage('/');
  I.waitForElement('body', 30);
  I.clearCookie();
});

Scenario('TC_AUTH_001: Open login page', ({ I, loginPage }) => {
  loginPage.open();
  loginPage.seeLoginForm();
  I.see('Đăng nhập');
});

Scenario('TC_AUTH_002: Login with valid credentials',
  ({ I, loginPage }) => {
    const testData = require('../../data/users.json');
    const user = testData.customer.valid;
    loginPage.open();
    loginPage.login(user.email, user.password);
    I.wait(5);
    // Đăng nhập thành công → chuyển về trang chủ, không còn ở /login
    I.dontSeeInCurrentUrl('/login');
    I.dontSeeElement(loginPage.messages.error);
  });

Scenario('TC_AUTH_003: Login with invalid password',
  ({ I, loginPage }) => {
    const testData = require('../../data/users.json');
    const user = testData.customer.valid;
    const invalidUser = testData.customer.invalid;
    loginPage.open();
    loginPage.login(user.email, invalidUser.password);
    I.wait(3);
    // Đăng nhập thất bại → vẫn ở trang login + hiển thị lỗi
    I.seeInCurrentUrl('/login');
    I.seeElement(loginPage.messages.error);
  });

Scenario('TC_AUTH_004: Login with empty fields',
  ({ I, loginPage }) => {
    loginPage.open();
    loginPage.clickSubmit();
    I.wait(2);
    // Không cho submit → vẫn ở trang login
    I.seeInCurrentUrl('/login');
  });

Scenario('TC_AUTH_005: Login with Invalid credentials',
  ({ I, loginPage }) => {
    const testData = require('../../data/users.json');
    const invalidUser = testData.customer.invalid;
    loginPage.open();
    loginPage.login(invalidUser.email, invalidUser.password);
    I.wait(5);
    // Đăng nhập thất bại → vẫn ở trang login + hiển thị lỗi
    I.seeInCurrentUrl('/login');
    I.seeElement(loginPage.messages.error);
  });
