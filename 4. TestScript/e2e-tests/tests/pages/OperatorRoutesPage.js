const { I } = inject();

module.exports = {

  elements: {
    routesTable: '.ant-table',
    tableRow: '.ant-table-row',
  },

  buttons: {
    createRoute: '//button[contains(.,"Tạo Tuyến") or .//span[contains(@class,"PlusOutlined")]]',
    edit: '//button[.//span[contains(@class,"EditOutlined")]]',
    delete: '//button[contains(@class,"danger") or .//span[contains(@class,"DeleteOutlined")]]',
    toggle: '//button[contains(.,"Tắt") or contains(.,"Bật")]',
  },

  modal: {
    routeModal: '.ant-modal',
    routeName: '.ant-modal #routeName',
    routeCode: '.ant-modal #routeCode',
    originProvince: '.ant-modal #originProvince',
    originCity: '.ant-modal #originCity',
    destinationProvince: '.ant-modal #destinationProvince',
    destinationCity: '.ant-modal #destinationCity',
    distance: '.ant-modal #distance',
    estimatedDuration: '.ant-modal #estimatedDuration',
    addPickupPoint: '//button[contains(.,"Thêm điểm đón")]',
    addDropoffPoint: '//button[contains(.,"Thêm điểm trả")]',
    submit: '.ant-modal .ant-btn-primary',
    cancel: '.ant-modal .ant-btn-default',
  },

  messages: {
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open() {
    I.amOnPage('/operator/routes');
    I.waitForElement(this.elements.routesTable, 30);
    I.waitForInvisible('.ant-spin', 30);
  },

  clickCreateRoute() {
    I.click(this.buttons.createRoute);
    I.waitForElement(this.modal.routeModal, 10);
  },

  fillRouteName(name) {
    I.fillField(this.modal.routeName, name);
  },

  fillRouteCode(code) {
    I.fillField(this.modal.routeCode, code);
  },

  fillOrigin(province, city) {
    I.fillField(this.modal.originProvince, province);
    I.fillField(this.modal.originCity, city);
  },

  fillDestination(province, city) {
    I.fillField(this.modal.destinationProvince, province);
    I.fillField(this.modal.destinationCity, city);
  },

  fillDistance(distance) {
    I.fillField(this.modal.distance, distance);
  },

  fillDuration(duration) {
    I.fillField(this.modal.estimatedDuration, duration);
  },

  submitRoute() {
    I.click(this.modal.submit);
    I.wait(3);
  },

  createRoute(name, code, originProvince, originCity, destProvince, destCity, distance, duration) {
    this.clickCreateRoute();
    this.fillRouteName(name);
    this.fillRouteCode(code);
    this.fillOrigin(originProvince, originCity);
    this.fillDestination(destProvince, destCity);
    this.fillDistance(distance);
    this.fillDuration(duration);
    this.submitRoute();
  },

  clickEdit(index) {
    const btn = index
      ? locate(this.buttons.edit).at(index)
      : locate(this.buttons.edit).first();
    I.click(btn);
    I.waitForElement(this.modal.routeModal, 10);
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

  seeRoutesTable() {
    I.seeElement(this.elements.routesTable);
  },

  seeRoute(routeName) {
    I.see(routeName);
  },

  seeCreateSuccess() {
    I.seeElement(this.messages.success);
  },
};
