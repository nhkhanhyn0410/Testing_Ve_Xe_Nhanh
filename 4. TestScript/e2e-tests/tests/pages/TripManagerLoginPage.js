const { I } = inject();

module.exports = {

  fields: {
    employeeCode: '//form[@name="trip-manager-login"]//input[contains(@placeholder,"EMP")]',
    password: '//form[@name="trip-manager-login"]//input[@type="password"]',
  },

  buttons: {
    submit: '//form[@name="trip-manager-login"]//button[@type="submit"]',
    homeLink: '//a[contains(@href,"/")]',
  },

  messages: {
    error: '.ant-message-error',
    success: '.ant-message-success',
  },

  open() {
    I.amOnPage('/trip-manager/login');
    I.waitForElement(this.fields.employeeCode, 30);
  },

  fillEmployeeCode(code) {
    I.fillField(this.fields.employeeCode, code);
  },

  fillPassword(password) {
    I.fillField(this.fields.password, password);
  },

  clickSubmit() {
    I.click(this.buttons.submit);
  },

  login(employeeCode, password) {
    this.fillEmployeeCode(employeeCode);
    this.fillPassword(password);
    this.clickSubmit();
  },

  loginWithValidTripManager() {
    const user = require('../data/users.json').tripManager.valid;
    this.login(user.employeeCode, user.password);
  },

  seeLoginForm() {
    I.seeElement(this.fields.employeeCode);
    I.seeElement(this.fields.password);
    I.seeElement(this.buttons.submit);
  },

  seeLoginSuccess() {
    I.wait(5);
    I.seeInCurrentUrl('/trip-manager');
  },

  seeLoginError(message) {
    I.wait(3);
    if (message) {
      I.see(message);
    }
  },
};
