const users = require('../../data/users.json');

Feature('Profile Management - Quản lý hồ sơ cá nhân (STT 10)');

const customer = users.customer.valid;

// Helper: Login trước mỗi test
async function loginAndGoToProfile(I, loginPage, profilePage) {
  loginPage.open();
  loginPage.login(customer.email, customer.password);
  I.wait(15);
  I.dontSeeInCurrentUrl('/login');
  profilePage.open();
}

Before(({ I }) => {
  I.clearCookie();
});

// ========================================================================================
// TC_PROFILE_001: Hiển thị trang hồ sơ cá nhân
// ========================================================================================
Scenario('TC_PROFILE_001: Hiển thị trang hồ sơ cá nhân',
  async ({ I, loginPage, profilePage }) => {
    await loginAndGoToProfile(I, loginPage, profilePage);

    profilePage.seeProfilePage();
    I.seeElement(profilePage.elements.avatar);
    I.seeElement(profilePage.fields.name);
    I.saveScreenshot('TC_PROFILE_001_profile_page.png');
  }
);

// ========================================================================================
// TC_PROFILE_002: Cập nhật họ tên thành công
// ========================================================================================
Scenario('TC_PROFILE_002: Cập nhật họ tên thành công',
  async ({ I, loginPage, profilePage }) => {
    await loginAndGoToProfile(I, loginPage, profilePage);

    profilePage.fillName('Nguyen Van Updated');
    profilePage.clickUpdateProfile();

    profilePage.seeUpdateSuccess();
    I.saveScreenshot('TC_PROFILE_002_name_updated.png');
  }
);

// ========================================================================================
// TC_PROFILE_003: Cập nhật SĐT thành công
// ========================================================================================
Scenario('TC_PROFILE_003: Cập nhật SĐT thành công',
  async ({ I, loginPage, profilePage }) => {
    await loginAndGoToProfile(I, loginPage, profilePage);

    profilePage.fillPhone('0909876543');
    profilePage.clickUpdateProfile();

    profilePage.seeUpdateSuccess();
    I.saveScreenshot('TC_PROFILE_003_phone_updated.png');
  }
);

// ========================================================================================
// TC_PROFILE_004: Đổi mật khẩu thành công
// ========================================================================================
Scenario('TC_PROFILE_004: Đổi mật khẩu thành công',
  async ({ I, loginPage, profilePage }) => {
    await loginAndGoToProfile(I, loginPage, profilePage);

    I.click(profilePage.buttons.changePassword);
    I.wait(2);

    profilePage.fillCurrentPassword(customer.password);
    profilePage.fillNewPassword('NewPass@123');
    profilePage.fillConfirmNewPassword('NewPass@123');
    I.click(profilePage.buttons.changePassword);
    I.wait(3);

    profilePage.seeUpdateSuccess();
    I.saveScreenshot('TC_PROFILE_004_password_changed.png');
  }
);

// ========================================================================================
// TC_PROFILE_005: Đổi mật khẩu với mật khẩu cũ sai
// ========================================================================================
Scenario('TC_PROFILE_005: Đổi mật khẩu với mật khẩu cũ sai',
  async ({ I, loginPage, profilePage }) => {
    await loginAndGoToProfile(I, loginPage, profilePage);

    I.click(profilePage.buttons.changePassword);
    I.wait(2);

    profilePage.fillCurrentPassword('SaiMatKhau');
    profilePage.fillNewPassword('NewPass@123');
    profilePage.fillConfirmNewPassword('NewPass@123');
    I.click(profilePage.buttons.changePassword);
    I.wait(3);

    I.seeElement(profilePage.messages.error);
    I.saveScreenshot('TC_PROFILE_005_wrong_old_password.png');
  }
);

// ========================================================================================
// TC_PROFILE_006: Upload avatar
// ========================================================================================
Scenario('TC_PROFILE_006: Upload avatar',
  async ({ I, loginPage, profilePage }) => {
    await loginAndGoToProfile(I, loginPage, profilePage);

    I.attachFile(profilePage.elements.uploadAvatar, 'data/avatar.jpg');
    I.wait(5);

    profilePage.seeUpdateSuccess();
    I.seeElement(profilePage.elements.avatar);
    I.saveScreenshot('TC_PROFILE_006_avatar_uploaded.png');
  }
);
