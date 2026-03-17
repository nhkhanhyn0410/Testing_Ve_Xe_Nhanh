const { I } = inject();

module.exports = {

  elements: {
    complaintsTable: '.ant-table',
    tableRow: '.ant-table-row',
    searchInput: '//input[contains(@placeholder,"mã ticket") or contains(@placeholder,"tiêu đề")]',
    statusFilter: '.ant-select',
    priorityFilter: '.ant-select',
    categoryFilter: '.ant-select',
  },

  buttons: {
    refresh: '//button[.//span[contains(@class,"ReloadOutlined")]]',
    viewDetails: '//button[.//span[contains(@class,"EyeOutlined")]]',
    resolve: '//button[.//span[contains(@class,"CheckOutlined")]]',
  },

  modal: {
    detailModal: '.ant-modal',
    resolveModal: '.ant-modal',
    resolution: '.ant-modal textarea',
    noteInput: '.ant-modal textarea',
    confirmAction: '.ant-modal .ant-btn-primary',
    closeModal: '.ant-modal-close',
  },

  messages: {
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open() {
    I.amOnPage('/admin/complaints');
    I.waitForElement(this.elements.complaintsTable, 30);
    I.waitForInvisible('.ant-spin', 30);
  },

  searchComplaint(keyword) {
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

  clickResolve(index) {
    const btn = index
      ? locate(this.buttons.resolve).at(index)
      : locate(this.buttons.resolve).first();
    I.click(btn);
    I.waitForElement(this.modal.resolveModal, 10);
  },

  fillResolution(resolution) {
    I.fillField(this.modal.resolution, resolution);
  },

  confirmResolve() {
    I.click(this.modal.confirmAction);
    I.wait(3);
  },

  resolveComplaint(index, resolution) {
    this.clickResolve(index);
    this.fillResolution(resolution);
    this.confirmResolve();
  },

  filterByStatus(status) {
    I.click(locate(this.elements.statusFilter).first());
    I.wait(1);
    I.click(`//div[contains(@class,"ant-select-item") and contains(.,"${status}")]`);
    I.wait(2);
  },

  filterByPriority(priority) {
    I.click(locate(this.elements.priorityFilter).at(2));
    I.wait(1);
    I.click(`//div[contains(@class,"ant-select-item") and contains(.,"${priority}")]`);
    I.wait(2);
  },

  closeDetailModal() {
    I.click(this.modal.closeModal);
    I.wait(1);
  },

  seeComplaintsTable() {
    I.seeElement(this.elements.complaintsTable);
  },

  seeComplaint(ticketNumber) {
    I.see(ticketNumber);
  },

  seeDetailModal() {
    I.seeElement(this.modal.detailModal);
  },

  seeActionSuccess() {
    I.seeElement(this.messages.success);
  },
};
