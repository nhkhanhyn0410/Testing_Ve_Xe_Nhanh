const { I } = inject();

module.exports = {

  elements: {
    qrReader: '#qr-reader',
    verificationResult: '.ant-result',
    resultSuccess: '.ant-result-success',
    resultError: '.ant-result-error',
    ticketDetails: '.ant-descriptions',
    routeInfo: '//div[contains(@class,"header") or contains(.,"Tuyến")]',
  },

  buttons: {
    openCamera: '//button[contains(.,"Mở camera") or .//span[contains(@class,"CameraOutlined")]]',
    uploadQR: '//button[contains(.,"Tải ảnh") or .//span[contains(@class,"UploadOutlined")]]',
    stopScanner: '//button[contains(.,"Dừng quét")]',
    scanAnother: '//button[contains(.,"Quét vé khác")]',
    back: '//button[.//span[contains(@class,"ArrowLeftOutlined")]]',
  },

  modal: {
    paymentModal: '.ant-modal',
    confirmPayment: '.ant-modal .ant-btn-primary',
    cancelPayment: '.ant-modal .ant-btn-default',
  },

  messages: {
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open(tripId) {
    I.amOnPage(`/trip-manager/trips/${tripId}/scan`);
    I.waitForElement('body', 30);
    I.wait(3);
  },

  clickOpenCamera() {
    I.click(this.buttons.openCamera);
    I.wait(3);
  },

  clickUploadQR() {
    I.click(this.buttons.uploadQR);
    I.wait(1);
  },

  clickStopScanner() {
    I.click(this.buttons.stopScanner);
    I.wait(2);
  },

  clickScanAnother() {
    I.click(this.buttons.scanAnother);
    I.wait(2);
  },

  clickBack() {
    I.click(this.buttons.back);
    I.wait(2);
  },

  confirmCashPayment() {
    I.waitForElement(this.modal.paymentModal, 10);
    I.click(this.modal.confirmPayment);
    I.wait(3);
  },

  cancelCashPayment() {
    I.click(this.modal.cancelPayment);
    I.wait(1);
  },

  seeVerificationSuccess() {
    I.waitForElement(this.elements.resultSuccess, 15);
  },

  seeVerificationError() {
    I.waitForElement(this.elements.resultError, 15);
  },

  seeTicketDetails() {
    I.seeElement(this.elements.ticketDetails);
  },

  seeCashPaymentModal() {
    I.seeElement(this.modal.paymentModal);
  },

  seeScannerPage() {
    I.see('Quét vé QR');
  },
};
