const { I } = inject();

module.exports = {

  fields: {
    bookingId: '//input[contains(@placeholder,"mã đặt vé") or @id="bookingId"]',
    email: '//input[contains(@placeholder,"Email") or @id="email"]',
    phone: '//input[contains(@placeholder,"Số điện thoại") or @id="phone"]',
    reason: '//textarea[@id="reason" or contains(@placeholder,"lý do")]',
  },

  buttons: {
    search: '//button[contains(.,"Tiếp tục") or .//span[contains(@class,"SearchOutlined")]]',
    confirmCancel: '//button[contains(.,"Xác nhận hủy")]',
    backHome: '//button[contains(.,"Trang chủ") or contains(.,"trang chủ")]',
  },

  elements: {
    steps: '.ant-steps',
    bookingInfo: '.ant-descriptions',
    refundPolicy: '//div[contains(@class,"green") or contains(@class,"orange") or contains(@class,"red")]',
    resultSuccess: '.ant-result-success',
    resultError: '.ant-result-error',
  },

  messages: {
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open() {
    I.amOnPage('/tickets/cancel');
    I.waitForElement(this.fields.bookingId, 30);
  },

  fillBookingId(bookingId) {
    I.fillField(this.fields.bookingId, bookingId);
  },

  fillEmail(email) {
    I.fillField(this.fields.email, email);
  },

  fillPhone(phone) {
    I.fillField(this.fields.phone, phone);
  },

  fillReason(reason) {
    I.fillField(this.fields.reason, reason);
  },

  clickSearch() {
    I.click(this.buttons.search);
    I.wait(3);
  },

  clickConfirmCancel() {
    I.click(this.buttons.confirmCancel);
    I.wait(3);
  },

  cancelTicket(bookingId, email, phone, reason) {
    this.fillBookingId(bookingId);
    if (email) this.fillEmail(email);
    if (phone) this.fillPhone(phone);
    if (reason) this.fillReason(reason);
    this.clickSearch();
  },

  seeBookingInfo() {
    I.waitForElement(this.elements.bookingInfo, 15);
  },

  seeRefundPolicy() {
    I.seeElement(this.elements.refundPolicy);
  },

  seeCancelSuccess() {
    I.waitForElement(this.elements.resultSuccess, 15);
  },

  seeCancelError() {
    I.seeElement(this.elements.resultError);
  },

  seeStep(stepNumber) {
    I.seeElement(this.elements.steps);
  },
};
