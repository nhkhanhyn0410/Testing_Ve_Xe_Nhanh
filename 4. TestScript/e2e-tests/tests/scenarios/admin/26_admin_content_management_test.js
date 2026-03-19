const users = require('../../data/users.json');

Feature('Admin: Quản lý nội dung - Banner, Blog, FAQ (STT 26)');

const admin = users.admin.valid;

// Helper: Login admin → vào trang quản lý nội dung
async function loginAndGoToContent(I, adminLoginPage, adminContentManagementPage) {
  adminLoginPage.open();
  adminLoginPage.login(admin.email, admin.password);
  I.wait(15); // Render cold start
  I.seeInCurrentUrl('/admin');
  adminContentManagementPage.open();
}

Before(({ I }) => {
  I.clearCookie();
});

// ========================================================================================
// TC_ADM_CTN_001: Hiển thị trang quản lý nội dung
// Steps: Đăng nhập Admin → Vào menu "Quản lý nội dung"
// Expected: Hiển thị 3 tab: Banner, Blog, FAQ
// ========================================================================================
Scenario('TC_ADM_CTN_001: Hiển thị trang quản lý nội dung',
  async ({ I, adminLoginPage, adminContentManagementPage }) => {
    await loginAndGoToContent(I, adminLoginPage, adminContentManagementPage);

    // Kiểm tra trang hiển thị đúng
    adminContentManagementPage.seeContentPage();

    // Kiểm tra 3 tab hiển thị
    adminContentManagementPage.seeBannersTab();
    adminContentManagementPage.seeBlogsTab();
    adminContentManagementPage.seeFAQsTab();

    I.saveScreenshot('TC_ADM_CTN_001_content_page.png');
  }
);

// ========================================================================================
// TC_ADM_CTN_002: Xem danh sách banner
// Steps: Click tab "Banner"
// Expected: Hiển thị danh sách banner: tiêu đề, hình ảnh, trạng thái, thứ tự
// ========================================================================================
Scenario('TC_ADM_CTN_002: Xem danh sách banner',
  async ({ I, adminLoginPage, adminContentManagementPage }) => {
    await loginAndGoToContent(I, adminLoginPage, adminContentManagementPage);

    // Chuyển sang tab Banners
    adminContentManagementPage.switchToBanners();

    // Kiểm tra bảng banner hiển thị
    I.seeElement(adminContentManagementPage.elements.contentTable);

    // Kiểm tra các cột hiển thị
    I.see('Tiêu Đề');
    I.see('Trạng Thái');

    I.saveScreenshot('TC_ADM_CTN_002_banners_list.png');
  }
);

// ========================================================================================
// TC_ADM_CTN_003: Thêm banner mới
// Data Input: Tiêu đề: Banner Test, Hình: banner.jpg, Link: /promotions
// Steps: Click "Thêm banner" → Nhập tiêu đề → Upload hình
// Expected: Banner mới xuất hiện trong danh sách
// ========================================================================================
Scenario('TC_ADM_CTN_003: Thêm banner mới',
  async ({ I, adminLoginPage, adminContentManagementPage }) => {
    await loginAndGoToContent(I, adminLoginPage, adminContentManagementPage);

    adminContentManagementPage.switchToBanners();

    // Click tạo banner mới
    adminContentManagementPage.clickCreateBanner();

    // Nhập thông tin banner
    adminContentManagementPage.fillTitle('Banner Test E2E');
    I.fillField('#imageUrl', 'https://via.placeholder.com/1200x400?text=Banner+Test');
    I.fillField('#linkUrl', '/promotions');

    // Chọn vị trí hiển thị
    I.click('//div[contains(@class,"ant-form-item") and .//label[contains(.,"Vị Trí")]]//div[contains(@class,"ant-select-selector")]');
    I.wait(1);
    I.click('//div[contains(@class,"ant-select-item") and contains(.,"Trang chủ")]');
    I.wait(1);

    // Nhập thứ tự
    I.fillField('#order', '99');

    I.saveScreenshot('TC_ADM_CTN_003_create_banner_form.png');

    // Submit
    adminContentManagementPage.submitContent();

    // Kiểm tra tạo thành công
    I.waitForElement(adminContentManagementPage.messages.success, 10);
    I.saveScreenshot('TC_ADM_CTN_003_banner_created.png');
  }
);

// ========================================================================================
// TC_ADM_CTN_004: Xem danh sách blog
// Steps: Click tab "Blog"
// Expected: Hiển thị danh sách blog: tiêu đề, tác giả, ngày đăng, trạng thái
// ========================================================================================
Scenario('TC_ADM_CTN_004: Xem danh sách blog',
  async ({ I, adminLoginPage, adminContentManagementPage }) => {
    await loginAndGoToContent(I, adminLoginPage, adminContentManagementPage);

    // Chuyển sang tab Blogs
    adminContentManagementPage.switchToBlogs();

    // Kiểm tra bảng blog hiển thị
    I.seeElement(adminContentManagementPage.elements.contentTable);

    // Kiểm tra các cột
    I.see('Tiêu Đề');
    I.see('Trạng Thái');

    I.saveScreenshot('TC_ADM_CTN_004_blogs_list.png');
  }
);

// ========================================================================================
// TC_ADM_CTN_005: Thêm bài blog mới
// Data Input: Tiêu đề: Blog Test, Nội dung: Lorem ipsum...
// Steps: Click "Thêm blog" → Nhập tiêu đề, nội dung → Click "Đăng"
// Expected: Blog mới xuất hiện trong danh sách
// ========================================================================================
Scenario('TC_ADM_CTN_005: Thêm bài blog mới',
  async ({ I, adminLoginPage, adminContentManagementPage }) => {
    await loginAndGoToContent(I, adminLoginPage, adminContentManagementPage);

    adminContentManagementPage.switchToBlogs();

    // Click tạo blog mới
    adminContentManagementPage.clickCreateBlog();

    // Nhập thông tin blog
    adminContentManagementPage.fillTitle('Blog Test E2E');

    // Nhập tóm tắt (excerpt)
    I.fillField('#excerpt', 'Bài viết test tự động cho hệ thống Vé Xe Nhanh');

    // Nhập nội dung
    I.fillField('#content', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Đây là nội dung bài viết test tự động để kiểm tra chức năng tạo blog mới trong hệ thống quản lý nội dung.');

    // Nhập hình ảnh nổi bật
    I.fillField('#featuredImage', 'https://via.placeholder.com/800x400?text=Blog+Test');

    // Chọn danh mục
    I.click('//div[contains(@class,"ant-form-item") and .//label[contains(.,"Danh Mục")]]//div[contains(@class,"ant-select-selector")]');
    I.wait(1);
    I.click('//div[contains(@class,"ant-select-item") and contains(.,"Tin tức")]');
    I.wait(1);

    // Chọn trạng thái: Xuất bản
    I.click('//div[contains(@class,"ant-form-item") and .//label[contains(.,"Trạng Thái")]]//div[contains(@class,"ant-select-selector")]');
    I.wait(1);
    I.click('//div[contains(@class,"ant-select-item") and contains(.,"Xuất bản")]');
    I.wait(1);

    I.saveScreenshot('TC_ADM_CTN_005_create_blog_form.png');

    // Submit
    adminContentManagementPage.submitContent();

    // Kiểm tra tạo thành công
    I.waitForElement(adminContentManagementPage.messages.success, 10);
    I.saveScreenshot('TC_ADM_CTN_005_blog_created.png');
  }
);

// ========================================================================================
// TC_ADM_CTN_006: Xem danh sách FAQ
// Steps: Click tab "FAQ"
// Expected: Hiển thị danh sách câu hỏi thường gặp
// ========================================================================================
Scenario('TC_ADM_CTN_006: Xem danh sách FAQ',
  async ({ I, adminLoginPage, adminContentManagementPage }) => {
    await loginAndGoToContent(I, adminLoginPage, adminContentManagementPage);

    // Chuyển sang tab FAQs
    adminContentManagementPage.switchToFAQs();

    // Kiểm tra bảng FAQ hiển thị
    I.seeElement(adminContentManagementPage.elements.contentTable);

    // Kiểm tra các cột
    I.see('Câu Hỏi');
    I.see('Danh Mục');

    I.saveScreenshot('TC_ADM_CTN_006_faqs_list.png');
  }
);

// ========================================================================================
// TC_ADM_CTN_007: Thêm FAQ mới
// Data Input: Câu hỏi: Làm sao đặt vé? / Trả lời: Bạn truy cập...
// Steps: Click "Thêm FAQ" → Nhập câu hỏi và trả lời → Click "Lưu"
// Expected: FAQ mới xuất hiện trong danh sách
// ========================================================================================
Scenario('TC_ADM_CTN_007: Thêm FAQ mới',
  async ({ I, adminLoginPage, adminContentManagementPage }) => {
    await loginAndGoToContent(I, adminLoginPage, adminContentManagementPage);

    adminContentManagementPage.switchToFAQs();

    // Click tạo FAQ mới
    adminContentManagementPage.clickCreateFAQ();

    // Nhập câu hỏi
    adminContentManagementPage.fillQuestion('Làm sao để đặt vé xe trên hệ thống?');

    // Nhập câu trả lời
    adminContentManagementPage.fillAnswer(
      'Bạn truy cập trang web, chọn tuyến đường và ngày đi, chọn ghế ngồi, điền thông tin hành khách và tiến hành thanh toán. Vé sẽ được gửi về email sau khi thanh toán thành công.'
    );

    // Chọn danh mục
    I.click('//div[contains(@class,"ant-form-item") and .//label[contains(.,"Danh Mục")]]//div[contains(@class,"ant-select-selector")]');
    I.wait(1);
    I.click('//div[contains(@class,"ant-select-item") and contains(.,"Đặt vé")]');
    I.wait(1);

    I.saveScreenshot('TC_ADM_CTN_007_create_faq_form.png');

    // Submit
    adminContentManagementPage.submitContent();

    // Kiểm tra tạo thành công
    I.waitForElement(adminContentManagementPage.messages.success, 10);
    I.saveScreenshot('TC_ADM_CTN_007_faq_created.png');
  }
);
