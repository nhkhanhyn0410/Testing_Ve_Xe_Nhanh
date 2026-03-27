const { I } = inject();

module.exports = {

  fields: {
    name: '#customer-register_name',
    email: '#customer-register_email',
    phone: '#customer-register_phoneNumber',
    password: '#customer-register_password',
    confirmPassword: '#customer-register_confirmPassword',
  },

  buttons: {
    submit: 'button[type="submit"]',
    loginLink: '//a[contains(.,"Đăng nhập")]',
    homeLink: '//a[contains(.,"Trang chủ")]',
  },

  messages: {
    error: '.ant-message-error',
    success: '.ant-message-success',
  },

  open() {
    I.amOnPage('/register');
    I.waitForElement(this.fields.name, 30);
  },

  fillName(name) {
    I.fillField(this.fields.name, name);
  },

  fillEmail(email) {
    I.fillField(this.fields.email, email);
  },

  fillPhone(phone) {
    I.fillField(this.fields.phone, phone);
  },

  fillPassword(password) {
    I.fillField(this.fields.password, password);
  },

  fillConfirmPassword(confirmPassword) {
    I.fillField(this.fields.confirmPassword, confirmPassword);
  },

  clickSubmit() {
    I.click(this.buttons.submit);
  },

  register(name, email, phone, password, confirmPassword = password) {
    this.fillName(name);
    this.fillEmail(email);
    this.fillPhone(phone);
    this.fillPassword(password);
    this.fillConfirmPassword(confirmPassword);
    this.clickSubmit();
  },

  seeRegisterForm() {
    I.seeElement(this.fields.name);
    I.seeElement(this.fields.email);
    I.seeElement(this.fields.phone);
    I.seeElement(this.fields.password);
    I.seeElement(this.fields.confirmPassword);
  },

  clickLoginLink() {
    I.click(this.buttons.loginLink);
  },
};
