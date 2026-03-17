const { I } = inject();

module.exports = {

  elements: {
    complaintCard: '.ant-card',
    statusFilter: '//div[contains(@class,"ant-select")][1]',
    categoryFilter: '//div[contains(@class,"ant-select")][2]',
    pagination: '.ant-pagination',
    statsTotal: '//div[contains(.,"Tổng")]//span[contains(@class,"ant-statistic-content-value")]',
  },

  buttons: {
    createNew: '//button[contains(.,"Tạo") or .//span[contains(@class,"PlusOutlined")]]',
    clearFilters: '//button[contains(.,"Xóa bộ lọc") or contains(.,"Clear")]',
    viewDetail: '//button[contains(.,"Chi tiết") or .//span[contains(@class,"EyeOutlined")]]',
    back: '//button[.//span[contains(@class,"ArrowLeftOutlined")]]',
  },

  modal: {
    createModal: '.ant-modal',
    subject: '.ant-modal #subject',
    category: '.ant-modal .ant-select',
    description: '.ant-modal textarea',
    submitComplaint: '.ant-modal .ant-btn-primary',
    closeModal: '.ant-modal-close',
  },

  messages: {
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open() {
    I.amOnPage('/complaints');
    I.waitForElement('body', 30);
    I.waitForInvisible('.ant-spin', 30);
    I.wait(3);
  },

  clickCreateNew() {
    I.click(this.buttons.createNew);
    I.waitForElement(this.modal.createModal, 10);
  },

  fillSubject(subject) {
    I.fillField(this.modal.subject, subject);
  },

  fillDescription(description) {
    I.fillField(this.modal.description, description);
  },

  selectCategory(category) {
    I.click(this.modal.category);
    I.wait(1);
    I.click(`//div[contains(@class,"ant-select-item") and contains(.,"${category}")]`);
    I.wait(1);
  },

  submitComplaint() {
    I.click(this.modal.submitComplaint);
    I.wait(3);
  },

  createComplaint(subject, category, description) {
    this.clickCreateNew();
    this.fillSubject(subject);
    if (category) this.selectCategory(category);
    this.fillDescription(description);
    this.submitComplaint();
  },

  clickViewDetail(index) {
    const btn = index
      ? locate(this.buttons.viewDetail).at(index)
      : locate(this.buttons.viewDetail).first();
    I.click(btn);
    I.wait(3);
  },

  filterByStatus(status) {
    I.click(this.elements.statusFilter);
    I.wait(1);
    I.click(`//div[contains(@class,"ant-select-item") and contains(.,"${status}")]`);
    I.wait(2);
  },

  seeComplaintList() {
    I.seeElement(this.elements.complaintCard);
  },

  seeComplaintWithSubject(subject) {
    I.see(subject);
  },

  seeStatistics() {
    I.seeElement(this.elements.statsTotal);
  },
};
