const { I } = inject();

module.exports = {

  elements: {
    busesTable: '.ant-table',
    tableRow: '.ant-table-row',
  },

  buttons: {
    addBus: '//button[contains(.,"Thêm Xe Mới") or .//span[contains(@class,"anticon-plus")]]',
    edit: '//button[contains(.,"Sửa") or .//span[contains(@class,"anticon-edit")]]',
    delete: '//button[.//span[contains(@class,"anticon-delete")]]',
    // Seat Layout modal
    openSeatLayout: '//button[normalize-space()="Tạo Sơ Đồ Ghế"]',
    buildSeatLayout: '//button[normalize-space()="Tạo Sơ Đồ"]',
    saveSeatLayout: '//button[normalize-space()="Lưu Sơ Đồ"]',
  },

  modal: {
    busModal: '.ant-modal',
    busNumber: '#busNumber',
    busType: '//div[contains(@class,"ant-form-item") and .//label[contains(.,"Loại Xe")]]//div[contains(@class,"ant-select-selector")]',
    status: '//div[contains(@class,"ant-form-item") and .//label[contains(.,"Trạng Thái")]]//div[contains(@class,"ant-select-selector")]',
    amenities: '//div[contains(@class,"ant-form-item") and .//label[contains(.,"Tiện Nghi")]]//div[contains(@class,"ant-select-selector")]',
    submit: '.ant-modal .ant-btn-primary',
    cancel: '.ant-modal .ant-btn-default',
    deleteConfirmOk: '//button[contains(.,"Xóa")]',
  },

  messages: {
    createSuccess: 'Tạo xe thành công',
    updateSuccess: 'Cập nhật xe thành công',
    deleteSuccess: 'Xóa xe thành công',
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open() {
    I.amOnPage('/operator/buses');
    I.waitForElement(this.elements.busesTable, 30);
    I.waitForInvisible('.ant-spin', 30);
  },

  seeBusesTable() {
    I.seeElement(this.elements.busesTable);
  },

  // === CREATE ===

  clickAddBus() {
    I.click(this.buttons.addBus);
    I.waitForElement(this.modal.busModal, 10);
    I.wait(1);
  },

  fillBusNumber(number) {
    I.clearField(this.modal.busNumber);
    I.fillField(this.modal.busNumber, number);
  },

  selectFromDropdown(selectorXpath, optionText) {
    I.click(selectorXpath);
    I.wait(1);
    I.click(`//div[contains(@class,"ant-select-item-option") and contains(.,"${optionText}")]`);
    I.wait(1);
  },

  selectBusType(type) {
    this.selectFromDropdown(this.modal.busType, type);
  },

  selectStatus(status) {
    this.selectFromDropdown(this.modal.status, status);
  },

  submitBus() {
    I.click(this.modal.submit);
    I.wait(1);
  },

  // Tạo sơ đồ ghế cơ bản (bắt buộc trước khi submit)
  createBasicSeatLayout() {
    // Bước 1: Mở modal Tạo Sơ Đồ Ghế
    I.click(this.buttons.openSeatLayout);
    I.waitForText('Tạo Sơ Đồ Ghế Tùy Chỉnh', 10);
    I.wait(1);

    // Bước 2: Click nút đỏ "Tạo Sơ Đồ" để generate layout
    I.click(this.buttons.buildSeatLayout);
    I.wait(3);

    // Bước 3: Click "Lưu Sơ Đồ" (enabled sau khi generate xong)
    I.waitForEnabled(this.buttons.saveSeatLayout, 10);
    I.click(this.buttons.saveSeatLayout);
    I.wait(2);
  },

  createBus(busNumber, busType) {
    this.clickAddBus();
    this.fillBusNumber(busNumber);
    if (busType) this.selectBusType(busType);
    this.createBasicSeatLayout();
    this.submitBus();
  },

  // === EDIT ===

  clickEdit(index) {
    const btn = index
      ? locate(this.buttons.edit).at(index)
      : locate(this.buttons.edit).first();
    I.click(btn);
    I.waitForElement(this.modal.busModal, 10);
    I.wait(1);
  },

  editBusNumber(newNumber) {
    I.clearField(this.modal.busNumber);
    I.fillField(this.modal.busNumber, newNumber);
  },

  // === DELETE ===

  clickDelete(index) {
    const btn = index
      ? locate(this.buttons.delete).at(index)
      : locate(this.buttons.delete).first();
    I.click(btn);
    I.wait(1);
  },

  confirmDelete() {
    I.click(this.modal.deleteConfirmOk);
    I.wait(1);
  },

  // === ASSERTIONS ===

  seeBus(busNumber) {
    I.see(busNumber);
  },

  dontSeeBus(busNumber) {
    I.dontSee(busNumber);
  },

  seeCreateSuccess() {
    I.see(this.messages.createSuccess);
  },

  seeUpdateSuccess() {
    I.see(this.messages.updateSuccess);
  },

  seeDeleteSuccess() {
    I.see(this.messages.deleteSuccess);
  },

  seeError() {
    I.waitForElement(this.messages.error, 10);
  },

  closeModal() {
    I.click(this.modal.cancel);
    I.wait(1);
  },
};
