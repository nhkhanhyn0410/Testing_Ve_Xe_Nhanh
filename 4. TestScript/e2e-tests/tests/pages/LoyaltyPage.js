const { I } = inject();

module.exports = {
  elements: {
    totalPoints: '//div[contains(.,"điểm") or contains(.,"Điểm")]',
    tierTag: '//span[contains(@class,"ant-tag")]',
    benefitsArea:
      '//div[contains(@class,"benefit") or contains(.,"Quyền lợi") or contains(.,"Đặc quyền")]',
    loyaltyProgramText:
      '//*[contains(.,"Loyalty program") or contains(.,"Loyalty Program") or contains(.,"Điểm thưởng") or contains(.,"Diem thuong")]',
  },

  tabs: {
    history:
      '//button[contains(.,"Lịch sử") or contains(.,"Lich su") or contains(.,"History")]',
    redeem:
      '//button[contains(.,"Đổi điểm") or contains(.,"Doi diem") or contains(.,"Đổi")]',
  },

  links: {
    loyaltyFromProfile:
      '//a[contains(@href,"/loyalty") or contains(.,"Loyalty program") or contains(.,"Điểm thưởng") or contains(.,"Diem thuong")]',
  },

  modal: {
    redeemModal: ".ant-modal",
    submitRedeem: ".ant-modal .ant-btn-primary",
  },

  history: {
    timeline: ".ant-timeline, .ant-table",
    historyEntry: ".ant-timeline-item, .ant-table-row",
  },

  messages: {
    success: ".ant-message-success",
    error: ".ant-message-error",
    insufficient: "không đủ điểm",
  },

  openFromProfileMenu() {
    I.amOnPage("/profile");
    I.waitInUrl("/profile", 30);
    I.waitForElement("body", 30);
    I.waitForElement(this.elements.loyaltyProgramText, 30);
    I.see("Loyalty");
    I.click(this.links.loyaltyFromProfile);
    I.waitInUrl("/loyalty", 30);
    I.waitForElement("body", 30);
    I.wait(2);
  },

  openHistoryTab() {
    I.click(this.tabs.history);
    I.wait(2);
  },

  openRedeemTab() {
    I.click(this.tabs.redeem);
    I.wait(2);
  },

  seeLoyaltyOverview() {
    I.seeElement(this.elements.totalPoints);
    I.seeElement(this.elements.tierTag);
  },

  seeHistoryTimeline() {
    I.seeElement(this.history.timeline);
  },

  seeTierBenefits() {
    I.seeElement(this.elements.benefitsArea);
  },

  selectFirstVoucherAndRedeem() {
    I.click('//button[contains(.,"Đổi") or contains(.,"Redeem")][1]');
    I.waitForElement(this.modal.redeemModal, 10);
    I.click(this.modal.submitRedeem);
    I.wait(2);
  },

  selectHighestCostVoucher() {
    I.click('(//button[contains(.,"Đổi") or contains(.,"Redeem")])[last()]');
    I.waitForElement(this.modal.redeemModal, 10);
  },

  confirmRedeem() {
    I.click(this.modal.submitRedeem);
    I.wait(2);
  },

  seeRedeemResult() {
    I.wait(2);
    I.seeElement(`${this.messages.success}, ${this.messages.error}`);
  },

  seeInsufficientPointsMessage() {
    I.wait(2);
    I.see(this.messages.insufficient);
  },
};
