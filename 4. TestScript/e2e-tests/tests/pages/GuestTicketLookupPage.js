const { I } = inject();

module.exports = {

  fields: {
    phone: '//input[contains(@placeholder,"số điện thoại") or @id="phone"]',
    email: '//input[contains(@placeholder,"email") or @id="email"]',
    otp: '//input[contains(@placeholder,"OTP") or @id="otp" or contains(@style,"letter-spacing")]',
  },

  buttons: {
    continue: 'button[type="submit"]',
    verifyOTP: 'button[type="submit"]',
    resendOTP: '//button[contains(.,"Gửi lại") or contains(.,"resend")]',
    back: '//button[contains(.,"Quay lại")]',
    viewQR: '//button[.//span[contains(@class,"QrcodeOutlined")]]',
    cancelTicket: '//button[contains(@class,"danger") or contains(.,"Hủy vé")]',
  },

  elements: {
    ticketCard: '.ant-card',
    ticketStatus: '.ant-tag',
    qrModal: '.ant-modal',
    qrImage: '.ant-modal img',
    stepIndicator: '.ant-steps',
  },

  messages: {
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open() {
    I.amOnPage('/tickets/lookup');
    I.waitForElement(this.fields.phone, 30);
  },

  seeLookupForm() {
    I.seeElement(this.fields.phone);
    I.seeElement(this.fields.email);
    I.seeElement(this.buttons.continue);
  },

  fillPhone(phone) {
    I.fillField(this.fields.phone, phone);
  },

  fillEmail(email) {
    I.fillField(this.fields.email, email);
  },

  clickContinue() {
    I.click(this.buttons.continue);
    I.wait(3);
  },

  fillOTP(otp) {
    I.waitForElement(this.fields.otp, 15);
    I.fillField(this.fields.otp, otp);
  },

  fillDemoOTP() {
    this.fillOTP('123456');
  },

  clickVerifyOTP() {
    I.click(this.buttons.verifyOTP);
    I.wait(3);
  },

  lookupWithPhone(phone) {
    this.fillPhone(phone);
    this.clickContinue();
    this.fillDemoOTP();
    this.clickVerifyOTP();
  },

  lookupWithEmail(email) {
    this.fillEmail(email);
    this.clickContinue();
    this.fillDemoOTP();
    this.clickVerifyOTP();
  },

  clickViewQR() {
    I.click(this.buttons.viewQR);
    I.waitForElement(this.elements.qrModal, 10);
  },

  clickCancelTicket() {
    I.click(this.buttons.cancelTicket);
  },

  clickResendOTP() {
    I.click(this.buttons.resendOTP);
    I.wait(3);
  },

  seeOTPStep() {
    I.seeElement(this.fields.otp);
  },

  seeTicketList() {
    I.waitForElement(this.elements.ticketCard, 15);
  },

  seeTicketStatus(status) {
    I.see(status);
  },

  seeQRModal() {
    I.seeElement(this.elements.qrImage);
  },

  seeError(message) {
    I.wait(3);
    if (message) {
      I.see(message);
    }
  },
};
