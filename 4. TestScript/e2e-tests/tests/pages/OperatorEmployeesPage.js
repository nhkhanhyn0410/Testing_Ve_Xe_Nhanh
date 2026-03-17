const { I } = inject();

module.exports = {

  elements: {
    employeesTable: '.ant-table',
    tableRow: '.ant-table-row',
  },

  buttons: {
    addEmployee: '//button[contains(.,"Thêm Nhân Viên") or .//span[contains(@class,"PlusOutlined")]]',
    edit: '//button[.//span[contains(@class,"EditOutlined")]]',
    delete: '//button[contains(@class,"danger") or .//span[contains(@class,"DeleteOutlined")]]',
  },

  modal: {
    employeeModal: '.ant-modal',
    employeeCode: '.ant-modal #employeeCode',
    fullName: '.ant-modal #fullName',
    phone: '.ant-modal #phone',
    email: '.ant-modal #email',
    idCard: '.ant-modal #idCard',
    role: '.ant-modal .ant-select',
    password: '.ant-modal #password',
    status: '.ant-modal .ant-select',
    licenseNumber: '.ant-modal #licenseNumber',
    licenseClass: '.ant-modal .ant-select',
    licenseExpiry: '.ant-modal .ant-picker',
    submit: '.ant-modal .ant-btn-primary',
    cancel: '.ant-modal .ant-btn-default',
  },

  messages: {
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open() {
    I.amOnPage('/operator/employees');
    I.waitForElement(this.elements.employeesTable, 30);
    I.waitForInvisible('.ant-spin', 30);
  },

  clickAddEmployee() {
    I.click(this.buttons.addEmployee);
    I.waitForElement(this.modal.employeeModal, 10);
  },

  fillEmployeeCode(code) {
    I.fillField(this.modal.employeeCode, code);
  },

  fillFullName(name) {
    I.fillField(this.modal.fullName, name);
  },

  fillPhone(phone) {
    I.fillField(this.modal.phone, phone);
  },

  fillEmail(email) {
    I.fillField(this.modal.email, email);
  },

  fillIdCard(idCard) {
    I.fillField(this.modal.idCard, idCard);
  },

  fillPassword(password) {
    I.fillField(this.modal.password, password);
  },

  selectRole(role) {
    I.click(locate(this.modal.role).first());
    I.wait(1);
    I.click(`//div[contains(@class,"ant-select-item") and contains(.,"${role}")]`);
    I.wait(1);
  },

  submitEmployee() {
    I.click(this.modal.submit);
    I.wait(3);
  },

  createEmployee(code, name, phone, email, role, password) {
    this.clickAddEmployee();
    this.fillEmployeeCode(code);
    this.fillFullName(name);
    this.fillPhone(phone);
    this.fillEmail(email);
    this.selectRole(role);
    if (password) this.fillPassword(password);
    this.submitEmployee();
  },

  clickEdit(index) {
    const btn = index
      ? locate(this.buttons.edit).at(index)
      : locate(this.buttons.edit).first();
    I.click(btn);
    I.waitForElement(this.modal.employeeModal, 10);
  },

  clickDelete(index) {
    const btn = index
      ? locate(this.buttons.delete).at(index)
      : locate(this.buttons.delete).first();
    I.click(btn);
    I.wait(1);
    I.click('//button[contains(.,"OK") or contains(.,"Xác nhận")]');
    I.wait(3);
  },

  seeEmployeesTable() {
    I.seeElement(this.elements.employeesTable);
  },

  seeEmployee(name) {
    I.see(name);
  },

  seeCreateSuccess() {
    I.seeElement(this.messages.success);
  },
};
