const { I } = inject();

module.exports = {
  elements: {
    routesTable: '.ant-table',
    tableBody: '.ant-table-tbody',
    tableRow: '.ant-table-tbody .ant-table-row',
    loadingSpinner: '.ant-spin-spinning',
    modal: '.ant-modal, .ant-modal-root',
  },

  buttons: {
    createRoute: '//button[contains(.,"Tạo Tuyến Mới") or contains(.,"Tạo tuyến mới") or contains(.,"Thêm tuyến") or contains(.,"Tạo tuyến")]',
    save: '//div[contains(@class,"ant-modal")]//button[not(@disabled)][contains(.,"Tạo") or contains(.,"Cập") or contains(.,"Lưu")]',
   confirmDelete: '//div[contains(@class,"ant-popconfirm") or contains(@class,"ant-popover")]//button[normalize-space(.)="Xóa"]',
    addPickupPoint: '//div[contains(@class,"ant-modal")]//button[contains(.,"Thêm điểm đón")]',
    addDropoffPoint: '//div[contains(@class,"ant-modal")]//button[contains(.,"Thêm điểm trả")]',
  },

  fields: {
    routeName: '#routeName',
    routeCode: '#routeCode',
    originProvince: '#originProvince',
    originDistrict: '#originDistrict, #originCity',
    destinationProvince: '#destinationProvince',
    destinationDistrict: '#destinationDistrict, #destinationCity',
    distance: '#distance',
    estimatedDuration: '#estimatedDuration',
  },

  open() {
    I.amOnPage('/operator/routes');
    I.waitForElement('body', 30);
    I.waitForElement(this.elements.routesTable, 30);
    this.waitForPageReady();
  },

  waitForPageReady() {
    I.waitForInvisible(this.elements.loadingSpinner, 20);
    I.waitForElement(this.elements.tableBody, 20);
    I.wait(2);
  },

  seeRoutesTable() {
    I.seeElement(this.elements.routesTable);
    I.see('Tên');
    I.see('Mã');
    I.see('Hành Động');
  },

  clickCreateRoute() {
    I.click(this.buttons.createRoute);
    I.waitForElement(this.elements.modal, 10);
    I.wait(1);
  },

  fillBasicRouteInfo({
    routeName,
    routeCode,
    originProvince,
    originDistrict,
    destinationProvince,
    destinationDistrict,
    distance,
    estimatedDuration,
  }) {
    if (routeName !== undefined) I.fillField(this.fields.routeName, routeName);
    if (routeCode !== undefined) I.fillField(this.fields.routeCode, routeCode);
    if (originProvince !== undefined) I.fillField(this.fields.originProvince, originProvince);
    if (originDistrict !== undefined) I.fillField(this.fields.originDistrict, originDistrict);
    if (destinationProvince !== undefined) I.fillField(this.fields.destinationProvince, destinationProvince);
    if (destinationDistrict !== undefined) I.fillField(this.fields.destinationDistrict, destinationDistrict);
    if (distance !== undefined) I.fillField(this.fields.distance, distance);
    if (estimatedDuration !== undefined) I.fillField(this.fields.estimatedDuration, estimatedDuration);
  },

  // ===== PICKUP / DROPOFF LOCATORS =====
  // Dựa theo placeholder thật trong form của bạn
  pickupNameField(index = 1) {
    return `(//div[contains(@class,"ant-modal")]//input[contains(@placeholder,"Bến xe Miền Đông")])[${index}]`;
  },

  pickupAddressField(index = 1) {
    return `(//div[contains(@class,"ant-modal")]//input[contains(@placeholder,"292 Đinh Bộ Lĩnh")])[${index}]`;
  },

  dropoffNameField(index = 1) {
    return `(//div[contains(@class,"ant-modal")]//input[contains(@placeholder,"Bến xe Đà Lạt")])[${index}]`;
  },

  dropoffAddressField(index = 1) {
    return `(//div[contains(@class,"ant-modal")]//input[contains(@placeholder,"1 Tô Hiến Thành")])[${index}]`;
  },

  fillPickupPoint(pointName, pointAddress, index = 1) {
    I.waitForElement(this.pickupNameField(index), 10);
    I.fillField(this.pickupNameField(index), pointName);
    I.fillField(this.pickupAddressField(index), pointAddress);
  },

  fillDropoffPoint(pointName, pointAddress, index = 1) {
    I.waitForElement(this.dropoffNameField(index), 10);
    I.fillField(this.dropoffNameField(index), pointName);
    I.fillField(this.dropoffAddressField(index), pointAddress);
  },

  addPickupPoint(pointName, pointAddress, index = 1) {
    if (index > 1) {
      I.click(this.buttons.addPickupPoint);
      I.wait(1);
    }
    this.fillPickupPoint(pointName, pointAddress, index);
  },

  addDropoffPoint(pointName, pointAddress, index = 1) {
    if (index > 1) {
      I.click(this.buttons.addDropoffPoint);
      I.wait(1);
    }
    this.fillDropoffPoint(pointName, pointAddress, index);
  },

  submitRoute() {
    I.waitForElement(this.buttons.save, 10);
    I.click(this.buttons.save);
    I.wait(2);
  },

  createRoute(routeData) {
    this.clickCreateRoute();
    this.fillBasicRouteInfo(routeData);

    if (routeData.pickupPoints) {
      routeData.pickupPoints.forEach((point, idx) => {
        this.addPickupPoint(point.name, point.address, idx + 1);
      });
    }

    if (routeData.dropoffPoints) {
      routeData.dropoffPoints.forEach((point, idx) => {
        this.addDropoffPoint(point.name, point.address, idx + 1);
      });
    }

    this.submitRoute();
  },

  routeRow(routeKeyword) {
    return `//tbody[contains(@class,'ant-table-tbody')]//tr[contains(@class,'ant-table-row')][.//*[contains(normalize-space(),"${routeKeyword}")]]`;
  },

  clickRowAction(routeKeyword, actionLabel, iconKeyword) {
    const rowXpath = this.routeRow(routeKeyword);
    const actionXpath = `${rowXpath}//button[contains(normalize-space(),"${actionLabel}") or @title="${actionLabel}" or .//*[contains(@class,'${iconKeyword}')]]`;
    I.scrollTo(rowXpath);
    I.click(actionXpath);
  },

  openEditRoute(routeKeyword) {
    this.clickRowAction(routeKeyword, 'Sửa', 'edit');
    I.waitForElement(this.elements.modal, 10);
    I.wait(1);
  },

  updateDistance(routeKeyword, distance) {
    this.openEditRoute(routeKeyword);
    I.fillField(this.fields.distance, distance);
    this.submitRoute();
  },

  addPickupPointForRoute(routeKeyword, pointName, pointAddress, index = 2) {
    this.openEditRoute(routeKeyword);
    this.addPickupPoint(pointName, pointAddress, index);
    this.submitRoute();
  },
deleteButtonInRow(routeKeyword) {
  return `${this.routeRow(routeKeyword)}//button[normalize-space(.)="Xóa"]`;
},
deleteRoute(routeKeyword) {
   I.scrollTo(this.routeRow(routeKeyword));
  I.waitForElement(this.deleteButtonInRow(routeKeyword), 10);
  I.click(this.deleteButtonInRow(routeKeyword));

  I.waitForElement('//div[contains(@class,"ant-popconfirm") or contains(@class,"ant-popover")]', 10);
  I.waitForElement(this.buttons.confirmDelete, 10);
  I.click(this.buttons.confirmDelete);

  I.wait(3);
},
dontSeeRouteRow(routeKeyword) {
  I.dontSeeElement(this.routeRow(routeKeyword));
},
  seeRouteInList(routeKeyword) {
    I.see(routeKeyword, this.elements.routesTable);
  },

  dontSeeRouteInList(routeKeyword) {
    I.dontSee(routeKeyword, this.elements.routesTable);
  },

  seeValidationMessage(message) {
    I.see(message);
  },

  seeDistanceValue(distance) {
    I.see(distance, this.elements.routesTable);
  },

  seeSuccessToast() {
    I.seeElement('.ant-message-notice, .ant-notification-notice');
  },
};