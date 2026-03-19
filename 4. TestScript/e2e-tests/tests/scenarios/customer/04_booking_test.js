const users = require('../../data/users.json');

Feature('Booking Flow - Đặt vé, Thanh toán, Xem vé (STT 4, 5, 6)');

const customer = users.customer.valid;
const route = users.booking.routes.default;
const bookingDate = users.booking.daysFromNow;

async function goToPassengerInfoStep(I, loginPage, tripsPage, tripDetailPage) {
  loginPage.open();
  loginPage.login(customer.email, customer.password);
  I.wait(15);
  I.dontSeeInCurrentUrl('/login');

  tripsPage.open();
  await tripsPage.searchTrip(route.from, route.to, bookingDate);
  tripsPage.waitForTripsLoaded();
  tripsPage.selectFirstTrip();

  tripDetailPage.waitForPageLoad();
  tripDetailPage.seeSeatMap();
  tripDetailPage.selectFirstAvailableSeat();
  tripDetailPage.seeSeatSelected();
  tripDetailPage.selectFirstPickupPoint();
  tripDetailPage.selectFirstDropoffPoint();
  tripDetailPage.clickContinue();
}

Before(({ I }) => {
  I.clearCookie();
});

Scenario('TC_BK_001: Full E2E booking thanh toán tiền mặt',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await goToPassengerInfoStep(I, loginPage, tripsPage, tripDetailPage);

    passengerInfoPage.waitForPageLoad();
    passengerInfoPage.fillContactInfo(customer.fullName, customer.phone, customer.email);
    passengerInfoPage.clickContinuePayment();
    passengerInfoPage.seePaymentStep();
    passengerInfoPage.selectCashPayment();
    passengerInfoPage.clickConfirmBooking();

    passengerInfoPage.seeBookingSuccess();
    I.seeInCurrentUrl('/booking/success');
    I.saveScreenshot('TC_BK_001_success.png');
  }
);

Scenario('TC_BK_002: DT - Thông tin hợp lệ → chuyển bước thanh toán',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await goToPassengerInfoStep(I, loginPage, tripsPage, tripDetailPage);

    passengerInfoPage.waitForPageLoad();
    passengerInfoPage.fillContactInfo('Nguyen Van A', '0901234567', 'test@example.com');
    passengerInfoPage.clickContinuePayment();

    passengerInfoPage.seePaymentStep();
    I.saveScreenshot('TC_BK_002_valid_info.png');
  }
);

Scenario('TC_BK_003: DT - Tên trống → hiển thị lỗi',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await goToPassengerInfoStep(I, loginPage, tripsPage, tripDetailPage);

    passengerInfoPage.waitForPageLoad();
    I.fillField(passengerInfoPage.fields.phone, '0901234567');
    I.fillField(passengerInfoPage.fields.email, 'test@example.com');
    passengerInfoPage.clickContinuePayment();

    I.wait(2);
    I.seeElement('.ant-form-item-explain-error');
    I.dontSee('Phương thức thanh toán');
    I.saveScreenshot('TC_BK_003_name_empty.png');
  }
);

Scenario('TC_BK_004: DT - SĐT trống → hiển thị lỗi',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await goToPassengerInfoStep(I, loginPage, tripsPage, tripDetailPage);

    passengerInfoPage.waitForPageLoad();
    I.fillField(passengerInfoPage.fields.name, 'Nguyen Van A');
    I.fillField(passengerInfoPage.fields.email, 'test@example.com');
    passengerInfoPage.clickContinuePayment();

    I.wait(2);
    I.seeElement('.ant-form-item-explain-error');
    I.dontSee('Phương thức thanh toán');
    I.saveScreenshot('TC_BK_004_phone_empty.png');
  }
);

Scenario('TC_BK_005: DT - Email trống → hiển thị lỗi',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await goToPassengerInfoStep(I, loginPage, tripsPage, tripDetailPage);

    passengerInfoPage.waitForPageLoad();
    I.fillField(passengerInfoPage.fields.name, 'Nguyen Van A');
    I.fillField(passengerInfoPage.fields.phone, '0901234567');
    passengerInfoPage.clickContinuePayment();

    I.wait(2);
    I.seeElement('.ant-form-item-explain-error');
    I.dontSee('Phương thức thanh toán');
    I.saveScreenshot('TC_BK_005_email_empty.png');
  }
);

Scenario('TC_BK_006: DT - Tất cả trường trống → hiển thị 3 lỗi',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await goToPassengerInfoStep(I, loginPage, tripsPage, tripDetailPage);

    passengerInfoPage.waitForPageLoad();
    // Xóa sạch các field (có thể đã auto-fill)
    I.clearField(passengerInfoPage.fields.name);
    I.clearField(passengerInfoPage.fields.phone);
    I.clearField(passengerInfoPage.fields.email);
    passengerInfoPage.clickContinuePayment();

    I.wait(2);
    I.seeNumberOfVisibleElements('.ant-form-item-explain-error', 3);
    I.dontSee('Phương thức thanh toán');
    I.saveScreenshot('TC_BK_006_all_empty.png');
  }
);

Scenario('TC_BK_007: BVA - SĐT 9 số → lỗi',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await goToPassengerInfoStep(I, loginPage, tripsPage, tripDetailPage);

    passengerInfoPage.waitForPageLoad();
    passengerInfoPage.fillContactInfo('Nguyen Van A', '091234567', 'test@example.com');
    passengerInfoPage.clickContinuePayment();

    I.wait(2);
    I.seeElement('.ant-form-item-explain-error');
    I.dontSee('Phương thức thanh toán');
    I.saveScreenshot('TC_BK_007_phone_9digits.png');
  }
);

Scenario('TC_BK_008: BVA - SĐT 10 số → hợp lệ',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await goToPassengerInfoStep(I, loginPage, tripsPage, tripDetailPage);

    passengerInfoPage.waitForPageLoad();
    passengerInfoPage.fillContactInfo('Nguyen Van A', '0912345678', 'test@example.com');
    passengerInfoPage.clickContinuePayment();

    passengerInfoPage.seePaymentStep();
    I.saveScreenshot('TC_BK_008_phone_10digits.png');
  }
);

Scenario('TC_BK_009: BVA - SĐT 11 số → lỗi',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await goToPassengerInfoStep(I, loginPage, tripsPage, tripDetailPage);

    passengerInfoPage.waitForPageLoad();
    passengerInfoPage.fillContactInfo('Nguyen Van A', '09123456789', 'test@example.com');
    passengerInfoPage.clickContinuePayment();

    I.wait(2);
    I.seeElement('.ant-form-item-explain-error');
    I.dontSee('Phương thức thanh toán');
    I.saveScreenshot('TC_BK_009_phone_11digits.png');
  }
);

Scenario('TC_BK_010: EP - SĐT chứa chữ cái → lỗi',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await goToPassengerInfoStep(I, loginPage, tripsPage, tripDetailPage);

    passengerInfoPage.waitForPageLoad();
    passengerInfoPage.fillContactInfo('Nguyen Van A', 'abcdefghij', 'test@example.com');
    passengerInfoPage.clickContinuePayment();

    I.wait(2);
    I.seeElement('.ant-form-item-explain-error');
    I.dontSee('Phương thức thanh toán');
    I.saveScreenshot('TC_BK_010_phone_letters.png');
  }
);

Scenario('TC_BK_011: EP - SĐT không bắt đầu bằng 0 → lỗi',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await goToPassengerInfoStep(I, loginPage, tripsPage, tripDetailPage);

    passengerInfoPage.waitForPageLoad();
    passengerInfoPage.fillContactInfo('Nguyen Van A', '1234567890', 'test@example.com');
    passengerInfoPage.clickContinuePayment();

    I.wait(2);
    I.seeElement('.ant-form-item-explain-error');
    I.dontSee('Phương thức thanh toán');
    I.saveScreenshot('TC_BK_011_phone_no_zero.png');
  }
);

Scenario('TC_BK_012: EP - Email thiếu @ → lỗi',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await goToPassengerInfoStep(I, loginPage, tripsPage, tripDetailPage);

    passengerInfoPage.waitForPageLoad();
    passengerInfoPage.fillContactInfo('Nguyen Van A', '0901234567', 'not-an-email');
    passengerInfoPage.clickContinuePayment();

    I.wait(2);
    I.seeElement('.ant-form-item-explain-error');
    I.dontSee('Phương thức thanh toán');
    I.saveScreenshot('TC_BK_012_email_no_at.png');
  }
);

Scenario('TC_BK_013: EP - Email thiếu domain → lỗi',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await goToPassengerInfoStep(I, loginPage, tripsPage, tripDetailPage);

    passengerInfoPage.waitForPageLoad();
    passengerInfoPage.fillContactInfo('Nguyen Van A', '0901234567', 'test@');
    passengerInfoPage.clickContinuePayment();

    I.wait(2);
    I.seeElement('.ant-form-item-explain-error');
    I.dontSee('Phương thức thanh toán');
    I.saveScreenshot('TC_BK_013_email_no_domain.png');
  }
);

Scenario('TC_BK_014: EP - Email thiếu local part → lỗi',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await goToPassengerInfoStep(I, loginPage, tripsPage, tripDetailPage);

    passengerInfoPage.waitForPageLoad();
    passengerInfoPage.fillContactInfo('Nguyen Van A', '0901234567', '@example.com');
    passengerInfoPage.clickContinuePayment();

    I.wait(2);
    I.seeElement('.ant-form-item-explain-error');
    I.dontSee('Phương thức thanh toán');
    I.saveScreenshot('TC_BK_014_email_no_local.png');
  }
);

Scenario('TC_BK_015: Áp dụng voucher hợp lệ → giảm giá',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await goToPassengerInfoStep(I, loginPage, tripsPage, tripDetailPage);

    passengerInfoPage.waitForPageLoad();
    passengerInfoPage.fillContactInfo(customer.fullName, customer.phone, customer.email);
    passengerInfoPage.clickContinuePayment();
    passengerInfoPage.seePaymentStep();

    I.fillField(passengerInfoPage.fields.voucherCode, 'GIAM10');
    I.click(passengerInfoPage.buttons.applyVoucher);
    I.wait(3);
    I.dontSeeElement('.ant-message-error');
    I.saveScreenshot('TC_BK_015_voucher_valid.png');
  }
);

Scenario('TC_BK_016: Áp dụng voucher không hợp lệ → hiển thị lỗi',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await goToPassengerInfoStep(I, loginPage, tripsPage, tripDetailPage);

    passengerInfoPage.waitForPageLoad();
    passengerInfoPage.fillContactInfo(customer.fullName, customer.phone, customer.email);
    passengerInfoPage.clickContinuePayment();
    passengerInfoPage.seePaymentStep();

    I.fillField(passengerInfoPage.fields.voucherCode, 'FAKECODE');
    I.click(passengerInfoPage.buttons.applyVoucher);
    I.wait(3);
    I.seeElement('.ant-message-error');
    I.saveScreenshot('TC_BK_016_voucher_invalid.png');
  }
);
