const users = require('../../data/users.json');

Feature('Admin: Quản lý người dùng - xem, khóa/mở khóa (STT 24)');

const admin = users.admin.valid;

// Helper: Login admin → vào trang quản lý người dùng
async function loginAndGoToUsers(I, adminLoginPage, adminUserManagementPage) {
  adminLoginPage.open();
  adminLoginPage.login(admin.email, admin.password);
  I.wait(15); // Render cold start
  I.seeInCurrentUrl('/admin');
  adminUserManagementPage.open();
}

Before(({ I }) => {
  I.clearCookie();
});

// ========================================================================================
// TC_ADM_USER_001: Hiển thị danh sách người dùng
// Steps: Đăng nhập Admin → Vào menu "Quản lý người dùng"
// Expected: Hiển thị bảng: tên, email, SĐT, vai trò, trạng thái, ngày đăng ký
// ========================================================================================
Scenario('TC_ADM_USER_001: Hiển thị danh sách người dùng',
  async ({ I, adminLoginPage, adminUserManagementPage }) => {
    await loginAndGoToUsers(I, adminLoginPage, adminUserManagementPage);

    // Kiểm tra bảng người dùng hiển thị
    adminUserManagementPage.seeUsersTable();
    I.seeElement(adminUserManagementPage.elements.tableRow);

    // Kiểm tra các cột hiển thị đúng
    I.see('Người Dùng');
    I.see('Vai Trò');
    I.see('Trạng Thái');

    I.saveScreenshot('TC_ADM_USER_001_users_list.png');
  }
);

// ========================================================================================
// TC_ADM_USER_002: Tìm kiếm người dùng theo email
// Data Input: Email: customer1@gmail.com
// Steps: Nhập email vào ô tìm kiếm → Enter
// Expected: Hiển thị user có email tương ứng
// ========================================================================================
Scenario('TC_ADM_USER_002: Tìm kiếm người dùng theo email',
  async ({ I, adminLoginPage, adminUserManagementPage }) => {
    await loginAndGoToUsers(I, adminLoginPage, adminUserManagementPage);

    adminUserManagementPage.searchUser('customer1@gmail.com');
    I.pressKey('Enter');
    I.wait(3);

    // Kiểm tra kết quả tìm kiếm hiển thị đúng user
    I.see('customer1@gmail.com');
    I.saveScreenshot('TC_ADM_USER_002_search_result.png');
  }
);

// ========================================================================================
// TC_ADM_USER_003: Xem chi tiết người dùng
// Steps: Click vào 1 user trong danh sách
// Expected: Hiển thị chi tiết: thông tin cá nhân, lịch sử booking, điểm thưởng
// ========================================================================================
Scenario('TC_ADM_USER_003: Xem chi tiết người dùng',
  async ({ I, adminLoginPage, adminUserManagementPage }) => {
    await loginAndGoToUsers(I, adminLoginPage, adminUserManagementPage);

    // Click nút xem chi tiết user đầu tiên
    adminUserManagementPage.clickViewDetails();

    // Kiểm tra modal chi tiết hiển thị
    adminUserManagementPage.seeDetailModal();
    I.waitForText('Chi Tiết Người Dùng', 10);

    // Kiểm tra thông tin cá nhân hiển thị
    I.see('Họ Tên');
    I.see('Email');
    I.see('Vai Trò');
    I.see('Trạng Thái');

    I.saveScreenshot('TC_ADM_USER_003_user_detail.png');

    adminUserManagementPage.closeDetailModal();
  }
);

// ========================================================================================
// TC_ADM_USER_004 & 005: Khóa → Mở khóa tài khoản người dùng
// TC_ADM_USER_004: Click "Khóa tài khoản" → Nhập lý do → Xác nhận
//   Expected: Tài khoản bị khóa, user không thể đăng nhập
// TC_ADM_USER_005: Click "Mở khóa" → Xác nhận
//   Expected: Tài khoản được mở khóa, user có thể đăng nhập lại
//
// Gộp thành 1 Scenario vì TC_005 phụ thuộc TC_004 (cần user đã bị khóa)
// ========================================================================================
Scenario('TC_ADM_USER_004→005: Khóa và mở khóa tài khoản người dùng',
  async ({ I, adminLoginPage, adminUserManagementPage }) => {
    await loginAndGoToUsers(I, adminLoginPage, adminUserManagementPage);

    // --- TC_ADM_USER_004: Khóa tài khoản ---
    // Tìm user để khóa
    adminUserManagementPage.searchUser('customer1@gmail.com');
    I.pressKey('Enter');
    I.wait(3);

    // Click nút khóa (LockOutlined) + nhập lý do
    adminUserManagementPage.clickBlockUser(null, 'Vi phạm điều khoản sử dụng - Test tự động');

    // Kiểm tra khóa thành công
    I.waitForElement(adminUserManagementPage.messages.success, 10);
    I.saveScreenshot('TC_ADM_USER_004_user_blocked.png');

    I.wait(2);

    // --- TC_ADM_USER_005: Mở khóa tài khoản ---
    // User đã bị khóa → nút UnlockOutlined xuất hiện thay cho LockOutlined
    adminUserManagementPage.clickUnblockUser();

    // Kiểm tra mở khóa thành công
    I.waitForElement(adminUserManagementPage.messages.success, 10);
    I.saveScreenshot('TC_ADM_USER_005_user_unblocked.png');
  }
);
