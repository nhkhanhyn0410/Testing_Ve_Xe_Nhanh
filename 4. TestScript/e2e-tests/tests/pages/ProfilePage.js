const { I } = inject();

module.exports = {

  fields: {
    name: '//input[@id="name" or @name="name"]',
    phone: '//input[@id="phone" or @name="phone" or @id="phoneNumber"]',
    email: '//input[@id="email" or @name="email"]',
    currentPassword: '//input[@id="currentPassword" or @name="currentPassword"]',
    newPassword: '//input[@id="newPassword" or @name="newPassword"]',
    confirmPassword: '//input[@id="confirmPassword" or @name="confirmPassword"]',
  },

  elements: {
    avatar: '//img[contains(@class,"avatar") or contains(@alt,"avatar")]',
    uploadAvatar: '//input[@type="file"]',
    profileCard: '.ant-card',
  },

  buttons: {
    updateProfile: '//button[contains(.,"Cập nhật") or contains(.,"Lưu")]',
    changePassword: '//button[contains(.,"Đổi mật khẩu")]',
    uploadAvatarBtn: '//button[contains(.,"Tải ảnh") or .//span[contains(@class,"UploadOutlined")]]',
    back: '//button[.//span[contains(@class,"ArrowLeftOutlined")]]',
  },

  messages: {
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open() {
    I.amOnPage('/profile');
    I.waitForElement('body', 30);
    I.waitForInvisible('.ant-spin', 30);
    I.wait(3);
  },

  fillName(name) {
    I.clearField(this.fields.name);
    I.fillField(this.fields.name, name);
  },

  fillPhone(phone) {
    I.clearField(this.fields.phone);
    I.fillField(this.fields.phone, phone);
  },

  clickUpdateProfile() {
    I.click(this.buttons.updateProfile);
    I.wait(3);
  },

  updateProfile(name, phone) {
    if (name) this.fillName(name);
    if (phone) this.fillPhone(phone);
    this.clickUpdateProfile();
  },

  fillCurrentPassword(password) {
    I.fillField(this.fields.currentPassword, password);
  },

  fillNewPassword(password) {
    I.fillField(this.fields.newPassword, password);
  },

  fillConfirmNewPassword(password) {
    I.fillField(this.fields.confirmPassword, password);
  },

  changePassword(currentPwd, newPwd) {
    this.fillCurrentPassword(currentPwd);
    this.fillNewPassword(newPwd);
    this.fillConfirmNewPassword(newPwd);
    I.click(this.buttons.changePassword);
    I.wait(3);
  },

  seeProfilePage() {
    I.seeElement(this.elements.profileCard);
  },

  seeUpdateSuccess() {
    I.seeElement(this.messages.success);
  },

  seeUpdateError(message) {
    I.wait(3);
    if (message) {
      I.see(message);
    }
  },
};
