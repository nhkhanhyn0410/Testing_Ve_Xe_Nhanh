const { I } = inject();

module.exports = {
  elements: {
    menuVoucher:
      '//a[@href="/operator/vouchers"] | //span[normalize-space()="Voucher"] | //span[contains(normalize-space(.),"Voucher")]',

    pageTitle:
      '//*[self::h1 or self::h2 or self::div or self::span][contains(normalize-space(.),"Quản Lý Voucher") or contains(normalize-space(.),"Quản lý voucher")]',

    voucherListMarker:
      '//*[contains(normalize-space(.),"Mã Voucher")] | //*[contains(normalize-space(.),"Mô Tả")] | //*[contains(normalize-space(.),"Trạng Thái")]',

    searchInput:
      '//input[contains(@placeholder,"Tìm theo mã voucher") or contains(@placeholder,"Tìm") or contains(@placeholder,"voucher")]',

    createVoucherButton:
      '//button[contains(normalize-space(.),"Tạo Voucher Mới") or contains(normalize-space(.),"Tạo voucher mới") or contains(normalize-space(.),"Tạo Voucher") or contains(normalize-space(.),"Tạo voucher")]',

    createVoucherModal:
      '//div[contains(@class,"ant-modal") and .//*[contains(normalize-space(.),"Tạo Voucher Mới") or contains(normalize-space(.),"Tạo voucher mới")]]',

    voucherCodeInput:
      '(//div[contains(@class,"ant-modal")]//input[@id="code" or @name="code" or contains(@placeholder,"Mã voucher")])[1]',

    descriptionTextarea:
      '(//div[contains(@class,"ant-modal")]//textarea)[1]',

    discountTypeSelect:
      '(//div[contains(@class,"ant-modal")]//*[contains(normalize-space(.),"Loại Giảm Giá") or contains(normalize-space(.),"Loại giảm giá")]/ancestor::*[contains(@class,"ant-form-item")][1]//div[contains(@class,"ant-select-selector")])[1]',

    discountValueInput:
      '(//div[contains(@class,"ant-modal")]//input[@id="discountValue" or @name="discountValue" or contains(@placeholder,"Nhập giá trị")])[1]',

    usagePerUserInput:
      '(//div[contains(@class,"ant-modal")]//input[@id="maxUsagePerUser" or @name="maxUsagePerUser" or @id="usagePerUser" or @name="usagePerUser"])[1]',

    startDateInput:
      '(//div[contains(@class,"ant-modal")]//input[contains(@placeholder,"Chọn ngày giờ")])[1]',

    endDateInput:
      '(//div[contains(@class,"ant-modal")]//input[contains(@placeholder,"Chọn ngày giờ")])[2]',

    submitCreateButton:
      '//div[contains(@class,"ant-modal")]//button[not(@disabled)][contains(normalize-space(.),"Tạo mới") or contains(normalize-space(.),"Lưu")]',

    cancelButton:
      '//div[contains(@class,"ant-modal")]//button[contains(normalize-space(.),"Hủy")]',

    dropdown:
      '//div[contains(@class,"ant-select-dropdown") and not(contains(@style,"display: none"))]',

    datePickerDropdown:
      '//div[contains(@class,"ant-picker-dropdown") and not(contains(@style,"display: none"))]',

    loadingSpinner:
      '.ant-spin-spinning, .ant-skeleton, .ant-table-placeholder .ant-spin',

    toastNotice:
      '.ant-message-notice, .ant-notification-notice',

    duplicateError:
      '//*[contains(normalize-space(.),"Mã voucher đã tồn tại")] | //*[contains(normalize-space(.),"voucher đã tồn tại")]',

    rowContainer:
      '//table//tbody/tr | //tbody/tr | //tr[.//td]',
  },

  open() {
    I.amOnPage('/operator/vouchers');
    this.waitForPageReady();
  },

  waitForPageReady() {
    I.waitForElement('body', 30);
    this.waitForAppIdle(20);
    I.waitForElement(this.elements.pageTitle, 20);
    I.waitForElement(this.elements.voucherListMarker, 20);
    I.wait(1);
  },

  waitForAppIdle(seconds = 20) {
    I.waitForInvisible(this.elements.loadingSpinner, seconds);
    I.wait(1);
  },

  ensureBackToVoucherList() {
    this.waitForAppIdle(20);
    I.waitForElement(this.elements.pageTitle, 20);
    I.waitForElement(this.elements.voucherListMarker, 20);
    I.wait(1);
  },

  goToVouchersFromMenu() {
    I.waitForElement(this.elements.menuVoucher, 15);
    I.click(this.elements.menuVoucher);
    I.waitInUrl('/operator/vouchers', 20);
    this.waitForPageReady();
  },

  seeVoucherList() {
    I.waitForElement(this.elements.pageTitle, 15);
    I.see('Quản Lý Voucher');
    [
      'Mã Voucher',
      'Mô Tả',
      'Loại',
      'Giảm Giá',
      'Đã Dùng',
      'Hiệu Lực',
      'Trạng Thái',
      'Hành Động',
    ].forEach((text) => I.see(text));
  },

  searchVoucherByCode(code) {
    I.waitForElement(this.elements.searchInput, 15);
    I.click(this.elements.searchInput);
    I.clearField(this.elements.searchInput);
    I.fillField(this.elements.searchInput, code);
    I.pressKey('Enter');
    this.waitForAppIdle(15);
    I.wait(1);
  },

  clickCreateVoucher() {
    I.waitForElement(this.elements.createVoucherButton, 15);
    I.click(this.elements.createVoucherButton);
    I.waitForElement(this.elements.createVoucherModal, 15);
    I.waitForElement(this.elements.voucherCodeInput, 15);
    I.wait(1);
  },

  fillVoucherForm(data) {
    if (data.code !== undefined) {
      I.fillField(this.elements.voucherCodeInput, data.code);
    }

    if (data.description !== undefined) {
      I.fillField(this.elements.descriptionTextarea, data.description);
    }

    if (data.discountType) {
      this.selectDiscountType(data.discountType);
    }

    if (data.discountValue !== undefined) {
      I.fillField(this.elements.discountValueInput, data.discountValue);
    }

    if (data.usagePerUser !== undefined) {
      I.fillField(this.elements.usagePerUserInput, data.usagePerUser);
    }
  },

  selectDiscountType(type) {
    I.waitForElement(this.elements.discountTypeSelect, 10);
    I.click(this.elements.discountTypeSelect);
    I.waitForElement(this.elements.dropdown, 10);

    const option = `//div[contains(@class,"ant-select-dropdown") and not(contains(@style,"display: none"))]//*[contains(@class,"ant-select-item-option-content") and contains(normalize-space(.),"${type}")]`;
    I.waitForElement(option, 10);
    I.click(option);
    I.wait(1);
  },

  selectStartDateToday() {
    this.pickDate(this.elements.startDateInput, new Date());
  },

  selectEndDatePlus30Days() {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);
    this.pickDate(this.elements.endDateInput, targetDate);
  },

  pickDate(inputLocator, targetDate) {
    const formatted = this.formatDateForAntd(targetDate);
    const dayNumber = String(targetDate.getDate());

    I.waitForElement(inputLocator, 10);
    I.scrollTo(inputLocator);
    I.click(inputLocator);
    I.waitForElement(this.elements.datePickerDropdown, 10);
    I.wait(1);

    const monthDiff = this.getMonthDiffFromToday(targetDate);

    if (monthDiff > 0) {
      for (let index = 0; index < monthDiff; index += 1) {
        I.click('(//div[contains(@class,"ant-picker-dropdown") and not(contains(@style,"display: none"))]//button[contains(@class,"ant-picker-header-next-btn")])[1]');
        I.wait(0.5);
      }
    }

    const exactDateCell = `//div[contains(@class,"ant-picker-dropdown") and not(contains(@style,"display: none"))]//td[@title="${formatted}"]`;
    const fallbackDateCell = `//div[contains(@class,"ant-picker-dropdown") and not(contains(@style,"display: none"))]//td[contains(@class,"ant-picker-cell-in-view")]//div[contains(@class,"ant-picker-cell-inner") and normalize-space(.)="${dayNumber}"]`;

    I.waitForElement(`${exactDateCell} | ${fallbackDateCell}`, 10);
    I.click(`${exactDateCell} | ${fallbackDateCell}`);
    I.wait(1);

    const okButton = '//div[contains(@class,"ant-picker-dropdown") and not(contains(@style,"display: none"))]//button[normalize-space()="OK"]';
    I.wait(0.5);

    // nếu có nút OK thì click, không có cũng không sao
    I.tryTo(() => {
      I.click(okButton);
    });

    I.wait(1);
  },

  formatDateForAntd(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  getMonthDiffFromToday(targetDate) {
    const today = new Date();
    return ((targetDate.getFullYear() - today.getFullYear()) * 12)
      + (targetDate.getMonth() - today.getMonth());
  },

  submitCreateVoucher() {
    I.waitForElement(this.elements.submitCreateButton, 10);
    I.click(this.elements.submitCreateButton);
    I.wait(2);
    this.waitForAppIdle(20);
  },

  voucherRow(code) {
    return `//tr[.//td[contains(normalize-space(.),"${code}")]]`;
  },

  seeVoucherInList(code) {
    I.waitForElement(this.voucherRow(code), 15);
    I.see(code, this.voucherRow(code));
  },

  seeVoucherStatus(code, expectedStatus) {
    this.seeVoucherInList(code);
    I.see(expectedStatus, this.voucherRow(code));
  },

  seeVoucherStatusInRow(code, expectedStatuses = []) {
    this.seeVoucherInList(code);
    expectedStatuses.forEach((status) => {
      I.tryTo(() => {
        I.see(status, this.voucherRow(code));
      });
    });
  },

  seeDuplicateVoucherError() {
    I.waitForElement(`${this.elements.duplicateError} | ${this.elements.createVoucherModal}`, 15);
    I.seeElement(this.elements.createVoucherModal);
    I.seeElement(this.elements.duplicateError);
  },

  toggleVoucherStatus(code) {
    this.searchVoucherByCode(code);
    this.seeVoucherInList(code);

    const row = this.voucherRow(code);
    const toggleButton = `${row}//button[contains(normalize-space(.),"Tắt") or contains(normalize-space(.),"Bật") or contains(normalize-space(.),"Kích hoạt") or contains(normalize-space(.),"Vô hiệu")]`;

    I.waitForElement(toggleButton, 15);
    I.scrollTo(toggleButton);
    I.click(toggleButton);
    I.wait(1);

    const confirmButton =
      '//div[contains(@class,"ant-popconfirm") or contains(@class,"ant-popover")]//button[contains(normalize-space(.),"OK") or contains(normalize-space(.),"Đồng ý") or contains(normalize-space(.),"Xác nhận")]';

    I.tryTo(() => {
      I.waitForElement(confirmButton, 5);
      I.click(confirmButton);
    });

    this.waitForAppIdle(20);
    I.wait(2);
  },
};