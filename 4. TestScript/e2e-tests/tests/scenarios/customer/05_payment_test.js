const users = require('../../data/users.json');

Feature('Payment - Thanh toán VNPay/Tiền mặt (STT 5)');

const customer = users.customer.valid;
const route = users.booking.routes.default;
const bookingDate = users.booking.daysFromNow;

// Helper: Login → Search → Chọn ghế → Điểm đón/trả → Nhập TT → Đến bước thanh toán
async function goToPaymentStep(I, loginPage, tripsPage, tripDetailPage, passengerInfoPage) {
  loginPage.open();
  loginPage.login(customer.email, customer.password);
  I.wait(15);
  I.dontSeeInCurrentUrl('/login');

  tripsPage.open();
  await tripsPage.searchTrip(route.from, route.to, bookingDate);
  tripsPage.waitForTripsLoaded();
  tripsPage.selectFirstTrip();

  tripDetailPage.waitForPageLoad();
  tripDetailPage.selectFirstAvailableSeat();
  tripDetailPage.selectFirstPickupPoint();
  tripDetailPage.selectFirstDropoffPoint();
  tripDetailPage.clickContinue();

  passengerInfoPage.waitForPageLoad();
  passengerInfoPage.fillContactInfo(customer.fullName, customer.phone, customer.email);
  passengerInfoPage.clickContinuePayment();
  passengerInfoPage.seePaymentStep();
}

Before(({ I }) => {
  I.clearCookie();
});

// ========================================================================================
// TC_PAY_001: Hiển thị bước chọn phương thức thanh toán
// ========================================================================================
Scenario('TC_PAY_001: Hiển thị bước chọn phương thức thanh toán',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await goToPaymentStep(I, loginPage, tripsPage, tripDetailPage, passengerInfoPage);

    I.see('Phương thức thanh toán');
    I.see('Thanh toán khi lên xe');
    I.see('VNPay');
    I.saveScreenshot('TC_PAY_001_payment_methods.png');
  }
);

// ========================================================================================
// TC_PAY_002: Thanh toán tiền mặt thành công
// ========================================================================================
Scenario('TC_PAY_002: Thanh toán tiền mặt thành công',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage, bookingSuccessPage }) => {
    await goToPaymentStep(I, loginPage, tripsPage, tripDetailPage, passengerInfoPage);

    passengerInfoPage.selectCashPayment();
    passengerInfoPage.clickConfirmBooking();

    bookingSuccessPage.waitForPageLoad();
    bookingSuccessPage.seeBookingSuccess();
    bookingSuccessPage.seeBookingCode();
    I.seeInCurrentUrl('/booking/success');
    I.saveScreenshot('TC_PAY_002_cash_success.png');
  }
);

// ========================================================================================
// TC_PAY_003: Thanh toán VNPay → chuyển hướng đến cổng thanh toán
// ========================================================================================
Scenario('TC_PAY_003: Thanh toán VNPay → redirect cổng thanh toán',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await goToPaymentStep(I, loginPage, tripsPage, tripDetailPage, passengerInfoPage);

    passengerInfoPage.selectVNPayPayment();
    // Chờ React re-render button sau khi chọn VNPay
    I.waitForElement(passengerInfoPage.buttons.proceedPayment, 10);
    I.click(passengerInfoPage.buttons.proceedPayment);

    I.wait(15);
    // VNPay redirect ra ngoài domain → URL chứa vnpay hoặc không còn frontend
    I.saveScreenshot('TC_PAY_003_vnpay_redirect.png');
  }
);

// ========================================================================================
// TC_PAY_004: Hiển thị chi tiết đơn hàng trước khi thanh toán
// ========================================================================================
Scenario('TC_PAY_004: Hiển thị chi tiết đơn hàng trước khi thanh toán',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await goToPaymentStep(I, loginPage, tripsPage, tripDetailPage, passengerInfoPage);

    // Xem thông tin đơn hàng tại bước thanh toán
    I.see('Tổng');
    I.saveScreenshot('TC_PAY_004_order_detail.png');
  }
);

// ========================================================================================
// TC_PAY_005: Xác nhận đặt vé mà chưa chọn phương thức thanh toán
// ========================================================================================
Scenario('TC_PAY_005: Chưa chọn PTTT → click xác nhận → cảnh báo',
  async ({ I, loginPage, tripsPage, tripDetailPage, passengerInfoPage }) => {
    await goToPaymentStep(I, loginPage, tripsPage, tripDetailPage, passengerInfoPage);

    // Không chọn phương thức nào, bấm xác nhận ngay
    passengerInfoPage.clickConfirmBooking();

    I.wait(3);
    // Vẫn ở bước thanh toán, chưa chuyển trang
    I.see('Phương thức thanh toán');
    I.dontSeeInCurrentUrl('/booking/success');
    I.saveScreenshot('TC_PAY_005_no_method.png');
  }
);
