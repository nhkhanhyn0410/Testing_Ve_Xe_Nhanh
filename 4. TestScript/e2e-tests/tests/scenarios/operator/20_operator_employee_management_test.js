const users = require('../../data/users.json');

Feature('Operator - Quản lý nhân viên (CRUD, phân quyền)');

const operator = users.operator.valid;

const employeeTestData = {
  driverCreate: {
      employeeCode: `DRV-TEST-${Date.now()}`,
    fullName: 'Nguyễn Văn Tài',
    phone: '0911111111',
    email: `driver.${Date.now()}@test.com`,
    idCard: '070000006838',
    role: 'Tài Xế',
    password: 'Driver@123',
    status: 'Hoạt Động',

    licenseNumber: 'ABC234554',
    licenseClass: 'B',
    licenseExpiryDate: '2027-03-20',
  },

  tripManagerCreate: {
    employeeCode: `TM-TEST-${Date.now()}`,
    fullName: 'Trần Minh Quản',
    phone: '0988888888',
    email: `tripmanager.${Date.now()}@test.com`,
    idCard: '070000009999',
    role: 'Quản Lý Chuyến',
    password: 'TripManager@123',
    status: 'Hoạt Động',
  },

  duplicate: {
    employeeCode: 'DRV-PT-002',
    fullName: 'Nguyễn Văn Trùng',
    phone: '0912222222',
    email: `duplicate.${Date.now()}@test.com`,
    idCard: '079999888777',
    role: 'Tài Xế',
    password: 'Driver@123',
    status: 'Hoạt Động',

    licenseNumber: 'XYZ998877',
    licenseClass: 'C',
    licenseExpiryDate: '2028-06-15',
  },

  editExisting: {
    employeeCode: 'TM-TEST-1773864183054',
    fullName: 'Trần Minh Tâm updated',
    phone: '0912345670',
    email: `updated.${Date.now()}@test.com`,
    idCard: '079111222333',
    status: 'Hoạt Động',
  },
};

Before(({ I, operatorLoginPage }) => {
  I.clearCookie();
  operatorLoginPage.open();
  operatorLoginPage.login(operator.email, operator.password);
  I.wait(5);
});

Scenario('TC_OP_EMP_001: Hiển thị danh sách nhân viên', ({ I, operatorEmployeesPage }) => {
  operatorEmployeesPage.open();
  operatorEmployeesPage.seeEmployeesTable();
  operatorEmployeesPage.seeTableHeaders();
  operatorEmployeesPage.seeEmployeeRow('DRV-PHONE-1773864453658');
  I.saveScreenshot('TC_OP_EMP_001_employee_list.png');
});

Scenario('TC_OP_EMP_002: Thêm nhân viên mới vai trò tài xế', ({ I, operatorEmployeesPage }) => {
  operatorEmployeesPage.open();

  operatorEmployeesPage.createEmployee(employeeTestData.driverCreate);

  operatorEmployeesPage.seeCreateOrUpdateSuccess();
  operatorEmployeesPage.open();
  operatorEmployeesPage.seeEmployeeRow(employeeTestData.driverCreate.employeeCode);

  I.saveScreenshot('TC_OP_EMP_002_create_driver_success.png');
});

Scenario('TC_OP_EMP_003: Thêm nhân viên mới vai trò quản lý chuyến', ({ I, operatorEmployeesPage }) => {
  operatorEmployeesPage.open();

  operatorEmployeesPage.createEmployee(employeeTestData.tripManagerCreate);

  operatorEmployeesPage.seeCreateOrUpdateSuccess();
  operatorEmployeesPage.open();
  operatorEmployeesPage.seeEmployeeRow(employeeTestData.tripManagerCreate.employeeCode);

  I.saveScreenshot('TC_OP_EMP_003_create_trip_manager_success.png');
});

Scenario('TC_OP_EMP_004: Sửa thông tin nhân viên', ({ I, operatorEmployeesPage }) => {
  const employeeCode = employeeTestData.editExisting.employeeCode;

  operatorEmployeesPage.open();
  operatorEmployeesPage.seeEmployeeRow(employeeCode);

  operatorEmployeesPage.updateEmployee(employeeCode, {
    fullName: employeeTestData.editExisting.fullName,
    phone: employeeTestData.editExisting.phone,
    email: employeeTestData.editExisting.email,
    idCard: employeeTestData.editExisting.idCard,
    status: employeeTestData.editExisting.status,
  });

  operatorEmployeesPage.seeCreateOrUpdateSuccess();
  operatorEmployeesPage.open();
  operatorEmployeesPage.seeEmployeeRow(employeeCode);

  I.saveScreenshot('TC_OP_EMP_004_update_employee_success.png');
});

Scenario('TC_OP_EMP_005: Thêm nhân viên với mã trùng', ({ I, operatorEmployeesPage }) => {
  operatorEmployeesPage.open();

  operatorEmployeesPage.clickAddEmployee();
  operatorEmployeesPage.fillEmployeeForm(employeeTestData.duplicate);
  operatorEmployeesPage.submitEmployee();

  operatorEmployeesPage.seeErrorMessage('Có lỗi xảy ra');

  I.saveScreenshot('TC_OP_EMP_005_duplicate_employee_code.png');
});

Scenario('TC_OP_EMP_006: Thêm nhân viên với số điện thoại trùng', ({ I, operatorEmployeesPage }) => {
  operatorEmployeesPage.open();

  operatorEmployeesPage.clickAddEmployee();
  operatorEmployeesPage.fillEmployeeForm({
    employeeCode: `DRV-PHONE-${Date.now()}`,
    fullName: ' Nguyễn Văn Điện',
    phone: '0988888888', // dùng số đã tồn tại trong hệ thống
    email: `duplicate.phone.${Date.now()}@test.com`,
    idCard: '079888777666',
    role: 'Tài Xế',
    password: 'Driver@123',
    status: 'Hoạt Động',
    licenseNumber: 'LIC998877',
    licenseClass: 'B',
    licenseExpiryDate: '2027-03-20',
  });

  operatorEmployeesPage.submitEmployee();

  operatorEmployeesPage.seeErrorMessage('Có lỗi xảy ra');

  I.saveScreenshot('TC_OP_EMP_006_duplicate_phone.png');
});