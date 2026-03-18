const { I } = inject();

module.exports = {
  fields: {
    email: "#admin-login_email",
    password: "#admin-login_password",
  },

  buttons: {
    submit: 'button[type="submit"]',
    homeLink: '//a[contains(@href,"/")]',
  },

  messages: {
    errorToast: ".ant-message-error, .ant-message-notice-content",
    successToast: ".ant-message-success, .ant-message-notice-content",
    validation: ".ant-form-item-explain-error",
  },

  open() {
    I.amOnPage("/admin/login");
    I.waitForElement(this.fields.email, 30);
    I.waitForElement(this.fields.password, 30);
  },

  fillEmail(email) {
    I.click(this.fields.email);
    I.clearField(this.fields.email);
    I.fillField(this.fields.email, email);
  },

  fillPassword(password) {
    I.click(this.fields.password);
    I.clearField(this.fields.password);
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

  seeLoginForm() {
    I.seeElement(this.fields.email);
    I.seeElement(this.fields.password);
    I.seeElement(this.buttons.submit);
  },

  seeLoginError(message) {
    I.wait(3);
    I.seeElement(this.messages.errorToast);
    if (message) {
      I.see(message);
    }
  },

  seeValidationErrors() {
    I.wait(1);
    I.seeElement(this.messages.validation);
  },
};
