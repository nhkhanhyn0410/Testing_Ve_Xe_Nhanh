const { I } = inject();

module.exports = {
  elements: {
    loginButton: '//button[contains(.,"Đăng nhập")]',
    registerButton: '//button[contains(.,"Đăng ký")]',
    searchButton: '//button[contains(.,"Tìm chuyến xe")]',
  },

  open() {
    I.amOnPage('/');
    I.waitForElement('body', 30);
    I.wait(3);
  },

  clickLogin() {
    I.click(this.elements.loginButton);
  },

  clickRegister() {
    I.click(this.elements.registerButton);
  },

  seeHomePage() {
    I.see('Vé xe nhanh');
  }
};
