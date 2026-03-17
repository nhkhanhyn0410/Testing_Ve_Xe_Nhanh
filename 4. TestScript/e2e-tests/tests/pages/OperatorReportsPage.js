const { I } = inject();

module.exports = {

  elements: {
    revenueChart: '//div[contains(@class,"recharts") or contains(@class,"chart")]',
    topRoutesTable: '.ant-table',
    statsCards: '.ant-statistic',
    dateRangePicker: '.ant-picker-range',
    routeFilter: '//div[contains(@class,"ant-select")]',
  },

  buttons: {
    exportExcel: '//button[.//span[contains(@class,"FileExcelOutlined")] or contains(.,"Excel")]',
    exportPDF: '//button[.//span[contains(@class,"FilePdfOutlined")] or contains(.,"PDF")]',
  },

  messages: {
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open() {
    I.amOnPage('/operator/reports');
    I.waitForElement('body', 30);
    I.waitForInvisible('.ant-spin', 30);
    I.wait(3);
  },

  selectDateRange(startDate, endDate) {
    I.click(this.elements.dateRangePicker);
    I.wait(1);
    I.fillField(locate('.ant-picker-input input').first(), startDate);
    I.fillField(locate('.ant-picker-input input').last(), endDate);
    I.pressKey('Enter');
    I.wait(3);
  },

  filterByRoute(routeName) {
    I.click(this.elements.routeFilter);
    I.wait(1);
    I.click(`//div[contains(@class,"ant-select-item") and contains(.,"${routeName}")]`);
    I.wait(3);
  },

  clickExportExcel() {
    I.click(this.buttons.exportExcel);
    I.wait(3);
  },

  clickExportPDF() {
    I.click(this.buttons.exportPDF);
    I.wait(3);
  },

  seeReportsPage() {
    I.seeElement(this.elements.statsCards);
  },

  seeRevenueChart() {
    I.seeElement(this.elements.revenueChart);
  },

  seeTopRoutesTable() {
    I.seeElement(this.elements.topRoutesTable);
  },

  seeStatistics() {
    I.seeElement(this.elements.statsCards);
  },
};
