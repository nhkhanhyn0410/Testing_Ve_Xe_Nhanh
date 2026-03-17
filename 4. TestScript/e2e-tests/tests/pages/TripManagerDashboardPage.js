const { I } = inject();

module.exports = {

  elements: {
    tripsTable: '.ant-table',
    tableRow: '.ant-table-row',
    statsTotal: '//div[contains(.,"Tổng")]//span[contains(@class,"ant-statistic-content-value")]',
    statsUpcoming: '//div[contains(.,"Sắp tới")]//span[contains(@class,"ant-statistic-content-value")]',
    statsOngoing: '//div[contains(.,"Đang chạy")]//span[contains(@class,"ant-statistic-content-value")]',
    statsCompleted: '//div[contains(.,"Hoàn thành")]//span[contains(@class,"ant-statistic-content-value")]',
    greeting: '//div[contains(.,"Xin chào")]',
  },

  buttons: {
    startTrip: '//button[contains(.,"Bắt đầu") or .//span[contains(@class,"PlayCircleOutlined")]]',
    completeTrip: '//button[contains(.,"Hoàn thành") or .//span[contains(@class,"CheckCircleOutlined")]]',
    cancelTrip: '//button[contains(.,"Hủy") or .//span[contains(@class,"CloseCircleOutlined")]]',
    logout: '//button[contains(.,"Đăng xuất")]',
  },

  modal: {
    cancelModal: '.ant-modal',
    cancelReason: '.ant-modal textarea',
    confirmCancel: '.ant-modal .ant-btn-primary',
    closeModal: '.ant-modal-close',
  },

  messages: {
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open() {
    I.amOnPage('/trip-manager/dashboard');
    I.waitForElement('body', 30);
    I.waitForInvisible('.ant-spin', 30);
    I.wait(3);
  },

  clickStartTrip(index) {
    const btn = index
      ? locate(this.buttons.startTrip).at(index)
      : locate(this.buttons.startTrip).first();
    I.click(btn);
    I.wait(3);
  },

  clickCompleteTrip(index) {
    const btn = index
      ? locate(this.buttons.completeTrip).at(index)
      : locate(this.buttons.completeTrip).first();
    I.click(btn);
    I.wait(3);
  },

  clickCancelTrip(index) {
    const btn = index
      ? locate(this.buttons.cancelTrip).at(index)
      : locate(this.buttons.cancelTrip).first();
    I.click(btn);
    I.waitForElement(this.modal.cancelModal, 10);
  },

  fillCancelReason(reason) {
    I.fillField(this.modal.cancelReason, reason);
  },

  confirmCancel() {
    I.click(this.modal.confirmCancel);
    I.wait(3);
  },

  cancelTrip(index, reason) {
    this.clickCancelTrip(index);
    this.fillCancelReason(reason);
    this.confirmCancel();
  },

  clickLogout() {
    I.click(this.buttons.logout);
    I.wait(3);
  },

  seeDashboard() {
    I.seeElement(this.elements.tripsTable);
  },

  seeGreeting() {
    I.seeElement(this.elements.greeting);
  },

  seeStatistics() {
    I.seeElement(this.elements.statsTotal);
  },

  seeTrip(tripInfo) {
    I.see(tripInfo);
  },
};
