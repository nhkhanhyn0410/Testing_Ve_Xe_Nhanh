const { I } = inject();

module.exports = {

  // ===== Existing base locators for Operator Trips =====
  elements: {
    tripsTable: '.ant-table',
    tableBody: '.ant-table-tbody',
    tableRow: '.ant-table-row',
    searchInput: '//input[contains(@placeholder,"Tìm kiếm") or contains(@placeholder,"Nhập từ khóa") or contains(@aria-label,"Tìm kiếm")]',
    statusFilter: '.ant-select',
    loadingSpinner: '.ant-spin-spinning',
  },

  buttons: {
    createTrip: '//button[contains(normalize-space(.),"Tạo Chuyến") or contains(normalize-space(.),"Tạo chuyến") or contains(normalize-space(.),"Tạo Chuyến Xe") or contains(normalize-space(.),"Tạo chuyến xe") or .//span[contains(@class,"PlusOutlined")]]',
    edit: '//button[.//span[contains(@class,"EditOutlined")]]',
    delete: '//button[contains(@class,"danger") or .//span[contains(@class,"DeleteOutlined")]]',
    cancel: '//button[contains(.,"Hủy chuyến")]',
    submitInModal: '//div[contains(@class,"ant-modal")]//button[not(@disabled)][contains(normalize-space(.),"Tạo") or contains(normalize-space(.),"Lưu") or contains(normalize-space(.),"Xác nhận")]',
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
    success: '.ant-message-success, .ant-message-notice, .ant-notification-notice',
    error: '.ant-message-error',
  },

  // ===== Existing methods kept for compatibility =====
  open() {
    I.amOnPage('/operator/trips');
    this.waitForPageReady();
  },

  waitForPageReady() {
    I.waitForElement('body', 30);
    I.waitForInvisible(this.elements.loadingSpinner, 30);
    I.waitForElement(this.elements.tripsTable, 30);
    I.waitForElement(this.elements.tableBody, 30);
    I.wait(1);
  },

  clickCreateTrip() {
    I.waitForElement(this.buttons.createTrip, 10);
    I.click(this.buttons.createTrip);
    I.waitForElement(this.modal.tripModal, 10);
    I.wait(1);
  },

  selectRoute(routeName) {
    this.selectOptionByLabel('Tuyến đường', routeName);
  },

  selectBus(busNumber) {
    this.selectOptionByLabel('Xe', busNumber);
  },

  fillBasePrice(price) {
    this.fillInputByLabel('Giá vé cơ bản', price);
  },

  submitTrip() {
    I.waitForElement(this.buttons.submitInModal, 10);
    I.click(this.buttons.submitInModal);
    I.wait(1);
  },

  searchTrip(keyword) {
    I.waitForElement(this.elements.searchInput, 10);
    I.fillField(this.elements.searchInput, keyword);
    I.pressKey('Enter');
    I.wait(1);
    this.waitForPageReady();
  },

  filterByStatus(status) {
    I.click(this.elements.statusFilter);
    I.wait(1);
    I.click(`//div[contains(@class,"ant-select-item") and contains(normalize-space(.),"${status}")]`);
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
    I.waitForInvisible(this.modal.tripModal, 10);
  },

  // ===== Separate section for testcase 21: Operator trip creation management =====
  modalLabel(label) {
    return `//div[contains(@class,"ant-modal")]//*[self::label or contains(@class,"ant-form-item-label")][contains(normalize-space(.),"${label}")]`;
  },

  modalFormItemByLabel(label) {
    return `${this.modalLabel(label)}/ancestor::*[contains(@class,"ant-form-item")][1]`;
  },

  modalSelectByLabel(label) {
    return `${this.modalFormItemByLabel(label)}//div[contains(@class,"ant-select") and not(contains(@class,"ant-select-disabled"))][1]`;
  },

  modalInputByLabel(label) {
    return `${this.modalFormItemByLabel(label)}//input[not(@type="hidden")][1]`;
  },

  modalPickerByLabel(label) {
    return `${this.modalFormItemByLabel(label)}//div[contains(@class,"ant-picker")][1]`;
  },

  selectDropdownOption(optionText) {
    const optionLocator = `//div[contains(@class,"ant-select-dropdown") and not(contains(@style,"display: none"))]//div[contains(@class,"ant-select-item-option-content")][contains(normalize-space(.),"${optionText}")]`;
    I.waitForElement(optionLocator, 10);
    I.click(optionLocator);
    I.wait(0.5);
  },

  selectOptionByLabel(label, optionText) {
    I.waitForElement(this.modalSelectByLabel(label), 10);
    I.click(this.modalSelectByLabel(label));
    I.wait(0.5);
    this.selectDropdownOption(optionText);
  },

  fillInputByLabel(label, value) {
    I.waitForElement(this.modalInputByLabel(label), 10);
    I.fillField(this.modalInputByLabel(label), value);
  },

  selectDateByLabel(label, dateValue) {
    const picker = this.modalPickerByLabel(label);
    const input = `${picker}//input`;
    I.waitForElement(picker, 10);
    I.click(picker);
    I.wait(0.5);
    I.fillField(input, dateValue);
    I.pressKey('Enter');
    I.wait(0.5);
  },

  selectTimeByLabel(label, timeValue) {
    const picker = this.modalPickerByLabel(label);
    const input = `${picker}//input`;
    I.waitForElement(picker, 10);
    I.click(picker);
    I.wait(0.5);
    I.fillField(input, timeValue);
    I.pressKey('Enter');
    I.wait(0.5);
  },

  fillTripForm(data) {
    if (data.route !== undefined && data.route !== null && data.route !== '') {
      this.selectOptionByLabel('Tuyến đường', data.route);
    }

    if (data.bus) {
      this.selectOptionByLabel('Xe', data.bus);
    }

    if (data.driver) {
      this.selectOptionByLabel('Tài xế', data.driver);
    }

    if (Object.prototype.hasOwnProperty.call(data, 'tripManager') && data.tripManager) {
      this.selectOptionByLabel('Quản lý chuyến', data.tripManager);
    }

    if (data.departureDate) {
      this.selectDateByLabel('Ngày khởi hành', data.departureDate);
    }

    if (data.departureTime) {
      this.selectTimeByLabel('Giờ khởi hành', data.departureTime);
    }

    if (data.arrivalDate) {
      this.selectDateByLabel('Ngày đến', data.arrivalDate);
    }

    if (data.arrivalTime) {
      this.selectTimeByLabel('Giờ đến', data.arrivalTime);
    }

    if (data.basePrice !== undefined) {
      this.fillInputByLabel('Giá vé cơ bản', data.basePrice);
    }
  },

  tripRowByKeyword(keyword) {
    return `//tbody[contains(@class,"ant-table-tbody")]//tr[contains(@class,"ant-table-row")][.//*[contains(normalize-space(.),"${keyword}")]]`;
  },

  seeTripInList(...keywords) {
    const validKeywords = keywords.filter(Boolean);

    if (!validKeywords.length) {
      return;
    }

    const xpathConditions = validKeywords
      .map((keyword) => `.//*[contains(normalize-space(.),"${keyword}")]`)
      .join(' and ');

    const rowLocator = `//tbody[contains(@class,"ant-table-tbody")]//tr[contains(@class,"ant-table-row")][${xpathConditions}]`;
    I.waitForElement(rowLocator, 15);
    I.seeElement(rowLocator);
  },

  dontSeeTripInList(keyword) {
    I.dontSeeElement(this.tripRowByKeyword(keyword));
  },

  seeValidationMessage(message) {
    const validationLocator = `//div[contains(@class,"ant-form-item-explain") and contains(normalize-space(.),"${message}")] | //div[contains(@class,"ant-message") and contains(normalize-space(.),"${message}")] | //div[contains(@class,"ant-notification") and contains(normalize-space(.),"${message}")]`;
    I.waitForElement(validationLocator, 10);
    I.seeElement(validationLocator);
  },

  seeCreateModalStillOpen() {
    I.waitForElement(this.modal.tripModal, 10);
    I.seeElement(this.modal.tripModal);
  },

  seeTableHeaders() {
    I.see('Mã chuyến', this.elements.tripsTable);
    I.see('Tuyến đường', this.elements.tripsTable);
    I.see('Xe', this.elements.tripsTable);
    I.see('Giờ khởi hành', this.elements.tripsTable);
  },

  seeOnlyRowsMatchingKeyword(keyword) {
    const nonMatchingRow = `//tbody[contains(@class,"ant-table-tbody")]//tr[contains(@class,"ant-table-row")][not(.//*[contains(normalize-space(.),"${keyword}")])]`;
    I.waitForElement(this.elements.tableBody, 10);
    I.seeElement(this.tripRowByKeyword(keyword));
    I.dontSeeElement(nonMatchingRow);
  },

  getAvailableOptionText(label) {
    const optionLocator = '//div[contains(@class,"ant-select-dropdown") and not(contains(@style,"display: none"))]//div[contains(@class,"ant-select-item-option-content")]';
    I.waitForElement(this.modalSelectByLabel(label), 10);
    I.click(this.modalSelectByLabel(label));
    I.waitForElement(optionLocator, 10);

    const text = I.grabTextFrom(locate(optionLocator).first());

    I.pressKey('Escape');
    I.wait(0.5);

    return text;
  },
};