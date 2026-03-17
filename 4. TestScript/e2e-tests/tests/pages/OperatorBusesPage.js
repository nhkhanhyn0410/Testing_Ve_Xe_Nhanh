const { I } = inject();

module.exports = {

  elements: {
    busesTable: '.ant-table',
    tableRow: '.ant-table-row',
  },

  buttons: {
    addBus: '//button[contains(.,"Thêm Xe") or .//span[contains(@class,"PlusOutlined")]]',
    edit: '//button[.//span[contains(@class,"EditOutlined")]]',
    delete: '//button[contains(@class,"danger") or .//span[contains(@class,"DeleteOutlined")]]',
    seatLayout: '//button[contains(.,"Sơ Đồ Ghế") or contains(.,"Tạo Sơ Đồ")]',
  },

  modal: {
    busModal: '.ant-modal',
    busNumber: '.ant-modal #busNumber',
    busType: '.ant-modal .ant-select',
    status: '.ant-modal .ant-select',
    submit: '.ant-modal .ant-btn-primary',
    cancel: '.ant-modal .ant-btn-default',
  },

  messages: {
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open() {
    I.amOnPage('/operator/buses');
    I.waitForElement(this.elements.busesTable, 30);
    I.waitForInvisible('.ant-spin', 30);
  },

  clickAddBus() {
    I.click(this.buttons.addBus);
    I.waitForElement(this.modal.busModal, 10);
  },

  fillBusNumber(number) {
    I.fillField(this.modal.busNumber, number);
  },

  selectBusType(type) {
    I.click(locate(this.modal.busType).first());
    I.wait(1);
    I.click(`//div[contains(@class,"ant-select-item") and contains(.,"${type}")]`);
    I.wait(1);
  },

  submitBus() {
    I.click(this.modal.submit);
    I.wait(3);
  },

  createBus(busNumber, busType) {
    this.clickAddBus();
    this.fillBusNumber(busNumber);
    if (busType) this.selectBusType(busType);
    this.submitBus();
  },

  clickEdit(index) {
    const btn = index
      ? locate(this.buttons.edit).at(index)
      : locate(this.buttons.edit).first();
    I.click(btn);
    I.waitForElement(this.modal.busModal, 10);
  },

  clickDelete(index) {
    const btn = index
      ? locate(this.buttons.delete).at(index)
      : locate(this.buttons.delete).first();
    I.click(btn);
    I.wait(1);
    I.click('//button[contains(.,"OK") or contains(.,"Xác nhận")]');
    I.wait(3);
  },

  seeBusesTable() {
    I.seeElement(this.elements.busesTable);
  },

  seeBus(busNumber) {
    I.see(busNumber);
  },

  seeCreateSuccess() {
    I.seeElement(this.messages.success);
  },
};
