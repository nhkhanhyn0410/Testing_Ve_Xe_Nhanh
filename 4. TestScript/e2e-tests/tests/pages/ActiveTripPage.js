const { I } = inject();

module.exports = {

  elements: {
    routeName: '//h2 | //div[contains(@class,"route")]',
    statusBadge: '.ant-tag',
    seatMap: '//div[contains(@class,"seat")]',
    statsTotal: '//div[contains(.,"Tổng")]//span[contains(@class,"ant-statistic-content-value")]',
    statsBoarded: '//div[contains(.,"Đã lên")]//span[contains(@class,"ant-statistic-content-value")]',
    timeline: '.ant-timeline',
    progressBar: '//div[contains(@class,"progress")]',
  },

  buttons: {
    scanQR: '//button[contains(.,"Quét QR") or .//span[contains(@class,"QrcodeOutlined")]]',
    viewPassengers: '//button[contains(.,"hành khách") or .//span[contains(@class,"TeamOutlined")]]',
    completeTrip: '//button[contains(.,"Hoàn thành") or .//span[contains(@class,"CheckCircleOutlined")]]',
    cancelTrip: '//button[contains(@class,"danger") or contains(.,"Hủy chuyến")]',
    updateLocation: '//button[.//span[contains(@class,"AimOutlined")] or contains(.,"Cập nhật")]',
    logout: '//button[contains(.,"Đăng xuất")]',
  },

  modal: {
    completeModal: '.ant-modal',
    confirmComplete: '.ant-modal .ant-btn-primary',
    cancelModal: '.ant-modal',
    cancelReason: '.ant-modal textarea',
    confirmCancel: '.ant-modal .ant-btn-primary',
    updateStatusModal: '.ant-modal',
    statusSelect: '.ant-modal .ant-select',
    notes: '.ant-modal textarea',
    submitUpdate: '.ant-modal .ant-btn-primary',
    closeModal: '.ant-modal-close',
  },

  messages: {
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open() {
    I.amOnPage('/trip-manager/active-trip');
    I.waitForElement('body', 30);
    I.waitForInvisible('.ant-spin', 30);
    I.wait(3);
  },

  clickScanQR() {
    I.click(this.buttons.scanQR);
    I.wait(3);
  },

  clickViewPassengers() {
    I.click(this.buttons.viewPassengers);
    I.wait(3);
  },

  clickCompleteTrip() {
    I.click(this.buttons.completeTrip);
    I.waitForElement(this.modal.completeModal, 10);
  },

  confirmCompleteTrip() {
    I.click(this.modal.confirmComplete);
    I.wait(3);
  },

  clickCancelTrip() {
    I.click(this.buttons.cancelTrip);
    I.waitForElement(this.modal.cancelModal, 10);
  },

  fillCancelReason(reason) {
    I.fillField(this.modal.cancelReason, reason);
  },

  confirmCancelTrip() {
    I.click(this.modal.confirmCancel);
    I.wait(3);
  },

  cancelTrip(reason) {
    this.clickCancelTrip();
    this.fillCancelReason(reason);
    this.confirmCancelTrip();
  },

  clickUpdateLocation() {
    I.click(this.buttons.updateLocation);
    I.waitForElement(this.modal.updateStatusModal, 10);
  },

  clickLogout() {
    I.click(this.buttons.logout);
    I.wait(3);
  },

  seeActiveTripPage() {
    I.seeElement(this.elements.routeName);
  },

  seeSeatMap() {
    I.seeElement(this.elements.seatMap);
  },

  seePassengerStats() {
    I.seeElement(this.elements.statsTotal);
  },

  seeTimeline() {
    I.seeElement(this.elements.timeline);
  },

  seeStatus(status) {
    I.see(status);
  },
};
