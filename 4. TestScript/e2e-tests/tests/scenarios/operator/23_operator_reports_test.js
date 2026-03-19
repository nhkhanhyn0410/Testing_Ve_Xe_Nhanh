const users = require('../../data/users.json');

Feature('Operator Reports - Xem báo cáo doanh thu và thống kê');

const operator = users.operator.valid;

Before(({ I, operatorLoginPage }) => {
  I.clearCookie();
  operatorLoginPage.open();
  operatorLoginPage.login(operator.email, operator.password);

  I.waitForElement('body', 30);
  I.waitForInvisible('.ant-spin-spinning', 10);
  I.wait(2);
  I.seeInCurrentUrl('/operator');
});

Scenario('TC_OP_RPT_001: Hiển thị trang báo cáo doanh thu', ({ I, operatorReportsPage }) => {
  operatorReportsPage.goToReportsFromMenu();
  operatorReportsPage.seeReportsPage();
  operatorReportsPage.seeSummaryStatistics();

  I.saveScreenshot('TC_OP_RPT_001_reports_overview.png');
});

Scenario('TC_OP_RPT_002: Xem biểu đồ doanh thu', ({ I, operatorReportsPage }) => {
  operatorReportsPage.open();
  operatorReportsPage.seeRevenueChart();

  I.saveScreenshot('TC_OP_RPT_002_revenue_chart.png');
});

Scenario('TC_OP_RPT_003: Xem thống kê hủy vé', ({ I, operatorReportsPage }) => {
  operatorReportsPage.open();
  operatorReportsPage.seeCancellationStatistics();

  I.saveScreenshot('TC_OP_RPT_003_cancellation_statistics.png');
});