const users = require('../../data/users.json');

Feature('Admin: Quản lý khiếu nại - phân công, xử lý, đóng (STT 25)');

const admin = users.admin.valid;

// Helper: Login admin → vào trang quản lý khiếu nại
async function loginAndGoToComplaints(I, adminLoginPage, adminComplaintManagementPage) {
  adminLoginPage.open();
  adminLoginPage.login(admin.email, admin.password);
  I.wait(15); // Render cold start
  I.seeInCurrentUrl('/admin');
  adminComplaintManagementPage.open();
}

Before(({ I }) => {
  I.clearCookie();
});

// ========================================================================================
// TC_ADM_CMP_001: Hiển thị danh sách khiếu nại
// Steps: Đăng nhập Admin → Vào menu "Khiếu nại"
// Expected: Hiển thị bảng: mã, tiêu đề, khách hàng, nhà xe, trạng thái, ngày tạo
// ========================================================================================
Scenario('TC_ADM_CMP_001: Hiển thị danh sách khiếu nại',
  async ({ I, adminLoginPage, adminComplaintManagementPage }) => {
    await loginAndGoToComplaints(I, adminLoginPage, adminComplaintManagementPage);

    // Kiểm tra bảng khiếu nại hiển thị
    adminComplaintManagementPage.seeComplaintsTable();
    I.seeElement(adminComplaintManagementPage.elements.tableRow);

    // Kiểm tra các cột hiển thị
    I.see('Mã Ticket');
    I.see('Tiêu Đề');
    I.see('Trạng Thái');

    I.saveScreenshot('TC_ADM_CMP_001_complaints_list.png');
  }
);

// ========================================================================================
// TC_ADM_CMP_002: Lọc khiếu nại theo trạng thái
// Data Input: Trạng thái: Open
// Steps: Chọn filter "Open" → Áp dụng
// Expected: Chỉ hiển thị các khiếu nại đang mở
// ========================================================================================
Scenario('TC_ADM_CMP_002: Lọc khiếu nại theo trạng thái',
  async ({ I, adminLoginPage, adminComplaintManagementPage }) => {
    await loginAndGoToComplaints(I, adminLoginPage, adminComplaintManagementPage);

    // Lọc theo trạng thái "Mới" (open)
    adminComplaintManagementPage.filterByStatus('Mới');
    I.wait(3);

    // Kiểm tra kết quả lọc
    adminComplaintManagementPage.seeComplaintsTable();
    I.saveScreenshot('TC_ADM_CMP_002_filter_open.png');
  }
);

// ========================================================================================
// TC_ADM_CMP_003: Xem chi tiết khiếu nại
// Steps: Click vào 1 khiếu nại
// Expected: Hiển thị chi tiết: nội dung, lịch sử xử lý, phản hồi
// ========================================================================================
Scenario('TC_ADM_CMP_003: Xem chi tiết khiếu nại',
  async ({ I, adminLoginPage, adminComplaintManagementPage }) => {
    await loginAndGoToComplaints(I, adminLoginPage, adminComplaintManagementPage);

    // Click nút xem chi tiết khiếu nại đầu tiên
    adminComplaintManagementPage.clickViewDetails();

    // Kiểm tra modal chi tiết hiển thị
    adminComplaintManagementPage.seeDetailModal();
    I.waitForText('Chi Tiết Khiếu Nại', 10);

    // Kiểm tra thông tin chi tiết
    I.see('Người Gửi');
    I.see('Danh Mục');
    I.see('Nội Dung Khiếu Nại');

    I.saveScreenshot('TC_ADM_CMP_003_complaint_detail.png');

    adminComplaintManagementPage.closeDetailModal();
  }
);

// ========================================================================================
// TC_ADM_CMP_004 & 005: Phân công → Đóng khiếu nại
// TC_ADM_CMP_004: Phân công khiếu nại (status → "Đang xử lý" / In Progress)
// TC_ADM_CMP_005: Đóng khiếu nại đã giải quyết (nhập kết quả → Resolve → Closed)
//
// Gộp 1 Scenario vì TC_005 cần khiếu nại đang "In Progress" (từ TC_004)
// ========================================================================================
Scenario('TC_ADM_CMP_004→005: Phân công và đóng khiếu nại',
  async ({ I, adminLoginPage, adminComplaintManagementPage }) => {
    await loginAndGoToComplaints(I, adminLoginPage, adminComplaintManagementPage);

    // --- TC_ADM_CMP_004: Phân công khiếu nại cho nhà xe ---
    // Thay đổi trạng thái khiếu nại đầu tiên → "Đang xử lý" (in_progress)
    // Trạng thái được thay đổi trực tiếp qua dropdown trong bảng

    // Click dropdown trạng thái trên dòng đầu tiên
    I.click(locate('//td//div[contains(@class,"ant-select-selector")]').first());
    I.wait(1);
    I.click('//div[contains(@class,"ant-select-item") and contains(.,"Đang xử lý")]');
    I.wait(3);

    // Kiểm tra cập nhật thành công
    I.waitForElement(adminComplaintManagementPage.messages.success, 10);
    I.saveScreenshot('TC_ADM_CMP_004_assigned.png');

    I.wait(2);

    // --- TC_ADM_CMP_005: Đóng khiếu nại đã giải quyết ---
    // Click nút Resolve (CheckOutlined) trên khiếu nại đầu tiên
    adminComplaintManagementPage.clickResolve();

    // Nhập kết quả xử lý
    adminComplaintManagementPage.fillResolution(
      'Đã liên hệ nhà xe và giải quyết vấn đề. Khách hàng đã được hoàn tiền.'
    );
    I.saveScreenshot('TC_ADM_CMP_005_resolve_modal.png');

    // Xác nhận giải quyết
    adminComplaintManagementPage.confirmResolve();

    // Kiểm tra đóng thành công
    I.waitForElement(adminComplaintManagementPage.messages.success, 10);
    I.saveScreenshot('TC_ADM_CMP_005_resolved.png');
  }
);
