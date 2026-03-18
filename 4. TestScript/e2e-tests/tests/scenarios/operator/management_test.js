const users = require('../../data/users.json');

Feature('Operator Management - Quản lý tuyến đường, xe, voucher');

const operator = users.operator.valid;

Before(({ I, operatorLoginPage }) => {
  I.clearCookie();
  operatorLoginPage.open();
  operatorLoginPage.login(operator.email, operator.password);
  I.wait(5);
});

// === ROUTES (Tuyến đường) ===

Scenario('TC_OP_ROUTE_001: Hiển thị danh sách tuyến đường', ({ I, operatorRoutesPage }) => {
  operatorRoutesPage.open();
  operatorRoutesPage.seeRoutesTable();
  I.saveScreenshot('TC_OP_ROUTE_001_routes_list.png');
});

Scenario('TC_OP_ROUTE_002: Mở modal tạo tuyến đường mới', ({ I, operatorRoutesPage }) => {
  operatorRoutesPage.open();
  operatorRoutesPage.clickCreateRoute();
  I.seeElement(operatorRoutesPage.modal.routeModal);
  I.saveScreenshot('TC_OP_ROUTE_002_create_modal.png');
});

Scenario('TC_OP_ROUTE_003: Tạo tuyến đường mới', ({ I, operatorRoutesPage }) => {
  operatorRoutesPage.open();
  operatorRoutesPage.createRoute(
    'Test Route ' + Date.now(),
    'TR-' + Date.now(),
    'TP. Hồ Chí Minh', 'Quận 1',
    'Đà Lạt', 'TP. Đà Lạt',
    '300', '420'
  );
  I.wait(3);
  I.saveScreenshot('TC_OP_ROUTE_003_create_route.png');
});

// === BUSES (Xe) ===

Scenario('TC_OP_BUS_001: Hiển thị danh sách xe', ({ I, operatorBusesPage }) => {
  operatorBusesPage.open();
  operatorBusesPage.seeBusesTable();
  I.saveScreenshot('TC_OP_BUS_001_buses_list.png');
});

Scenario('TC_OP_BUS_002: Mở modal thêm xe mới', ({ I, operatorBusesPage }) => {
  operatorBusesPage.open();
  operatorBusesPage.clickAddBus();
  I.seeElement(operatorBusesPage.modal.busModal);
  I.saveScreenshot('TC_OP_BUS_002_add_bus_modal.png');
});

Scenario('TC_OP_BUS_003: Thêm xe mới', ({ I, operatorBusesPage }) => {
  operatorBusesPage.open();
  operatorBusesPage.createBus('29A-' + Math.floor(Math.random() * 90000 + 10000), 'Limousine');
  I.wait(3);
  I.saveScreenshot('TC_OP_BUS_003_create_bus.png');
});

// === EMPLOYEES (Nhân viên) ===

Scenario('TC_OP_EMP_001: Hiển thị danh sách nhân viên', ({ I, operatorEmployeesPage }) => {
  operatorEmployeesPage.open();
  operatorEmployeesPage.seeEmployeesTable();
  I.saveScreenshot('TC_OP_EMP_001_employees_list.png');
});

// === TRIPS (Chuyến xe) ===

Scenario('TC_OP_TRIP_001: Hiển thị danh sách chuyến xe', ({ I, operatorTripsPage }) => {
  operatorTripsPage.open();
  operatorTripsPage.seeTripsTable();
  I.saveScreenshot('TC_OP_TRIP_001_trips_list.png');
});

Scenario('TC_OP_TRIP_002: Mở modal tạo chuyến xe mới', ({ I, operatorTripsPage }) => {
  operatorTripsPage.open();
  operatorTripsPage.clickCreateTrip();
  I.seeElement(operatorTripsPage.modal.tripModal);
  I.saveScreenshot('TC_OP_TRIP_002_create_trip_modal.png');
});

// === VOUCHERS ===

Scenario('TC_OP_VOUCHER_001: Hiển thị danh sách voucher', ({ I, operatorVouchersPage }) => {
  operatorVouchersPage.open();
  operatorVouchersPage.seeVouchersTable();
  operatorVouchersPage.seeStatistics();
  I.saveScreenshot('TC_OP_VOUCHER_001_vouchers_list.png');
});

Scenario('TC_OP_VOUCHER_002: Tạo voucher mới', ({ I, operatorVouchersPage }) => {
  const code = 'TEST' + Date.now();
  operatorVouchersPage.open();
  operatorVouchersPage.createVoucher(code, 'Voucher test tự động', '10');
  I.wait(3);
  I.saveScreenshot('TC_OP_VOUCHER_002_create_voucher.png');
});

Scenario('TC_OP_VOUCHER_003: Tìm kiếm voucher', ({ I, operatorVouchersPage }) => {
  operatorVouchersPage.open();
  operatorVouchersPage.searchVoucher('TEST');
  I.wait(3);
  I.saveScreenshot('TC_OP_VOUCHER_003_search_voucher.png');
});

// === REPORTS (Báo cáo) ===

Scenario('TC_OP_REPORT_001: Hiển thị trang báo cáo doanh thu', ({ I, operatorReportsPage }) => {
  operatorReportsPage.open();
  operatorReportsPage.seeReportsPage();
  operatorReportsPage.seeStatistics();
  I.saveScreenshot('TC_OP_REPORT_001_reports_page.png');
});
