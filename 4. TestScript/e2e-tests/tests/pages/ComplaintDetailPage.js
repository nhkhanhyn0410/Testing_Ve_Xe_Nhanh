const { I } = inject();

module.exports = {

  elements: {
    ticketNumber: '//span[contains(@class,"ant-tag") and contains(@class,"blue")]',
    statusTag: '//span[contains(@class,"ant-tag")]',
    priorityTag: '//span[contains(@class,"ant-tag")]',
    subject: '//h4 | //div[contains(@class,"Title")]',
    description: '//div[contains(@style,"white-space")]',
    timeline: '.ant-timeline',
    notesList: '//div[contains(@class,"note") or contains(@class,"comment")]',
  },

  fields: {
    noteInput: '//textarea[contains(@placeholder,"ghi chú") or @id="note"]',
  },

  buttons: {
    sendNote: '//button[.//span[contains(@class,"SendOutlined")] or contains(.,"Gửi")]',
    rate: '//button[contains(.,"Đánh giá") or .//span[contains(@class,"StarOutlined")]]',
    back: '//button[.//span[contains(@class,"ArrowLeftOutlined")]]',
  },

  modal: {
    ratingModal: '.ant-modal',
    ratingStars: '.ant-rate',
    feedback: '.ant-modal textarea',
    submitRating: '.ant-modal .ant-btn-primary',
    closeModal: '.ant-modal-close',
  },

  messages: {
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open(complaintId) {
    I.amOnPage(`/complaints/${complaintId}`);
    I.waitForElement('body', 30);
    I.waitForInvisible('.ant-spin', 30);
    I.wait(3);
  },

  addNote(content) {
    I.fillField(this.fields.noteInput, content);
    I.click(this.buttons.sendNote);
    I.wait(3);
  },

  clickRate() {
    I.click(this.buttons.rate);
    I.waitForElement(this.modal.ratingModal, 10);
  },

  selectRating(stars) {
    for (let i = 0; i < stars; i++) {
      I.click(locate('.ant-rate-star').at(i + 1));
    }
  },

  fillFeedback(feedback) {
    I.fillField(this.modal.feedback, feedback);
  },

  submitRating() {
    I.click(this.modal.submitRating);
    I.wait(3);
  },

  rateComplaint(stars, feedback) {
    this.clickRate();
    this.selectRating(stars);
    if (feedback) this.fillFeedback(feedback);
    this.submitRating();
  },

  clickBack() {
    I.click(this.buttons.back);
    I.wait(2);
  },

  seeComplaintDetail() {
    I.seeElement(this.elements.ticketNumber);
    I.seeElement(this.elements.subject);
  },

  seeTimeline() {
    I.seeElement(this.elements.timeline);
  },

  seeNote(content) {
    I.see(content);
  },

  seeStatus(status) {
    I.see(status);
  },
};
