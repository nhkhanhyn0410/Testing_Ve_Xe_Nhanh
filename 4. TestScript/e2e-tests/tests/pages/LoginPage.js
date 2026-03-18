const { I } = inject();

module.exports = {

  fields: {
    email: '#customer-login_email',
    password: '#customer-login_password'
  },

  buttons: {
    submit: 'button[type="submit"]',
    forgotPassword: '//a[contains(.,"Quên mật khẩu")]',
    register: '//a[contains(.,"Đăng ký")]'
  },

  messages: {
    error: '.ant-message-error',
    success: '.ant-message-success'
  },

  open() {
    I.amOnPage('/login');
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

  clickRegisterLink() {
    I.click(this.buttons.register);
  },

  login(email, password) {
    this.fillEmail(email);
    this.fillPassword(password);
    this.clickSubmit();
  },

  async grabPasswordType() {
    return I.grabAttributeFrom(this.fields.password, 'type');
  },

  seeLoginForm() {
    I.seeElement(this.fields.email);
    I.seeElement(this.fields.password);
    I.seeElement(this.buttons.submit);
  }
};
