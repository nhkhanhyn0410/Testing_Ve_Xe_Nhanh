const users = require('../../data/users.json');

Feature('Operator Management - Quản lý tuyến đường, xe, voucher');

const operator = users.operator.valid;
const routeTestData = {
  create: {
    routeName: 'HCM - Đà Lạt',
    routeCode: `RT-DL-${Date.now()}`,
    originProvince: 'TP. Hồ Chí Minh',
    originDistrict: 'Quận 1',
    destinationProvince: 'Đà Lạt',
    destinationDistrict: 'Phường 3',
    distance: '300',
    estimatedDuration: '360',
    pickupPoints: [
      {
        name: 'Bến xe Miền Đông',
        address: '292 Đinh Bộ Lĩnh, P.26, Q. Bình Thạnh',
      },
    ],
    dropoffPoints: [
      {
        name: 'Bến xe Đà Lạt',
        address: '1 Tô Hiến Thành, P.3, TP. Đà Lạt',
      },
    ],
  },
  edit: {
    routeKeyword: 'BD-DN-001',
    routeDisplay: 'Bình Dương - Đà Nẵng',
    newDistance: '650',
    secondPickupName: 'Bến xe Miền Đông',
    secondPickupAddress: '292 Đinh Bộ Lĩnh, P.26, Q. Bình Thạnh',
  },
};
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
  operatorRoutesPage.seeRouteInList('BD-DN-001');
  I.saveScreenshot('TC_OP_ROUTE_001_routes_list.png');
});

Scenario('TC_OP_ROUTE_002: Tạo tuyến đường mới thành công', ({ I, operatorRoutesPage }) => {
  operatorRoutesPage.open();
  operatorRoutesPage.createRoute(routeTestData.create);
  operatorRoutesPage.seeSuccessToast();
  operatorRoutesPage.seeRouteInList(routeTestData.create.routeCode);
  I.saveScreenshot('TC_OP_ROUTE_002_create_route_success.png');
});

Scenario('TC_OP_ROUTE_003: Tạo tuyến đường với trường bắt buộc trống', ({ I, operatorRoutesPage }) => {
  operatorRoutesPage.open();
  operatorRoutesPage.clickCreateRoute();
  operatorRoutesPage.fillBasicRouteInfo({
    routeName: '',
    routeCode: 'RT-DL-001',
    originProvince: 'TP. Hồ Chí Minh',
    originDistrict: 'Quận 1',
    destinationProvince: 'Đà Lạt',
    destinationDistrict: 'Phường 3',
    distance: '300',
    estimatedDuration: '360',
  });
  operatorRoutesPage.addPickupPoint('Bến xe Miền Đông', '292 Đinh Bộ Lĩnh, P.26, Q. Bình Thạnh', 1);
  operatorRoutesPage.addDropoffPoint('Bến xe Đà Lạt', '1 Tô Hiến Thành, P.3, TP. Đà Lạt', 1);
  operatorRoutesPage.submitRoute();
  operatorRoutesPage.seeValidationMessage('Hãy nhập thông tin cho trường Tên Tuyến');
  I.saveScreenshot('TC_OP_ROUTE_003_create_route_required_validation.png');
});

Scenario('TC_OP_ROUTE_004: Sửa thông tin tuyến đường', ({ I, operatorRoutesPage }) => {
  operatorRoutesPage.open();
  operatorRoutesPage.updateDistance(routeTestData.edit.routeKeyword, routeTestData.edit.newDistance);
  operatorRoutesPage.seeSuccessToast();
  operatorRoutesPage.seeDistanceValue(routeTestData.edit.newDistance);
  I.saveScreenshot('TC_OP_ROUTE_004_update_route_distance.png');
});

Scenario('TC_OP_ROUTE_005: Thêm điểm đón cho tuyến đường', ({ I, operatorRoutesPage }) => {
  operatorRoutesPage.open();
  operatorRoutesPage.addPickupPointForRoute(
    routeTestData.edit.routeKeyword,
    routeTestData.edit.secondPickupName,
    routeTestData.edit.secondPickupAddress,
    2,
  );
  operatorRoutesPage.seeSuccessToast();
  operatorRoutesPage.seeRouteInList(routeTestData.edit.routeKeyword);
  I.saveScreenshot('TC_OP_ROUTE_005_add_pickup_point.png');
});

Scenario('TC_OP_ROUTE_006: Xóa tuyến đường và kiểm tra mã tuyến không còn tồn tại', ({ I, operatorRoutesPage }) => {
  const routeCodeToDelete = routeTestData.create.routeCode;

  operatorRoutesPage.open();
  operatorRoutesPage.seeRouteInList(routeCodeToDelete);

  operatorRoutesPage.deleteRoute(routeCodeToDelete);

  I.wait(2);
  I.refreshPage();
  operatorRoutesPage.waitForPageReady();

  operatorRoutesPage.dontSeeRouteRow(routeCodeToDelete);

  I.saveScreenshot('TC_OP_ROUTE_006_delete_route.png');
});
