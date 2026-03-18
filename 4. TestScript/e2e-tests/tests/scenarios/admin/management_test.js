const users = require('../../data/users.json');

Feature('Admin Management - Quản lý nhà xe, người dùng, khiếu nại, nội dung');

const admin = users.admin.valid;

Before(({ I, adminLoginPage }) => {
  I.clearCookie();
  adminLoginPage.open();
  adminLoginPage.login(admin.email, admin.password);
  I.wait(5);
});

// === OPERATOR MANAGEMENT (Quản lý nhà xe) ===

Scenario('TC_ADMIN_OP_001: Hiển thị danh sách nhà xe', ({ I, adminOperatorManagementPage }) => {
  adminOperatorManagementPage.open();
  adminOperatorManagementPage.seeOperatorsTable();
  I.saveScreenshot('TC_ADMIN_OP_001_operators_list.png');
});

Scenario('TC_ADMIN_OP_002: Tìm kiếm nhà xe', ({ I, adminOperatorManagementPage }) => {
  adminOperatorManagementPage.open();
  adminOperatorManagementPage.searchOperator('Phương Trang');
  I.wait(3);
  I.saveScreenshot('TC_ADMIN_OP_002_search_operator.png');
});

Scenario('TC_ADMIN_OP_003: Xem chi tiết nhà xe', ({ I, adminOperatorManagementPage }) => {
  adminOperatorManagementPage.open();
  adminOperatorManagementPage.clickViewDetails();
  adminOperatorManagementPage.seeDetailModal();
  I.saveScreenshot('TC_ADMIN_OP_003_operator_detail.png');
});

// === USER MANAGEMENT (Quản lý người dùng) ===

Scenario('TC_ADMIN_USER_001: Hiển thị danh sách người dùng', ({ I, adminUserManagementPage }) => {
  adminUserManagementPage.open();
  adminUserManagementPage.seeUsersTable();
  I.saveScreenshot('TC_ADMIN_USER_001_users_list.png');
});

Scenario('TC_ADMIN_USER_002: Tìm kiếm người dùng', ({ I, adminUserManagementPage }) => {
  adminUserManagementPage.open();
  adminUserManagementPage.searchUser('customer1@gmail.com');
  I.wait(3);
  I.saveScreenshot('TC_ADMIN_USER_002_search_user.png');
});

Scenario('TC_ADMIN_USER_003: Xem chi tiết người dùng', ({ I, adminUserManagementPage }) => {
  adminUserManagementPage.open();
  adminUserManagementPage.clickViewDetails();
  adminUserManagementPage.seeDetailModal();
  I.saveScreenshot('TC_ADMIN_USER_003_user_detail.png');
});

// === COMPLAINT MANAGEMENT (Quản lý khiếu nại) ===

Scenario('TC_ADMIN_CMP_001: Hiển thị danh sách khiếu nại', ({ I, adminComplaintManagementPage }) => {
  adminComplaintManagementPage.open();
  adminComplaintManagementPage.seeComplaintsTable();
  I.saveScreenshot('TC_ADMIN_CMP_001_complaints_list.png');
});

Scenario('TC_ADMIN_CMP_002: Lọc khiếu nại theo trạng thái', ({ I, adminComplaintManagementPage }) => {
  adminComplaintManagementPage.open();
  adminComplaintManagementPage.filterByStatus('Open');
  I.wait(3);
  I.saveScreenshot('TC_ADMIN_CMP_002_filter_status.png');
});

Scenario('TC_ADMIN_CMP_003: Xem chi tiết khiếu nại', ({ I, adminComplaintManagementPage }) => {
  adminComplaintManagementPage.open();
  adminComplaintManagementPage.clickViewDetails();
  adminComplaintManagementPage.seeDetailModal();
  I.saveScreenshot('TC_ADMIN_CMP_003_complaint_detail.png');
});

// === CONTENT MANAGEMENT (Quản lý nội dung) ===

Scenario('TC_ADMIN_CONTENT_001: Hiển thị trang quản lý nội dung', ({ I, adminContentManagementPage }) => {
  adminContentManagementPage.open();
  adminContentManagementPage.seeContentPage();
  adminContentManagementPage.seeBannersTab();
  adminContentManagementPage.seeBlogsTab();
  adminContentManagementPage.seeFAQsTab();
  I.saveScreenshot('TC_ADMIN_CONTENT_001_content_page.png');
});

Scenario('TC_ADMIN_CONTENT_002: Chuyển tab Banner', ({ I, adminContentManagementPage }) => {
  adminContentManagementPage.open();
  adminContentManagementPage.switchToBanners();
  I.saveScreenshot('TC_ADMIN_CONTENT_002_banners_tab.png');
});

Scenario('TC_ADMIN_CONTENT_003: Chuyển tab Blog', ({ I, adminContentManagementPage }) => {
  adminContentManagementPage.open();
  adminContentManagementPage.switchToBlogs();
  I.saveScreenshot('TC_ADMIN_CONTENT_003_blogs_tab.png');
});

Scenario('TC_ADMIN_CONTENT_004: Chuyển tab FAQ', ({ I, adminContentManagementPage }) => {
  adminContentManagementPage.open();
  adminContentManagementPage.switchToFAQs();
  I.saveScreenshot('TC_ADMIN_CONTENT_004_faqs_tab.png');
});
