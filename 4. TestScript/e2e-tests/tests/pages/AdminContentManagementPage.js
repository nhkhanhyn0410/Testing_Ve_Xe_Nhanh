const { I } = inject();

module.exports = {

  elements: {
    tabs: '.ant-tabs',
    bannerTab: '//div[contains(@class,"ant-tabs-tab") and contains(.,"Banner")]',
    blogTab: '//div[contains(@class,"ant-tabs-tab") and contains(.,"Blog")]',
    faqTab: '//div[contains(@class,"ant-tabs-tab") and contains(.,"FAQ")]',
    contentTable: '.ant-table',
    contentCard: '.ant-card',
  },

  buttons: {
    createBanner: '//button[contains(.,"Thêm Banner") or contains(.,"Tạo Banner")]',
    createBlog: '//button[contains(.,"Thêm Blog") or contains(.,"Tạo Blog")]',
    createFAQ: '//button[contains(.,"Thêm FAQ") or contains(.,"Tạo FAQ")]',
    edit: '//button[.//span[contains(@class,"EditOutlined")]]',
    delete: '//button[contains(@class,"danger") or .//span[contains(@class,"DeleteOutlined")]]',
  },

  modal: {
    contentModal: '.ant-modal',
    title: '.ant-modal #title',
    content: '.ant-modal textarea',
    question: '.ant-modal #question',
    answer: '.ant-modal #answer',
    submit: '.ant-modal .ant-btn-primary',
    cancel: '.ant-modal .ant-btn-default',
    closeModal: '.ant-modal-close',
  },

  messages: {
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open() {
    I.amOnPage('/admin/content');
    I.waitForElement(this.elements.tabs, 30);
    I.waitForInvisible('.ant-spin', 30);
    I.wait(3);
  },

  switchToBanners() {
    I.click(this.elements.bannerTab);
    I.wait(2);
  },

  switchToBlogs() {
    I.click(this.elements.blogTab);
    I.wait(2);
  },

  switchToFAQs() {
    I.click(this.elements.faqTab);
    I.wait(2);
  },

  clickCreateBanner() {
    I.click(this.buttons.createBanner);
    I.waitForElement(this.modal.contentModal, 10);
  },

  clickCreateBlog() {
    I.click(this.buttons.createBlog);
    I.waitForElement(this.modal.contentModal, 10);
  },

  clickCreateFAQ() {
    I.click(this.buttons.createFAQ);
    I.waitForElement(this.modal.contentModal, 10);
  },

  fillTitle(title) {
    I.fillField(this.modal.title, title);
  },

  fillContent(content) {
    I.fillField(this.modal.content, content);
  },

  fillQuestion(question) {
    I.fillField(this.modal.question, question);
  },

  fillAnswer(answer) {
    I.fillField(this.modal.answer, answer);
  },

  submitContent() {
    I.click(this.modal.submit);
    I.wait(3);
  },

  clickEdit(index) {
    const btn = index
      ? locate(this.buttons.edit).at(index)
      : locate(this.buttons.edit).first();
    I.click(btn);
    I.waitForElement(this.modal.contentModal, 10);
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

  seeContentPage() {
    I.seeElement(this.elements.tabs);
  },

  seeBannersTab() {
    I.seeElement(this.elements.bannerTab);
  },

  seeBlogsTab() {
    I.seeElement(this.elements.blogTab);
  },

  seeFAQsTab() {
    I.seeElement(this.elements.faqTab);
  },

  seeContentItem(title) {
    I.see(title);
  },

  seeCreateSuccess() {
    I.seeElement(this.messages.success);
  },
};
