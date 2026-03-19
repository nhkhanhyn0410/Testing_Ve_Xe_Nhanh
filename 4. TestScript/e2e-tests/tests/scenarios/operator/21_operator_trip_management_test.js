
const users = require('../../data/users.json');

Feature('Operator - Quản lý lịch trình chuyến xe (tạo)');

const operator = users.operator.valid;
const timestamp = Date.now();

const tripTestData = {
  valid: {
  route: 'TP. Hồ Chí Minh - Vũng Tàu',
  bus: 'PT-003 - sleeper (40 ghế)',
  preferredDriver: 'Nguyễn Văn Long - DRV-PT-001',
  tripManager: 'Phạm Văn Nam - TM-PT-002',
  departureDate: '20/04/2026',
  departureTime: '08:00',
  arrivalDate: '20/04/2026',
  arrivalTime: '10:30',
  basePrice: '150000',
  expectedKeywords: [
    'TP. Hồ Chí Minh - Vũng Tàu',
    'PT-003',
    '08:00',
  ],
},
  invalidArrivalTime: {
    route: 'TP. Hồ Chí Minh - Vũng Tàu',
    bus: 'PT-003',
    preferredDriver: 'Nguyễn Văn Long',
    departureDate: '20/04/2026',
    departureTime: '10:00',
    arrivalDate: '20/04/2026',
    arrivalTime: '09:00',
    basePrice: '150000',
    uniqueKeyword: `invalid-trip-${timestamp}`,
  },
missingRoute: {
  route: '',
  bus: 'PT-003 - sleeper (40 ghế)',
  preferredDriver: 'Nguyễn Văn Long - DRV-PT-001',
  tripManager: 'Phạm Văn Nam - TM-PT-002',
  departureDate: '20/04/2026',
  departureTime: '08:00',
  arrivalDate: '20/04/2026',
  arrivalTime: '10:30',
  basePrice: '150000',
},
  searchKeyword: 'TP. Hồ Chí Minh - Đà Lạt',
};

Before(({ I, operatorLoginPage }) => {
  I.clearCookie();
  operatorLoginPage.open();
  operatorLoginPage.login(operator.email, operator.password);
  I.wait(5);
});

Scenario('TC_OP_TRIP_001: Hiển thị danh sách chuyến xe', ({ I, operatorTripsPage }) => {
  operatorTripsPage.open();
  operatorTripsPage.seeTripsTable();
  operatorTripsPage.seeTableHeaders();

  I.saveScreenshot('TC_OP_TRIP_001_trip_list.png');
});

Scenario('TC_OP_TRIP_002: Tạo chuyến xe mới thành công', ({ I, operatorTripsPage }) => {
  operatorTripsPage.open();
  operatorTripsPage.clickCreateTrip();

  operatorTripsPage.fillTripForm({
    route: tripTestData.valid.route,
    bus: tripTestData.valid.bus,
    driver: tripTestData.valid.preferredDriver,
    tripManager: tripTestData.valid.tripManager,
    departureDate: tripTestData.valid.departureDate,
    departureTime: tripTestData.valid.departureTime,
    arrivalDate: tripTestData.valid.arrivalDate,
    arrivalTime: tripTestData.valid.arrivalTime,
    basePrice: tripTestData.valid.basePrice,
  });

  operatorTripsPage.submitTrip();

  operatorTripsPage.seeCreateSuccess();
  operatorTripsPage.seeTripInList(...tripTestData.valid.expectedKeywords);

  I.saveScreenshot('TC_OP_TRIP_002_create_trip_success.png');
});

Scenario('TC_OP_TRIP_003: Tạo chuyến xe với giờ đến nhỏ hơn giờ khởi hành', async ({ I, operatorTripsPage }) => {
  operatorTripsPage.open();
  operatorTripsPage.clickCreateTrip();

  const driverName = (await operatorTripsPage.getAvailableOptionText('Tài xế')).trim();
  const selectedDriver = driverName.includes(tripTestData.invalidArrivalTime.preferredDriver)
    ? tripTestData.invalidArrivalTime.preferredDriver
    : driverName;

  operatorTripsPage.fillTripForm({
    route: tripTestData.invalidArrivalTime.route,
    bus: tripTestData.invalidArrivalTime.bus,
    driver: selectedDriver,
    departureDate: tripTestData.invalidArrivalTime.departureDate,
    departureTime: tripTestData.invalidArrivalTime.departureTime,
    arrivalDate: tripTestData.invalidArrivalTime.arrivalDate,
    arrivalTime: tripTestData.invalidArrivalTime.arrivalTime,
    basePrice: tripTestData.invalidArrivalTime.basePrice,
  });
  operatorTripsPage.submitTrip();

  operatorTripsPage.seeCreateModalStillOpen();
  operatorTripsPage.dontSeeTripInList(tripTestData.invalidArrivalTime.uniqueKeyword);

  I.saveScreenshot('TC_OP_TRIP_003_invalid_arrival_time.png');
});

Scenario('TC_OP_TRIP_004: Tạo chuyến xe thiếu tuyến đường', ({ I, operatorTripsPage }) => {
  operatorTripsPage.open();
  operatorTripsPage.clickCreateTrip();

  operatorTripsPage.fillTripForm({
    bus: tripTestData.missingRoute.bus,
    driver: tripTestData.missingRoute.preferredDriver,
    tripManager: tripTestData.missingRoute.tripManager,
    departureDate: tripTestData.missingRoute.departureDate,
    departureTime: tripTestData.missingRoute.departureTime,
    arrivalDate: tripTestData.missingRoute.arrivalDate,
    arrivalTime: tripTestData.missingRoute.arrivalTime,
    basePrice: tripTestData.missingRoute.basePrice,
  });

  operatorTripsPage.submitTrip();

  operatorTripsPage.seeCreateModalStillOpen();
  operatorTripsPage.seeValidationMessage('Vui lòng chọn tuyến đường');

  I.saveScreenshot('TC_OP_TRIP_004_missing_route.png');
});
Scenario('TC_OP_TRIP_005: Tìm kiếm chuyến xe theo từ khóa', ({ I, operatorTripsPage }) => {
  operatorTripsPage.open();
  operatorTripsPage.searchTrip(tripTestData.searchKeyword);
  operatorTripsPage.seeOnlyRowsMatchingKeyword(tripTestData.searchKeyword);

  I.saveScreenshot('TC_OP_TRIP_005_search_trip.png');
});