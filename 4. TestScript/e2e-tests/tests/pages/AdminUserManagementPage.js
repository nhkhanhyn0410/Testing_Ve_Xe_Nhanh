const { I } = inject();

module.exports = {

  elements: {
    usersTable: '.ant-table',
    tableRow: '.ant-table-row',
    searchInput: '//input[contains(@placeholder,"email") or contains(@placeholder,"tên") or contains(@placeholder,"SĐT")]',
    roleFilter: '.ant-select',
    blockFilter: '.ant-select',
  },

  buttons: {
    refresh: '//button[.//span[contains(@class,"ReloadOutlined")]]',
    viewDetails: '//button[.//span[contains(@class,"EyeOutlined")]]',
    blockUser: '//button[.//span[contains(@class,"LockOutlined")]]',
    unblockUser: '//button[.//span[contains(@class,"UnlockOutlined")]]',
    resetPassword: '//button[.//span[contains(@class,"KeyOutlined")]]',
  },

  modal: {
    detailModal: '.ant-modal',
    blockModal: '.ant-modal',
    resetPasswordModal: '.ant-modal',
    blockReason: '.ant-modal textarea',
    newPassword: '.ant-modal input[type="password"]',
    confirmAction: '.ant-modal .ant-btn-primary',
    closeModal: '.ant-modal-close',
  },

  messages: {
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open() {
    I.amOnPage('/admin/users');
    I.waitForElement(this.elements.usersTable, 30);
    I.waitForInvisible('.ant-spin', 30);
  },

  searchUser(keyword) {
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

  clickBlockUser(index, reason) {
    const btn = index
      ? locate(this.buttons.blockUser).at(index)
      : locate(this.buttons.blockUser).first();
    I.click(btn);
    I.waitForElement(this.modal.blockModal, 10);
    if (reason) I.fillField(this.modal.blockReason, reason);
    I.click(this.modal.confirmAction);
    I.wait(3);
  },

  clickUnblockUser(index) {
    const btn = index
      ? locate(this.buttons.unblockUser).at(index)
      : locate(this.buttons.unblockUser).first();
    I.click(btn);
    I.wait(1);
    I.click('//button[contains(.,"OK") or contains(.,"Xác nhận")]');
    I.wait(3);
  },

  clickResetPassword(index, newPassword) {
    const btn = index
      ? locate(this.buttons.resetPassword).at(index)
      : locate(this.buttons.resetPassword).first();
    I.click(btn);
    I.waitForElement(this.modal.resetPasswordModal, 10);
    if (newPassword) I.fillField(this.modal.newPassword, newPassword);
    I.click(this.modal.confirmAction);
    I.wait(3);
  },

  filterByRole(role) {
    I.click(locate(this.elements.roleFilter).first());
    I.wait(1);
    I.click(`//div[contains(@class,"ant-select-item") and contains(.,"${role}")]`);
    I.wait(2);
  },

  closeDetailModal() {
    I.click(this.modal.closeModal);
    I.wait(1);
  },

  seeUsersTable() {
    I.seeElement(this.elements.usersTable);
  },

  seeUser(name) {
    I.see(name);
  },

  seeDetailModal() {
    I.seeElement(this.modal.detailModal);
  },

  seeActionSuccess() {
    I.seeElement(this.messages.success);
  },
};
