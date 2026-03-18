const { I } = inject();

module.exports = {
  fields: {
    employeeCode: "#trip-manager-login_employeeCode",
    password: "#trip-manager-login_password",
  },

  buttons: {
    submit: 'button[type="submit"]',
    homeLink: '//a[contains(@href,"/")]',
  },

  messages: {
    error: ".ant-message-error, .ant-message-notice-content",
    success: ".ant-message-success, .ant-message-notice-content",
    validation: ".ant-form-item-explain-error",
  },

  open() {
    I.amOnPage("/trip-manager/login");
    I.waitForElement(this.fields.employeeCode, 30);
    I.waitForElement(this.fields.password, 30);
  },

  fillEmployeeCode(code) {
    I.click(this.fields.employeeCode);
    I.clearField(this.fields.employeeCode);
    I.fillField(this.fields.employeeCode, code);
  },

  fillPassword(password) {
    I.click(this.fields.password);
    I.clearField(this.fields.password);
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
    const user = require("../data/users.json").tripManager.valid;
    this.login(user.employeeCode, user.password);
  },

  seeLoginForm() {
    I.seeElement(this.fields.employeeCode);
    I.seeElement(this.fields.password);
    I.seeElement(this.buttons.submit);
  },

  seeLoginSuccess() {
    I.wait(5);
    I.seeInCurrentUrl("/trip-manager");
  },

  seeLoginError(message) {
    I.wait(3);
    I.seeElement(this.messages.error);
    if (message) {
      I.see(message);
    }
  },

  seeValidationErrors() {
    I.wait(1);
    I.seeElement(this.messages.validation);
  },
};
