const { I } = inject();

module.exports = {

  elements: {
    currentTier: '//span[contains(@class,"ant-tag")]',
    totalPoints: '//div[contains(.,"điểm")]//span[contains(@class,"ant-statistic-content-value")]',
    progressBar: '//div[contains(@class,"progress")]',
    tierRoadmap: '//div[contains(@class,"tier") or contains(@class,"roadmap")]',
    benefitsList: '//ul | //div[contains(@class,"benefit")]',
  },

  buttons: {
    redeemPoints: '//button[contains(.,"Đổi điểm") or .//span[contains(@class,"GiftOutlined")]]',
    viewHistory: '//button[contains(.,"Lịch sử") or .//span[contains(@class,"HistoryOutlined")]]',
    back: '//button[.//span[contains(@class,"ArrowLeftOutlined")]]',
  },

  modal: {
    redeemModal: '.ant-modal',
    submitRedeem: '.ant-modal .ant-btn-primary',
    closeModal: '.ant-modal-close',
  },

  // Loyalty History elements
  history: {
    typeFilter: '.ant-select',
    timeline: '.ant-timeline',
    historyEntry: '.ant-timeline-item',
    pagination: '.ant-pagination',
  },

  messages: {
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open() {
    I.amOnPage('/loyalty');
    I.waitForElement('body', 30);
    I.waitForInvisible('.ant-spin', 30);
    I.wait(3);
  },

  openHistory() {
    I.amOnPage('/loyalty/history');
    I.waitForElement('body', 30);
    I.waitForInvisible('.ant-spin', 30);
    I.wait(3);
  },

  clickRedeemPoints() {
    I.click(this.buttons.redeemPoints);
    I.waitForElement(this.modal.redeemModal, 10);
  },

  clickViewHistory() {
    I.click(this.buttons.viewHistory);
    I.wait(3);
  },

  filterHistoryByType(type) {
    I.click(this.history.typeFilter);
    I.wait(1);
    I.click(`//div[contains(@class,"ant-select-item") and contains(.,"${type}")]`);
    I.wait(2);
  },

  seeLoyaltyOverview() {
    I.seeElement(this.elements.totalPoints);
  },

  seeTier(tierName) {
    I.see(tierName);
  },

  seePoints() {
    I.seeElement(this.elements.totalPoints);
  },

  seeProgressBar() {
    I.seeElement(this.elements.progressBar);
  },

  seeHistoryTimeline() {
    I.seeElement(this.history.timeline);
  },

  seeHistoryEntry() {
    I.seeElement(this.history.historyEntry);
  },
};
