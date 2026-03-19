const { I } = inject();

module.exports = {

  fields: {
    email: '#admin-login_email',
    password: '#admin-login_password',
  },

  buttons: {
    submit: '//button[@type="submit" and (contains(.,"Đăng Nhập") or contains(.,"Đang đăng nhập"))]',
    homeLink: '//a[contains(@href,"/")]',
  },

  messages: {
    error: '.ant-message-error',
    success: '.ant-message-success',
  },

  open() {
    I.amOnPage('/admin/login');
    I.waitForElement(this.fields.email, 30);
  },

  fillEmail(email) {
    I.fillField(this.fields.email, email);
  },

  fillPassword(password) {
    I.fillField(this.fields.password, password);
  },

  clickSubmit() {
    I.click(this.buttons.submit);
  },

  login(email, password) {
    this.fillEmail(email);
    this.fillPassword(password);
    this.clickSubmit();
  },

  loginWithValidAdmin() {
    const user = require('../data/users.json').admin.valid;
    this.login(user.email, user.password);
  },

  seeLoginForm() {
    I.seeElement(this.fields.email);
    I.seeElement(this.fields.password);
    I.seeElement(this.buttons.submit);
  },

  seeLoginSuccess() {
    I.wait(5);
    I.seeInCurrentUrl('/admin');
  },

  seeLoginError(message) {
    I.wait(3);
    if (message) {
      I.see(message);
    }
  },
};
