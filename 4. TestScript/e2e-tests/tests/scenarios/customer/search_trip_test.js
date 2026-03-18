const users = require('../../data/users.json');

Feature('Search Trip - Tìm kiếm chuyến xe');

Before(({ I }) => {
  I.clearCookie();
});

Scenario('TC_SEARCH_001: Tìm kiếm chuyến xe với tuyến đường hợp lệ',
  async ({ I, tripsPage }) => {
    const route = users.booking.routes.default;
    const date = users.booking.daysFromNow;

    tripsPage.open();
    await tripsPage.searchTrip(route.from, route.to, date);
    tripsPage.waitForTripsLoaded();
    I.saveScreenshot('TC_SEARCH_001_valid_search.png');
  }
);

Scenario('TC_SEARCH_002: Hiển thị trang tìm kiếm chuyến xe', ({ I, tripsPage }) => {
  tripsPage.open();
  I.see('Tìm chuyến xe');
  I.saveScreenshot('TC_SEARCH_002_search_page.png');
});

Scenario('TC_SEARCH_003: Tìm kiếm chuyến xe không có kết quả',
  async ({ I, tripsPage }) => {
    tripsPage.open();
    await tripsPage.searchTrip('Hà Nội', 'Cà Mau', users.booking.daysFromNow);
    I.wait(5);
    I.saveScreenshot('TC_SEARCH_003_no_results.png');
  }
);

Scenario('TC_SEARCH_004: Xem chi tiết chuyến + sơ đồ ghế',
  async ({ I, tripsPage, tripDetailPage }) => {
    const route = users.booking.routes.default;
    const date = users.booking.daysFromNow;

    tripsPage.open();
    await tripsPage.searchTrip(route.from, route.to, date);
    tripsPage.waitForTripsLoaded();
    tripsPage.selectFirstTrip();

    tripDetailPage.waitForPageLoad();
    tripDetailPage.seeSeatMap();
    I.saveScreenshot('TC_SEARCH_004_trip_detail_seat_map.png');
  }
);

Scenario('TC_SEARCH_005: Chọn ghế trên sơ đồ',
  async ({ I, tripsPage, tripDetailPage }) => {
    const route = users.booking.routes.default;
    const date = users.booking.daysFromNow;

    tripsPage.open();
    await tripsPage.searchTrip(route.from, route.to, date);
    tripsPage.waitForTripsLoaded();
    tripsPage.selectFirstTrip();

    tripDetailPage.waitForPageLoad();
    tripDetailPage.seeSeatMap();
    tripDetailPage.selectFirstAvailableSeat();
    tripDetailPage.seeSeatSelected();
    I.saveScreenshot('TC_SEARCH_005_seat_selected.png');
  }
);

Scenario('TC_SEARCH_006: Chọn điểm đón và trả khách',
  async ({ I, tripsPage, tripDetailPage }) => {
    const route = users.booking.routes.default;
    const date = users.booking.daysFromNow;

    tripsPage.open();
    await tripsPage.searchTrip(route.from, route.to, date);
    tripsPage.waitForTripsLoaded();
    tripsPage.selectFirstTrip();

    tripDetailPage.waitForPageLoad();
    tripDetailPage.selectFirstAvailableSeat();
    tripDetailPage.selectFirstPickupPoint();
    tripDetailPage.selectFirstDropoffPoint();
    I.saveScreenshot('TC_SEARCH_006_pickup_dropoff.png');
  }
);
