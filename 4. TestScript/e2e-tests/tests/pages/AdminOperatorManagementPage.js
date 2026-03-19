const { I } = inject();

module.exports = {

  elements: {
    operatorsTable: '.ant-table',
    tableRow: '.ant-table-row',
    searchInput: '//input[contains(@placeholder,"tên nhà xe") or contains(@placeholder,"email")]',
    statusFilter: '.ant-select',
    detailModal: '.ant-modal',
  },

  buttons: {
    refresh: '//button[.//span[contains(@class,"anticon-reload")]]',
    viewDetails: '//button[.//span[contains(@class,"anticon-eye")]]',
    approve: '//button[.//span[contains(@class,"anticon-check")]]',
    reject: '//button[.//span[contains(@class,"anticon-close")]]',
    suspend: '//button[.//span[contains(@class,"anticon-stop")]]',
    resume: '//button[.//span[contains(@class,"anticon-play-circle")]]',
  },

  modal: {
    detailModal: '.ant-modal',
    rejectModal: '.ant-modal',
    suspendModal: '.ant-modal',
    reason: '.ant-modal textarea',
    confirmAction: '.ant-modal .ant-btn-primary',
    closeModal: '.ant-modal-close',
  },

  messages: {
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open() {
    I.amOnPage('/admin/operators');
    I.waitForElement(this.elements.operatorsTable, 30);
    I.waitForInvisible('.ant-spin', 30);
  },

  searchOperator(keyword) {
    I.fillField(this.elements.searchInput, keyword);
    I.wait(2);
  },

  clickViewDetails(index) {
    const btn = index
      ? locate(this.buttons.viewDetails).at(index)
      : locate(this.buttons.viewDetails).first();
    I.click(btn);
    I.waitForElement(this.modal.detailModal, 10);
  },

  // Duyệt nhà xe: Modal.confirm → okText: "Duyệt"
  clickApprove(index) {
    const btn = index
      ? locate(this.buttons.approve).at(index)
      : locate(this.buttons.approve).first();
    I.click(btn);
    I.waitForElement('.ant-modal-confirm', 10);
    I.wait(1);
    I.click('//div[contains(@class,"ant-modal-confirm")]//button[contains(.,"Duyệt")]');
    I.wait(3);
  },

  // Từ chối nhà xe: Modal thường → okText: "Từ Chối"
  clickReject(index, reason) {
    const btn = index
      ? locate(this.buttons.reject).at(index)
      : locate(this.buttons.reject).first();
    I.click(btn);
    I.waitForElement(this.modal.rejectModal, 10);
    I.wait(1);
    if (reason) I.fillField(this.modal.reason, reason);
    I.click(this.modal.confirmAction);
    I.wait(3);
  },

  // Tạm ngưng nhà xe: Modal thường → okText: "Tạm Ngưng"
  clickSuspend(index, reason) {
    const btn = index
      ? locate(this.buttons.suspend).at(index)
      : locate(this.buttons.suspend).first();
    I.click(btn);
    I.waitForElement(this.modal.suspendModal, 10);
    I.wait(1);
    if (reason) I.fillField(this.modal.reason, reason);
    I.click(this.modal.confirmAction);
    I.wait(3);
  },

  // Khôi phục nhà xe: Modal.confirm → okText: "Khôi Phục"
  clickResume(index) {
    const btn = index
      ? locate(this.buttons.resume).at(index)
      : locate(this.buttons.resume).first();
    I.click(btn);
    I.waitForElement('.ant-modal-confirm', 10);
    I.wait(1);
    I.click('//div[contains(@class,"ant-modal-confirm")]//button[contains(.,"Khôi Phục")]');
    I.wait(3);
  },

  closeDetailModal() {
    I.click(this.modal.closeModal);
    I.wait(1);
  },

  seeOperatorsTable() {
    I.seeElement(this.elements.operatorsTable);
  },

  seeOperator(name) {
    I.see(name);
  },

  seeDetailModal() {
    I.seeElement(this.modal.detailModal);
  },

  seeActionSuccess() {
    I.waitForElement(this.messages.success, 10);
  },
};
