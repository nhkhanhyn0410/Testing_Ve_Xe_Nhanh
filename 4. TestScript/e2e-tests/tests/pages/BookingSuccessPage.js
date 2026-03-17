const { I } = inject();

module.exports = {

  elements: {
    bookingCode: '//span[contains(@class,"monospace") or contains(@style,"monospace")]',
    qrImage: '//img[contains(@alt,"QR") or contains(@src,"qr")]',
    routeInfo: '//span[contains(@class,"EnvironmentOutlined")]/ancestor::div',
    departureTime: '//span[contains(@class,"CalendarOutlined")]/ancestor::div',
    finalPrice: '//span[contains(@style,"color") and contains(.,"đ")]',
    cashWarning: '//div[contains(@class,"yellow") or contains(@class,"warning")]',
  },

  buttons: {
    viewQR: '//button[contains(.,"QR")]',
    printTicket: '//button[contains(.,"In vé")]',
    home: '//button[contains(.,"Trang chủ")]',
    myBookings: '//button[contains(.,"đặt vé") or contains(.,"booking")]',
  },

  modal: {
    qrModal: '.ant-modal',
    qrModalImage: '.ant-modal img',
    closeModal: '.ant-modal-close',
  },

  messages: {
    success: '.ant-message-success',
  },

  waitForPageLoad() {
    I.waitForText('thành công', 30);
    I.wait(3);
  },

  seeBookingSuccess() {
    I.see('thành công');
  },

  seeBookingCode() {
    I.waitForElement(this.elements.bookingCode, 15);
  },

  seeQRCode() {
    I.waitForElement(this.elements.qrImage, 15);
  },

  clickViewQR() {
    I.click(this.buttons.viewQR);
    I.waitForElement(this.modal.qrModal, 10);
  },

  closeQRModal() {
    I.click(this.modal.closeModal);
    I.wait(1);
  },

  clickHome() {
    I.click(this.buttons.home);
  },

  clickMyBookings() {
    I.click(this.buttons.myBookings);
  },

  seeCashPaymentWarning() {
    I.seeElement(this.elements.cashWarning);
  },

  seeFinalPrice(price) {
    if (price) {
      I.see(price);
    }
  },
};
