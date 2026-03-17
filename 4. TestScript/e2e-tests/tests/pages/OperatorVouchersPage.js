const { I } = inject();

module.exports = {

  elements: {
    vouchersTable: '.ant-table',
    tableRow: '.ant-table-row',
    searchInput: '.ant-input-search input',
    statusFilter: '.ant-select',
    statsCards: '.ant-statistic',
  },

  buttons: {
    createVoucher: '//button[contains(.,"Tạo Voucher") or .//span[contains(@class,"PlusOutlined")]]',
    edit: '//button[.//span[contains(@class,"EditOutlined")]]',
    viewUsage: '//button[.//span[contains(@class,"EyeOutlined")]]',
    delete: '//button[contains(@class,"danger") or .//span[contains(@class,"DeleteOutlined")]]',
  },

  modal: {
    voucherModal: '.ant-modal',
    code: '.ant-modal #code',
    description: '.ant-modal #description',
    discountType: '.ant-modal .ant-select',
    discountValue: '.ant-modal #discountValue',
    maxDiscount: '.ant-modal #maxDiscount',
    minOrderValue: '.ant-modal #minOrderValue',
    maxUsagePerUser: '.ant-modal #maxUsagePerUser',
    maxTotalUsage: '.ant-modal #maxTotalUsage',
    isActive: '.ant-modal .ant-switch',
    validFrom: '.ant-modal .ant-picker:first-of-type',
    validUntil: '.ant-modal .ant-picker:last-of-type',
    submit: '.ant-modal .ant-btn-primary',
    cancel: '.ant-modal .ant-btn-default',
  },

  messages: {
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open() {
    I.amOnPage('/operator/vouchers');
    I.waitForElement(this.elements.vouchersTable, 30);
    I.waitForInvisible('.ant-spin', 30);
  },

  clickCreateVoucher() {
    I.click(this.buttons.createVoucher);
    I.waitForElement(this.modal.voucherModal, 10);
  },

  fillCode(code) {
    I.fillField(this.modal.code, code);
  },

  fillDescription(description) {
    I.fillField(this.modal.description, description);
  },

  fillDiscountValue(value) {
    I.fillField(this.modal.discountValue, value);
  },

  fillMaxUsagePerUser(value) {
    I.fillField(this.modal.maxUsagePerUser, value);
  },

  selectDiscountType(type) {
    I.click(locate(this.modal.discountType).first());
    I.wait(1);
    I.click(`//div[contains(@class,"ant-select-item") and contains(.,"${type}")]`);
    I.wait(1);
  },

  toggleActive() {
    I.click(this.modal.isActive);
    I.wait(1);
  },

  submitVoucher() {
    I.click(this.modal.submit);
    I.wait(3);
  },

  createVoucher(code, description, discountValue) {
    this.clickCreateVoucher();
    this.fillCode(code);
    this.fillDescription(description);
    this.fillDiscountValue(discountValue);
    this.submitVoucher();
  },

  clickEdit(index) {
    const btn = index
      ? locate(this.buttons.edit).at(index)
      : locate(this.buttons.edit).first();
    I.click(btn);
    I.waitForElement(this.modal.voucherModal, 10);
  },

  clickViewUsage(index) {
    const btn = index
      ? locate(this.buttons.viewUsage).at(index)
      : locate(this.buttons.viewUsage).first();
    I.click(btn);
    I.wait(2);
  },

  searchVoucher(keyword) {
    I.fillField(this.elements.searchInput, keyword);
    I.wait(2);
  },

  seeVouchersTable() {
    I.seeElement(this.elements.vouchersTable);
  },

  seeVoucher(code) {
    I.see(code);
  },

  seeCreateSuccess() {
    I.seeElement(this.messages.success);
  },

  seeStatistics() {
    I.seeElement(this.elements.statsCards);
  },
};
