const users = require('../../data/users.json');

Feature('Admin: Quản lý nhà xe - duyệt/từ chối/tạm ngưng (STT 23)');

const admin = users.admin.valid;

// Helper: Login admin → vào trang quản lý nhà xe
async function loginAndGoToOperators(I, adminLoginPage, adminOperatorManagementPage) {
  adminLoginPage.open();
  adminLoginPage.login(admin.email, admin.password);
  I.wait(15); // Render cold start
  I.seeInCurrentUrl('/admin');
  adminOperatorManagementPage.open();
}

Before(({ I }) => {
  I.clearCookie();
});

// ========================================================================================
// TC_ADM_OP_001: Hiển thị danh sách nhà xe
// Steps: Đăng nhập Admin → Vào menu "Quản lý nhà xe"
// Expected: Hiển thị bảng: tên công ty, email, SĐT, trạng thái (pending/active/suspended)
// ========================================================================================
Scenario('TC_ADM_OP_001: Hiển thị danh sách nhà xe',
  async ({ I, adminLoginPage, adminOperatorManagementPage }) => {
    await loginAndGoToOperators(I, adminLoginPage, adminOperatorManagementPage);

    // Kiểm tra bảng nhà xe hiển thị
    adminOperatorManagementPage.seeOperatorsTable();
    I.seeElement(adminOperatorManagementPage.elements.tableRow);

    // Kiểm tra các cột hiển thị
    I.see('Nhà Xe');
    I.see('Trạng Thái Xác Minh');
    I.see('Hành Động');

    I.saveScreenshot('TC_ADM_OP_001_operators_list.png');
  }
);

// ========================================================================================
// TC_ADM_OP_002: Tìm kiếm nhà xe theo tên
// Data Input: Từ khóa: Phương Trang
// Steps: Nhập từ khóa vào ô tìm kiếm → Enter
// Expected: Hiển thị kết quả chứa "Phương Trang"
// ========================================================================================
Scenario('TC_ADM_OP_002: Tìm kiếm nhà xe theo tên',
  async ({ I, adminLoginPage, adminOperatorManagementPage }) => {
    await loginAndGoToOperators(I, adminLoginPage, adminOperatorManagementPage);

    adminOperatorManagementPage.searchOperator('Phương Trang');
    I.pressKey('Enter');
    I.wait(3);

    // Kiểm tra kết quả tìm kiếm
    I.see('Phương Trang');
    I.saveScreenshot('TC_ADM_OP_002_search_result.png');
  }
);

// ========================================================================================
// TC_ADM_OP_003: Duyệt nhà xe mới (pending → active)
// Pre-condition: Có nhà xe trạng thái "pending"
// Steps: Tìm nhà xe pending → Click "Duyệt" → Xác nhận
// Expected: Trạng thái nhà xe đổi thành "active"
// ========================================================================================
Scenario('TC_ADM_OP_003: Duyệt nhà xe mới (pending → active)',
  async ({ I, adminLoginPage, adminOperatorManagementPage }) => {
    await loginAndGoToOperators(I, adminLoginPage, adminOperatorManagementPage);

    // Lọc nhà xe trạng thái "Chờ duyệt" (pending)
    I.click(locate(adminOperatorManagementPage.elements.statusFilter).first());
    I.wait(1);
    I.click('//div[contains(@class,"ant-select-item") and contains(.,"Chờ duyệt")]');
    I.wait(3);

    // Click nút Duyệt (CheckOutlined) → Modal.confirm → okText: "Duyệt"
    adminOperatorManagementPage.clickApprove();

    // Kiểm tra duyệt thành công
    adminOperatorManagementPage.seeActionSuccess();
    I.saveScreenshot('TC_ADM_OP_003_approved.png');
  }
);

// ========================================================================================
// TC_ADM_OP_004: Từ chối nhà xe (pending → rejected)
// Pre-condition: Có nhà xe trạng thái "pending"
// Steps: Tìm nhà xe pending → Click "Từ chối" → Nhập lý do → Xác nhận
// Expected: Trạng thái đổi thành "rejected"
// ========================================================================================
Scenario('TC_ADM_OP_004: Từ chối nhà xe (pending → rejected)',
  async ({ I, adminLoginPage, adminOperatorManagementPage }) => {
    await loginAndGoToOperators(I, adminLoginPage, adminOperatorManagementPage);

    // Lọc nhà xe trạng thái "Chờ duyệt"
    I.click(locate(adminOperatorManagementPage.elements.statusFilter).first());
    I.wait(1);
    I.click('//div[contains(@class,"ant-select-item") and contains(.,"Chờ duyệt")]');
    I.wait(3);

    // Click nút Từ chối (CloseOutlined) → Modal → nhập lý do → okText: "Từ Chối"
    adminOperatorManagementPage.clickReject(null, 'Hồ sơ không đầy đủ, thiếu giấy phép kinh doanh - Test tự động');

    // Kiểm tra từ chối thành công
    adminOperatorManagementPage.seeActionSuccess();
    I.saveScreenshot('TC_ADM_OP_004_rejected.png');
  }
);

// ========================================================================================
// TC_ADM_OP_005: Tạm ngưng nhà xe (active → suspended)
// Pre-condition: Nhà xe đang "active"
// Steps: Click "Tạm ngưng" → Nhập lý do → Xác nhận
// Expected: Trạng thái đổi thành "suspended"
// ========================================================================================
Scenario('TC_ADM_OP_005: Tạm ngưng nhà xe (active → suspended)',
  async ({ I, adminLoginPage, adminOperatorManagementPage }) => {
    await loginAndGoToOperators(I, adminLoginPage, adminOperatorManagementPage);

    // Lọc nhà xe đã duyệt (approved) để tìm nút Tạm ngưng
    I.click(locate(adminOperatorManagementPage.elements.statusFilter).first());
    I.wait(1);
    I.click('//div[contains(@class,"ant-select-item") and contains(.,"Đã duyệt")]');
    I.wait(3);

    // Click nút Tạm ngưng (StopOutlined) → Modal → nhập lý do → okText: "Tạm Ngưng"
    adminOperatorManagementPage.clickSuspend(null, 'Nhận nhiều khiếu nại từ khách hàng - Test tự động');

    // Kiểm tra tạm ngưng thành công
    adminOperatorManagementPage.seeActionSuccess();
    I.saveScreenshot('TC_ADM_OP_005_suspended.png');
  }
);

// ========================================================================================
// TC_ADM_OP_006: Xem chi tiết nhà xe
// Steps: Click vào 1 nhà xe trong danh sách
// Expected: Hiển thị chi tiết: thông tin công ty, GPKD, danh sách tuyến, xe, nhân viên
// ========================================================================================
Scenario('TC_ADM_OP_006: Xem chi tiết nhà xe',
  async ({ I, adminLoginPage, adminOperatorManagementPage }) => {
    await loginAndGoToOperators(I, adminLoginPage, adminOperatorManagementPage);

    // Click nút xem chi tiết nhà xe đầu tiên
    adminOperatorManagementPage.clickViewDetails();

    // Kiểm tra modal chi tiết hiển thị
    adminOperatorManagementPage.seeDetailModal();
    I.waitForText('Chi Tiết Nhà Xe', 10);

    // Kiểm tra thông tin hiển thị
    I.see('Tên Công Ty');
    I.see('Email');
    I.see('Số Điện Thoại');

    I.saveScreenshot('TC_ADM_OP_006_operator_detail.png');

    adminOperatorManagementPage.closeDetailModal();
  }
);
