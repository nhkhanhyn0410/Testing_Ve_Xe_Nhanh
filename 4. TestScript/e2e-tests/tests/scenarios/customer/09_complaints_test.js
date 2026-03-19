const users = require('../../data/users.json');

Feature('Customer: Quản lý khiếu nại (STT 9)');

const customer = users.customer.valid;

// Helper: Login customer → vào trang khiếu nại
async function loginAndGoToComplaints(I, loginPage, complaintsPage) {
  loginPage.open();
  loginPage.login(customer.email, customer.password);
  I.wait(15);
  I.dontSeeInCurrentUrl('/login');
  complaintsPage.open();
}

Before(({ I }) => {
  I.clearCookie();
});

// ========================================================================================
// TC_CMP_001: Hiển thị danh sách khiếu nại
// ========================================================================================
Scenario('TC_CMP_001: Hiển thị danh sách khiếu nại',
  async ({ I, loginPage, complaintsPage }) => {
    await loginAndGoToComplaints(I, loginPage, complaintsPage);

    complaintsPage.seeComplaintList();
    I.saveScreenshot('TC_CMP_001_complaints_list.png');
  }
);

// ========================================================================================
// TC_CMP_002: Tạo khiếu nại mới thành công
// ========================================================================================
Scenario('TC_CMP_002: Tạo khiếu nại mới thành công',
  async ({ I, loginPage, complaintsPage }) => {
    await loginAndGoToComplaints(I, loginPage, complaintsPage);

    const subject = 'Khiếu nại test ' + Date.now();
    complaintsPage.createComplaint(subject, 'Dịch vụ', 'Mô tả khiếu nại tự động từ e2e test');

    I.waitForElement(complaintsPage.messages.success, 10);
    I.saveScreenshot('TC_CMP_002_create_success.png');
  }
);

// ========================================================================================
// TC_CMP_003: Tạo khiếu nại thiếu thông tin → lỗi
// ========================================================================================
Scenario('TC_CMP_003: Tạo khiếu nại thiếu thông tin',
  async ({ I, loginPage, complaintsPage }) => {
    await loginAndGoToComplaints(I, loginPage, complaintsPage);

    complaintsPage.clickCreateNew();
    // Không điền gì, submit trực tiếp
    complaintsPage.submitComplaint();

    I.wait(2);
    I.saveScreenshot('TC_CMP_003_empty_fields.png');
  }
);

// ========================================================================================
// TC_CMP_004: Xem chi tiết khiếu nại
// ========================================================================================
Scenario('TC_CMP_004: Xem chi tiết khiếu nại',
  async ({ I, loginPage, complaintsPage, complaintDetailPage }) => {
    await loginAndGoToComplaints(I, loginPage, complaintsPage);

    complaintsPage.clickViewDetail();
    complaintDetailPage.seeComplaintDetail();
    I.saveScreenshot('TC_CMP_004_complaint_detail.png');
  }
);

// ========================================================================================
// TC_CMP_005: Lọc khiếu nại theo trạng thái
// ========================================================================================
Scenario('TC_CMP_005: Lọc khiếu nại theo trạng thái',
  async ({ I, loginPage, complaintsPage }) => {
    await loginAndGoToComplaints(I, loginPage, complaintsPage);

    complaintsPage.filterByStatus('Open');
    I.wait(2);
    I.saveScreenshot('TC_CMP_005_filter_status.png');
  }
);
