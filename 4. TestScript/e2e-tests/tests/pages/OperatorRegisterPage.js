const { I } = inject();

module.exports = {
  fields: {
    companyName: "#operator-register_companyName",
    email: "#operator-register_email",
    phone: "#operator-register_phone",
    businessLicense: "#operator-register_businessLicense",
    taxCode: "#operator-register_taxCode",
    password: "#operator-register_password",
    confirmPassword: "#operator-register_confirmPassword",
  },

  buttons: {
    submit: 'button[type="submit"]',
    loginLink: '//a[contains(@href,"/operator/login")]',
  },

  messages: {
    error: ".ant-message-error",
    success: ".ant-message-success",
  },

  open() {
    I.amOnPage("/operator/register");
    I.waitInUrl("/operator/register", 30);
    I.waitForElement(this.fields.companyName, 30);
    I.waitForElement(this.fields.email, 30);
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
    I.waitForElement(this.fields.companyName, 30);
    I.waitForElement(this.fields.email, 30);
    I.waitForElement(this.fields.password, 30);
    I.waitForElement(this.buttons.submit, 30);
    I.seeElement(this.fields.companyName);
    I.seeElement(this.fields.email);
    I.seeElement(this.fields.password);
    I.seeElement(this.buttons.submit);
  },

  seeRegisterSuccess() {
    I.wait(3);
    I.seeInCurrentUrl("/operator/login");
  },

  seeRegisterError(message) {
    I.wait(3);
    if (message) {
      I.see(message);
    }
  },
};
