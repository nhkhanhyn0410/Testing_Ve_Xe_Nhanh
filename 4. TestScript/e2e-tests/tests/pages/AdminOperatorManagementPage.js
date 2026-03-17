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
    refresh: '//button[.//span[contains(@class,"ReloadOutlined")]]',
    viewDetails: '//button[.//span[contains(@class,"EyeOutlined")]]',
    approve: '//button[.//span[contains(@class,"CheckOutlined")]]',
    reject: '//button[contains(@class,"danger") and .//span[contains(@class,"CloseOutlined")]]',
    suspend: '//button[contains(@class,"danger") and .//span[contains(@class,"StopOutlined")]]',
    unsuspend: '//button[contains(.,"Mở khóa") or .//span[contains(@class,"UnlockOutlined")]]',
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

  clickRefresh() {
    I.click(this.buttons.refresh);
    I.wait(3);
  },

  clickViewDetails(index) {
    const btn = index
      ? locate(this.buttons.viewDetails).at(index)
      : locate(this.buttons.viewDetails).first();
    I.click(btn);
    I.waitForElement(this.modal.detailModal, 10);
  },

  clickApprove(index) {
    const btn = index
      ? locate(this.buttons.approve).at(index)
      : locate(this.buttons.approve).first();
    I.click(btn);
    I.wait(1);
    I.click('//button[contains(.,"OK") or contains(.,"Xác nhận")]');
    I.wait(3);
  },

  clickReject(index, reason) {
    const btn = index
      ? locate(this.buttons.reject).at(index)
      : locate(this.buttons.reject).first();
    I.click(btn);
    I.waitForElement(this.modal.rejectModal, 10);
    if (reason) I.fillField(this.modal.reason, reason);
    I.click(this.modal.confirmAction);
    I.wait(3);
  },

  clickSuspend(index, reason) {
    const btn = index
      ? locate(this.buttons.suspend).at(index)
      : locate(this.buttons.suspend).first();
    I.click(btn);
    I.waitForElement(this.modal.suspendModal, 10);
    if (reason) I.fillField(this.modal.reason, reason);
    I.click(this.modal.confirmAction);
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
    I.seeElement(this.messages.success);
  },
};
