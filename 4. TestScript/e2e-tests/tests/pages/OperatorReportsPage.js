const { I } = inject();

module.exports = {
  elements: {
    pageHeading: '//*[contains(normalize-space(.),"Báo Cáo Doanh Thu") or contains(normalize-space(.),"Báo cáo doanh thu")]',
    statsCards: '.ant-statistic, .ant-card .ant-statistic, .ant-card',
    totalRevenueCard: '//*[contains(normalize-space(.),"Tổng Doanh Thu")]',
    totalTransactionsCard: '//*[contains(normalize-space(.),"Số Giao Dịch")]',
    revenueChartSection: '//*[contains(normalize-space(.),"Xu Hướng Doanh Thu")]',
    revenueChartCanvas:
      '//*[contains(normalize-space(.),"Xu Hướng Doanh Thu")]/ancestor::div[contains(@class,"ant-card")][1]//*[name()="svg" or contains(@class,"recharts-wrapper") or contains(@class,"recharts-responsive-container")]',
    cancellationStatsSection: '//*[contains(normalize-space(.),"Thống Kê Hủy Vé")]',
    totalCancelledText: '//*[contains(normalize-space(.),"Tổng Hủy")]',
    cancellationByRouteText: '//*[contains(normalize-space(.),"Hủy Theo Tuyến")]',
    loadingSpinner: '.ant-spin-spinning',
    sideMenuReports: '//a[@href="/operator/reports"] | //span[contains(normalize-space(.),"Báo Cáo")] | //span[contains(normalize-space(.),"Báo cáo")]',
  },

  open() {
    I.amOnPage('/operator/reports');
    this.waitForPageReady();
  },

  waitForPageReady() {
    I.waitForElement('body', 30);
    I.waitForInvisible(this.elements.loadingSpinner, 10);
    I.waitForElement(this.elements.pageHeading, 20);
    I.wait(1);
  },

  goToReportsFromMenu() {
    I.waitForElement(this.elements.sideMenuReports, 15);
    I.click(this.elements.sideMenuReports);
    I.wait(2);
    I.seeInCurrentUrl('/operator/reports');
    this.waitForPageReady();
  },

  seeReportsPage() {
    I.waitForElement(this.elements.pageHeading, 15);
    I.see('Báo Cáo Doanh Thu');
    I.seeElement(this.elements.statsCards);
  },

  seeSummaryStatistics() {
    I.waitForElement(this.elements.totalRevenueCard, 15);
    I.waitForElement(this.elements.totalTransactionsCard, 15);
    I.see('Tổng Doanh Thu');
    I.see('Số Giao Dịch');
  },

  seeRevenueChart() {
    I.waitForElement(this.elements.revenueChartSection, 15);
    I.see('Xu Hướng Doanh Thu');
    I.waitForElement(this.elements.revenueChartCanvas, 15);
    I.seeElement(this.elements.revenueChartCanvas);
  },

  seeCancellationStatistics() {
    I.waitForElement(this.elements.cancellationStatsSection, 15);
    I.see('Thống Kê Hủy Vé');
    I.waitForElement(this.elements.totalCancelledText, 15);
    I.waitForElement(this.elements.cancellationByRouteText, 15);
    I.see('Tổng Hủy');
    I.see('Hủy Theo Tuyến');
  },
};