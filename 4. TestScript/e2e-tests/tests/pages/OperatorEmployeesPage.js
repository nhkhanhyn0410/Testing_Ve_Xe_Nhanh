const { I } = inject();

module.exports = {
  elements: {
    employeesTable: '.ant-table',
    tableBody: '.ant-table-tbody',
    tableRow: 'tr.ant-table-row',
    loadingSpinner: '.ant-spin-spinning',
    menuEmployees: '//span[normalize-space()="Nhân viên" or normalize-space()="Nhân Viên"]',
    modalRoot: '.ant-modal',
    modalTitle: '.ant-modal .ant-modal-title',
  },

  buttons: {
    addEmployee: '//button[contains(.,"Thêm Nhân Viên") or contains(.,"Thêm nhân viên")]',
    submitInModal:
      '//div[contains(@class,"ant-modal")]//button[contains(.,"Tạo") or contains(.,"Lưu") or contains(.,"Cập nhật") or contains(.,"Cập Nhật")]',
    cancelInModal: '//div[contains(@class,"ant-modal")]//button[contains(.,"Hủy")]',
    confirmDelete:
      '//div[contains(@class,"ant-popconfirm") or contains(@class,"ant-popover")]//button[contains(.,"OK") or contains(.,"Xác nhận") or contains(.,"Đồng ý") or contains(.,"Xóa")]',
  },

  fields: {
    employeeCode: '.ant-modal input[id="employeeCode"]',
    fullName: '.ant-modal input[id="fullName"]',
    phone: '.ant-modal input[id="phone"]',
    email: '.ant-modal input[id="email"]',
    idCard: '.ant-modal input[id="idCard"]',
    password: '.ant-modal input[id="password"]',
    licenseNumber: '.ant-modal input[id="licenseNumber"]',
  
  },

  messages: {
    success: '.ant-message .ant-message-notice, .ant-notification-notice',
    error: '.ant-message .ant-message-error, .ant-message-error, .ant-notification-notice',
  },

  open() {
    I.amOnPage('/operator/employees');
    this.waitForPageReady();
  },

  waitForPageReady() {
    I.waitForElement(this.elements.employeesTable, 30);
    I.waitForInvisible(this.elements.loadingSpinner, 30);
    I.waitForElement(this.elements.tableBody, 30);
    I.wait(1);
  },

  goToEmployeesFromMenu() {
    I.click(this.elements.menuEmployees);
    this.waitForPageReady();
  },

  clickAddEmployee() {
    I.waitForElement(this.buttons.addEmployee, 15);
    I.click(this.buttons.addEmployee);
    this.waitForEmployeeModal();
  },

  waitForEmployeeModal() {
    I.waitForElement(this.elements.modalRoot, 15);
    I.wait(1);
  },

  roleSelect() {
    return '(//div[contains(@class,"ant-modal")]//*[contains(text(),"Vai Trò") or contains(text(),"Vai trò")]/following::div[contains(@class,"ant-select-selector")][1])[1]';
  },

  statusSelect() {
    return '(//div[contains(@class,"ant-modal")]//*[contains(text(),"Trạng Thái") or contains(text(),"Trạng thái")]/following::div[contains(@class,"ant-select-selector")][1])[1]';
  },

  selectOption(value) {
    return `//div[contains(@class,"ant-select-item-option-content") and normalize-space(.)="${value}"]`;
  },

  selectRole(value) {
    I.waitForElement(this.roleSelect(), 10);
    I.click(this.roleSelect());
    I.waitForElement('.ant-select-dropdown', 10);
    I.waitForElement(this.selectOption(value), 10);
    I.click(this.selectOption(value));
    I.wait(0.5);
  },

  selectStatus(value) {
    I.waitForElement(this.statusSelect(), 10);
    I.click(this.statusSelect());
    I.waitForElement('.ant-select-dropdown', 10);
    I.waitForElement(this.selectOption(value), 10);
    I.click(this.selectOption(value));
    I.wait(0.5);
  },

  fillEmployeeForm({
  employeeCode,
  fullName,
  phone,
  email,
  idCard,
  role,
  password,
  status,
  licenseNumber,
  licenseClass,
  licenseExpiryDate,
}) {
  if (employeeCode !== undefined) I.fillField(this.fields.employeeCode, employeeCode);
  if (fullName !== undefined) I.fillField(this.fields.fullName, fullName);
  if (phone !== undefined) I.fillField(this.fields.phone, phone);
  if (email !== undefined) I.fillField(this.fields.email, email);
  if (idCard !== undefined) I.fillField(this.fields.idCard, idCard);
  if (role !== undefined) this.selectRole(role);
  if (password !== undefined) I.fillField(this.fields.password, password);
  if (status !== undefined) this.selectStatus(status);

  if (licenseNumber !== undefined) {
    I.fillField(this.fields.licenseNumber, licenseNumber);
  }

  if (licenseClass !== undefined) {
    this.selectLicenseClass(licenseClass);
  }

  if (licenseExpiryDate !== undefined) {
    I.waitForElement(this.licenseExpiryDateField(), 10);
    I.click(this.licenseExpiryDateField());
    I.clearField(this.licenseExpiryDateField());
    I.fillField(this.licenseExpiryDateField(), licenseExpiryDate);
    I.pressKey('Enter');
    I.wait(0.5);
  }
},
  submitEmployee() {
    I.waitForElement(this.buttons.submitInModal, 10);
    I.click(this.buttons.submitInModal);
    I.wait(2);
  },
licenseClassSelect() {
  return '(//div[contains(@class,"ant-modal")]//*[contains(text(),"Hạng Giấy Phép") or contains(text(),"Hạng giấy phép")]/following::div[contains(@class,"ant-select-selector")][1])[1]';
},

selectLicenseClass(value) {
  I.waitForElement(this.licenseClassSelect(), 10);
  I.click(this.licenseClassSelect());
  I.waitForElement('.ant-select-dropdown', 10);
  I.click(`//div[contains(@class,"ant-select-item-option-content") and normalize-space(.)="${value}"]`);
  I.wait(0.5);
},
  employeeRowLocator(keyword) {
    return `//tr[contains(@class,"ant-table-row")][contains(normalize-space(.),"${keyword}")]`;
  },

  actionButtonInRow(keyword, actionText) {
    return `${this.employeeRowLocator(keyword)}//button[contains(normalize-space(.),"${actionText}")]`;
  },

  clickEditByEmployeeCode(employeeCode) {
    I.waitForElement(this.employeeRowLocator(employeeCode), 15);
    I.scrollTo(this.employeeRowLocator(employeeCode));
    I.click(this.actionButtonInRow(employeeCode, 'Sửa'));
    this.waitForEmployeeModal();
  },

  clickDeleteByEmployeeCode(employeeCode) {
    I.waitForElement(this.employeeRowLocator(employeeCode), 15);
    I.scrollTo(this.employeeRowLocator(employeeCode));
    I.click(this.actionButtonInRow(employeeCode, 'Xóa'));
    I.waitForElement(this.buttons.confirmDelete, 10);
    I.click(this.buttons.confirmDelete);
    I.wait(2);
  },

  createEmployee(employeeData) {
    this.clickAddEmployee();
    this.fillEmployeeForm(employeeData);
    this.submitEmployee();
  },

  updateEmployee(employeeCode, updates) {
    this.clickEditByEmployeeCode(employeeCode);
    this.fillEmployeeForm(updates);
    this.submitEmployee();
  },

  seeEmployeesTable() {
    I.seeElement(this.elements.employeesTable);
  },

  seeEmployeeRow(keyword) {
    I.waitForElement(this.employeeRowLocator(keyword), 15);
    I.seeElement(this.employeeRowLocator(keyword));
  },

  dontSeeEmployeeRow(keyword) {
    I.dontSeeElement(this.employeeRowLocator(keyword));
  },

  seeTableHeaders() {
    ['Mã NV', 'Họ Tên', 'Điện Thoại', 'Vai Trò', 'Trạng Thái', 'Hành Động'].forEach((header) => {
      I.see(header, this.elements.employeesTable);
    });
  },

  seeTextInRow(employeeCode, text) {
    I.see(text, this.employeeRowLocator(employeeCode));
  },

  seeCreateOrUpdateSuccess() {
    I.waitForElement(this.messages.success, 15);
  },
licenseClassSelect() {
  return '(//div[contains(@class,"ant-modal")]//*[contains(text(),"Hạng Giấy Phép") or contains(text(),"Hạng giấy phép")]/following::div[contains(@class,"ant-select-selector")][1])[1]';
},

selectLicenseClass(value) {
  I.click(this.licenseClassSelect());
  I.waitForElement('.ant-select-dropdown', 10);
  I.click(`//div[contains(@class,"ant-select-item-option-content") and normalize-space(.)="${value}"]`);
  I.wait(0.5);
},
  seeErrorMessage(message) {
    I.waitForElement(this.messages.error, 15);
    I.see(message);
  },
};