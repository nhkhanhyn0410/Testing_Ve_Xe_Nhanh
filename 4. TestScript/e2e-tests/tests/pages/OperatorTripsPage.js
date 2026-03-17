const { I } = inject();

module.exports = {

  elements: {
    tripsTable: '.ant-table',
    tableRow: '.ant-table-row',
    searchInput: '//input[contains(@placeholder,"Tìm kiếm")]',
    statusFilter: '.ant-select',
  },

  buttons: {
    createTrip: '//button[contains(.,"Tạo Chuyến") or .//span[contains(@class,"PlusOutlined")]]',
    edit: '//button[.//span[contains(@class,"EditOutlined")]]',
    delete: '//button[contains(@class,"danger") or .//span[contains(@class,"DeleteOutlined")]]',
    cancel: '//button[contains(.,"Hủy chuyến")]',
  },

  modal: {
    tripModal: '.ant-modal',
    routeId: '.ant-modal .ant-select',
    busId: '.ant-modal .ant-select',
    driverId: '.ant-modal .ant-select',
    tripManagerId: '.ant-modal .ant-select',
    departureDate: '//div[contains(@class,"ant-picker")]//input[contains(@placeholder,"Ngày khởi hành") or contains(@placeholder,"date")]',
    departureTime: '//div[contains(@class,"ant-picker")]//input[contains(@placeholder,"Giờ") or contains(@placeholder,"time")]',
    basePrice: '.ant-modal #basePrice',
    submit: '.ant-modal .ant-btn-primary',
    cancelModal: '.ant-modal .ant-btn-default',
  },

  messages: {
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open() {
    I.amOnPage('/operator/trips');
    I.waitForElement(this.elements.tripsTable, 30);
    I.waitForInvisible('.ant-spin', 30);
  },

  clickCreateTrip() {
    I.click(this.buttons.createTrip);
    I.waitForElement(this.modal.tripModal, 10);
  },

  selectRoute(routeName) {
    I.click(locate(this.modal.routeId).first());
    I.wait(1);
    I.click(`//div[contains(@class,"ant-select-item") and contains(.,"${routeName}")]`);
    I.wait(1);
  },

  selectBus(busNumber) {
    I.click(locate(this.modal.busId).at(2));
    I.wait(1);
    I.click(`//div[contains(@class,"ant-select-item") and contains(.,"${busNumber}")]`);
    I.wait(1);
  },

  fillBasePrice(price) {
    I.fillField(this.modal.basePrice, price);
  },

  submitTrip() {
    I.click(this.modal.submit);
    I.wait(3);
  },

  searchTrip(keyword) {
    I.fillField(this.elements.searchInput, keyword);
    I.wait(2);
  },

  filterByStatus(status) {
    I.click(this.elements.statusFilter);
    I.wait(1);
    I.click(`//div[contains(@class,"ant-select-item") and contains(.,"${status}")]`);
    I.wait(2);
  },

  clickEdit(index) {
    const btn = index
      ? locate(this.buttons.edit).at(index)
      : locate(this.buttons.edit).first();
    I.click(btn);
    I.waitForElement(this.modal.tripModal, 10);
  },

  seeTripsTable() {
    I.seeElement(this.elements.tripsTable);
  },

  seeTrip(tripInfo) {
    I.see(tripInfo);
  },

  seeCreateSuccess() {
    I.seeElement(this.messages.success);
  },
};
