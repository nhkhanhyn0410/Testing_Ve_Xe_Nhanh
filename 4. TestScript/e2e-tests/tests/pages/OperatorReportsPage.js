const { I } = inject();

module.exports = {
  elements: {
    loadingSpinner: '.ant-spin-spinning',
    sideMenuReports:
      '//a[@href="/operator/reports"] | //a[contains(@href,"reports")] | //span[contains(normalize-space(.),"Báo Cáo")] | //span[contains(normalize-space(.),"Báo cáo")]',
    statsCards: '.ant-statistic, .ant-card .ant-statistic, .ant-card',
  },

  open() {
    this.goToReportsFromMenu();
  },

  waitForPageReady() {
    I.waitForElement('body', 30);
    I.waitForInvisible(this.elements.loadingSpinner, 10);
    I.wait(2);
    I.seeInCurrentUrl('/operator/reports');
    I.waitForText('Báo Cáo Doanh Thu', 20);
  },

  goToReportsFromMenu() {
    I.waitForElement(this.elements.sideMenuReports, 15);
    I.click(this.elements.sideMenuReports);
    this.waitForPageReady();
  },

  seeReportsPage() {
    I.seeInCurrentUrl('/operator/reports');
    I.see('Báo Cáo Doanh Thu');
  },

  seeSummaryStatistics() {
    I.waitForElement(this.elements.statsCards, 15);
    I.seeElement(this.elements.statsCards);
  },

  seeRevenueChart() {
    I.seeInCurrentUrl('/operator/reports');
    I.see('Báo Cáo Doanh Thu');
  },

  seeCancellationStatistics() {
    I.seeInCurrentUrl('/operator/reports');
    I.see('Báo Cáo Doanh Thu');
  },
};