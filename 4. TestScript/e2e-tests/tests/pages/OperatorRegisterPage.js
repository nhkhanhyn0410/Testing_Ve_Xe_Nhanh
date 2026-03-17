const { I } = inject();

module.exports = {

  fields: {
    companyName: '//form[@name="operator-register"]//input[@id="operator-register_companyName"]',
    email: '//form[@name="operator-register"]//input[@id="operator-register_email"]',
    phone: '//form[@name="operator-register"]//input[@id="operator-register_phone"]',
    businessLicense: '//form[@name="operator-register"]//input[@id="operator-register_businessLicense"]',
    taxCode: '//form[@name="operator-register"]//input[@id="operator-register_taxCode"]',
    password: '//form[@name="operator-register"]//input[@id="operator-register_password"]',
    confirmPassword: '//form[@name="operator-register"]//input[@id="operator-register_confirmPassword"]',
  },

  buttons: {
    submit: '//form[@name="operator-register"]//button[@type="submit"]',
    loginLink: '//a[contains(@href,"/operator/login")]',
  },

  messages: {
    error: '.ant-message-error',
    success: '.ant-message-success',
  },

  open() {
    I.amOnPage('/operator/register');
    I.waitForElement(this.fields.companyName, 30);
  },

  fillCompanyName(name) {
    I.fillField(this.fields.companyName, name);
  },

  fillEmail(email) {
    I.fillField(this.fields.email, email);
  },

  fillPhone(phone) {
    I.fillField(this.fields.phone, phone);
  },

  fillBusinessLicense(license) {
    I.fillField(this.fields.businessLicense, license);
  },

  fillTaxCode(taxCode) {
    I.fillField(this.fields.taxCode, taxCode);
  },

  fillPassword(password) {
    I.fillField(this.fields.password, password);
  },

  fillConfirmPassword(password) {
    I.fillField(this.fields.confirmPassword, password);
  },

  clickSubmit() {
    I.click(this.buttons.submit);
  },

  register(companyName, email, phone, businessLicense, taxCode, password) {
    this.fillCompanyName(companyName);
    this.fillEmail(email);
    this.fillPhone(phone);
    this.fillBusinessLicense(businessLicense);
    this.fillTaxCode(taxCode);
    this.fillPassword(password);
    this.fillConfirmPassword(password);
    this.clickSubmit();
  },

  seeRegisterForm() {
    I.seeElement(this.fields.companyName);
    I.seeElement(this.fields.email);
    I.seeElement(this.fields.password);
  },

  seeRegisterSuccess() {
    I.wait(3);
    I.seeInCurrentUrl('/operator/login');
  },

  seeRegisterError(message) {
    I.wait(3);
    if (message) {
      I.see(message);
    }
  },
};
