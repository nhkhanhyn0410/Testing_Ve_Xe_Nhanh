const users = require('../../data/users.json');

Feature('Trip Detail - Xem chi tiết chuyến + sơ đồ ghế real-time');

Before(({ I }) => {
  I.clearCookie();
});

async function openTripDetail(tripsPage) {
  const route = users.booking.routes.default;
  const bookingDate = users.booking.daysFromNow;

  tripsPage.open();
  await tripsPage.searchTrip(route.from, route.to, bookingDate);
  tripsPage.waitForTripsLoaded();
  tripsPage.selectFirstTrip();
}

Scenario('TC_DETAIL_001: Hien thi trang chi tiet chuyen',
  async ({ I, tripsPage, tripDetailPage }) => {
    await openTripDetail(tripsPage);

    tripDetailPage.waitForPageLoad();
    tripDetailPage.seeTripDetail();
    tripDetailPage.seeSeatMap();
    I.saveScreenshot('TC_DETAIL_001_trip_detail_page.png');
  }
);

Scenario('TC_DETAIL_002: Hien thi so do ghe voi trang thai real-time',
  async ({ I, tripsPage, tripDetailPage }) => {
    await openTripDetail(tripsPage);

    tripDetailPage.waitForPageLoad();
    tripDetailPage.seeSeatStatuses();
    I.saveScreenshot('TC_DETAIL_002_seat_statuses.png');
  }
);

Scenario('TC_DETAIL_003: Chon 1 ghe trong',
  async ({ I, tripsPage, tripDetailPage }) => {
    await openTripDetail(tripsPage);

    tripDetailPage.waitForPageLoad();
    tripDetailPage.selectFirstAvailableSeat();
    tripDetailPage.seeSeatSelected();
    I.saveScreenshot('TC_DETAIL_003_select_one_seat.png');
  }
);

Scenario('TC_DETAIL_004: Bo chon ghe đa chon',
  async ({ I, tripsPage, tripDetailPage }) => {
    await openTripDetail(tripsPage);

    tripDetailPage.waitForPageLoad();
    tripDetailPage.selectFirstAvailableSeat();
    tripDetailPage.seeSeatSelected();
    tripDetailPage.clickFirstSelectedSeat();
    tripDetailPage.seeSeatSelectionCleared();
    I.saveScreenshot('TC_DETAIL_004_unselect_seat.png');
  }
);

Scenario('TC_DETAIL_005: Chon nhieu ghe',
  async ({ I, tripsPage, tripDetailPage }) => {
    await openTripDetail(tripsPage);

    tripDetailPage.waitForPageLoad();
    tripDetailPage.selectAvailableSeats(2);
    tripDetailPage.seeMultipleSeatsSelected(2);
    I.saveScreenshot('TC_DETAIL_005_select_multiple_seats.png');
  }
);

Scenario('TC_DETAIL_006: Kiem tra trang thai ghe sau khi reload',
  async ({ I, tripsPage, tripDetailPage }) => {
    await openTripDetail(tripsPage);

    tripDetailPage.waitForPageLoad();
    tripDetailPage.selectFirstAvailableSeat();
    tripDetailPage.seeSeatSelected();

    I.refreshPage();
    tripDetailPage.waitForPageLoad();
    tripDetailPage.seeSeatSelected();
    I.saveScreenshot('TC_DETAIL_006_reload_selected_seat.png');
  }
);

Scenario('TC_DETAIL_007: Chon diem đon',
  async ({ I, tripsPage, tripDetailPage }) => {
    await openTripDetail(tripsPage);

    tripDetailPage.waitForPageLoad();
    tripDetailPage.selectFirstAvailableSeat();
    tripDetailPage.selectFirstPickupPoint();
    tripDetailPage.seePickupPointSelected();
    I.saveScreenshot('TC_DETAIL_007_select_pickup_point.png');
  }
);

Scenario('TC_DETAIL_008: Chon điem tra',
  async ({ I, tripsPage, tripDetailPage }) => {
    await openTripDetail(tripsPage);

    tripDetailPage.waitForPageLoad();
    tripDetailPage.selectFirstAvailableSeat();
    tripDetailPage.selectFirstPickupPoint();
    tripDetailPage.selectFirstDropoffPoint();
    tripDetailPage.seeDropoffPointSelected();
    I.saveScreenshot('TC_DETAIL_008_select_dropoff_point.png');
  }
);

Scenario('TC_DETAIL_009: Nut tiep tuc bi vo hieu hoa khi chua chon ghe',
  async ({ I, tripsPage, tripDetailPage }) => {
    await openTripDetail(tripsPage);

    tripDetailPage.waitForPageLoad();
    tripDetailPage.seeContinueDisabled();
    I.saveScreenshot('TC_DETAIL_009_continue_disabled_without_seat.png');
  }
);

Scenario('TC_DETAIL_010: Click "Tiep tuc" khi da chon day du',
  async ({ I, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await openTripDetail(tripsPage);

    tripDetailPage.waitForPageLoad();
    tripDetailPage.selectFirstAvailableSeat();
    tripDetailPage.selectFirstPickupPoint();
    tripDetailPage.selectFirstDropoffPoint();
    tripDetailPage.clickContinue();

    passengerInfoPage.waitForPageLoad();
    passengerInfoPage.seePassengerForm();
    I.saveScreenshot('TC_DETAIL_010_continue_success.png');
  }
);
