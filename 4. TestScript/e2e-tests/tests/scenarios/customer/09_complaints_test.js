const users = require("../../data/users.json");

Feature("Customer Complaints - Khiếu nại");

Before(({ I }) => {
  I.amOnPage("/");
  I.waitForElement("body", 30);
  I.clearCookie();
});

function loginAsSeedCustomer(I, loginPage) {
  const customer = users.customer.seed;
  loginPage.open();
  loginPage.login(customer.email, customer.password);
  I.wait(5);
}

Scenario(
  "TC_CMP_001: Hiển thị trang tạo khiếu nại",
  ({ I, loginPage, complaintsPage }) => {
    loginAsSeedCustomer(I, loginPage);
    complaintsPage.open();
    complaintsPage.clickCreateNew();
    I.see("Khiếu nại");
    I.see("Tiêu đề");
    I.see("Mô tả");
    I.saveScreenshot("TC_CMP_001_create_complaint_page.png");
  },
);

Scenario(
  "TC_CMP_002: Tạo khiếu nại thành công",
  ({ I, loginPage, complaintsPage }) => {
    loginAsSeedCustomer(I, loginPage);
    complaintsPage.open();
    complaintsPage.createComplaint(
      "Xe khởi hành trễ",
      "Dịch vụ",
      "Xe trễ khoảng 30 phút, ảnh hưởng lịch trình.",
    );
    I.wait(3);
    I.saveScreenshot("TC_CMP_002_create_complaint_success.png");
  },
);

Scenario(
  "TC_CMP_003: Tạo khiếu nại với trường bắt buộc trống",
  ({ I, loginPage, complaintsPage }) => {
    loginAsSeedCustomer(I, loginPage);
    complaintsPage.open();
    complaintsPage.clickCreateNew();
    complaintsPage.fillDescription("Không nhập tiêu đề để kiểm tra validation");
    complaintsPage.submitComplaint();
    I.wait(2);
    I.see("Vui lòng nhập tiêu đề");
    I.saveScreenshot("TC_CMP_003_empty_required_field.png");
  },
);

Scenario(
  "TC_CMP_004: Xem danh sách khiếu nại đã tạo",
  ({ I, loginPage, complaintsPage }) => {
    loginAsSeedCustomer(I, loginPage);
    complaintsPage.open();
    complaintsPage.seeComplaintList();
    complaintsPage.seeStatistics();
    I.saveScreenshot("TC_CMP_004_complaint_list.png");
  },
);

Scenario(
  "TC_CMP_005: Xem chi tiết khiếu nại",
  ({ I, loginPage, complaintsPage, complaintDetailPage }) => {
    loginAsSeedCustomer(I, loginPage);
    complaintsPage.open();
    complaintsPage.clickViewDetail(1);
    complaintDetailPage.seeComplaintDetail();
    complaintDetailPage.seeTimeline();
    I.saveScreenshot("TC_CMP_005_complaint_detail.png");
  },
);

Scenario(
  "TC_CMP_006: Đánh giá mức độ hài lòng sau khi khiếu nại được giải quyết",
  ({ I, loginPage, complaintsPage, complaintDetailPage }) => {
    loginAsSeedCustomer(I, loginPage);
    complaintsPage.open();
    complaintsPage.clickViewDetail(1);
    complaintDetailPage.rateComplaint(
      5,
      "Hài lòng với cách hỗ trợ và xử lý khiếu nại.",
    );
    I.wait(3);
    I.saveScreenshot("TC_CMP_006_rate_resolved_complaint.png");
  },
);
