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
    tripsPage.seeSearchResults();
    I.saveScreenshot('TC_SEARCH_001_valid_search.png');
  }
);

Scenario('TC_SEARCH_002: Tìm kiếm chuyến xe không có kết quả',
  async ({ I, tripsPage }) => {
    tripsPage.open();
    await tripsPage.searchTrip('Hà Nội', 'Đà Nẵng', users.booking.daysFromNow);
    tripsPage.seeNoResults();
    I.saveScreenshot('TC_SEARCH_002_no_results.png');
  }
);

Scenario('TC_SEARCH_003: Tìm kiếm khi không nhập thành phố đi',
  async ({ I, tripsPage }) => {
    tripsPage.open();
    await tripsPage.selectCity(tripsPage.elements.toCityInput, 'Vũng Tàu');
    tripsPage.fillDate(users.booking.daysFromNow);
    tripsPage.clickSearch();
    tripsPage.seeValidationMessage(tripsPage.messages.missingFrom);
    I.saveScreenshot('TC_SEARCH_003_missing_from.png');
  }
);

Scenario('TC_SEARCH_004: Tìm kiếm khi không nhập thành phố đến',
  async ({ I, tripsPage }) => {
    tripsPage.open();
    await tripsPage.selectCity(tripsPage.elements.fromCityInput, 'TP. Hồ Chí Minh');
    tripsPage.fillDate(users.booking.daysFromNow);
    tripsPage.clickSearch();
    tripsPage.seeValidationMessage(tripsPage.messages.missingTo);
    I.saveScreenshot('TC_SEARCH_004_missing_to.png');
  }
);

Scenario('TC_SEARCH_005: Tìm kiếm với điểm đi và điểm đến giống nhau',
  async ({ I, tripsPage }) => {
    tripsPage.open();
    await tripsPage.searchTrip('TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', users.booking.daysFromNow);
    tripsPage.seeValidationMessage(tripsPage.messages.samePoint);
    I.saveScreenshot('TC_SEARCH_005_same_route.png');
  }
);

Scenario('TC_SEARCH_006: Hiển thị thông tin chuyến xe trong kết quả tìm kiếm',
  async ({ I, tripsPage }) => {
    const route = users.booking.routes.default;
    const date = users.booking.daysFromNow;

    tripsPage.open();
    await tripsPage.searchTrip(route.from, route.to, date);
    tripsPage.seeTripInformation();
    I.saveScreenshot('TC_SEARCH_006_trip_information.png');
  }
);

Scenario('TC_SEARCH_007: Đối chiều tuyến đường (swap)',
  async ({ I, tripsPage }) => {
    const route = users.booking.routes.default;

    tripsPage.open();
    await tripsPage.selectCity(tripsPage.elements.fromCityInput, route.from);
    await tripsPage.selectCity(tripsPage.elements.toCityInput, route.to);
    tripsPage.swapRoute();
    tripsPage.seeRouteValues(route.to, route.from);
    I.saveScreenshot('TC_SEARCH_007_swap_route.png');
  }
);