const users = require('../../data/users.json');

Feature('Guest Ticket Lookup - Tra cứu vé (Guest OTP)');

const guestMessages = {
  invalidOtp: 'Mã OTP không chính xác',
  phoneNotFound: 'Không tìm thấy thông tin',
  emptyLookup: 'Vui lòng nhập SĐT hoặc email',
  expiredOtp: 'Mã OTP đã hết hạn',
};

Before(({ I }) => {
  I.amOnPage('/');
  I.waitForElement('body', 30);
  I.clearCookie();
});

Scenario('TC_GUEST_001: Hiển thị trang tra cứu vé', ({ I, guestTicketLookupPage }) => {
  guestTicketLookupPage.open();
  I.seeElement(guestTicketLookupPage.fields.phone);
  I.seeElement(guestTicketLookupPage.fields.email);
  I.seeElement(guestTicketLookupPage.buttons.continue);
  I.see('Tra cứu vé');
});

Scenario('TC_GUEST_002: Gửi yêu cầu OTP bằng SĐT hợp lệ', ({ guestTicketLookupPage }) => {
  const customer = users.customer.seed;

  guestTicketLookupPage.open();
  guestTicketLookupPage.fillPhone(customer.phone);
  guestTicketLookupPage.clickContinue();
  guestTicketLookupPage.seeOTPStep();
});

Scenario.skip('TC_GUEST_003: Xác thực OTP bằng mã demo 123456', ({ I, guestTicketLookupPage }) => {
  const customer = users.customer.seed;

  guestTicketLookupPage.open();
  guestTicketLookupPage.fillPhone(customer.phone);
  guestTicketLookupPage.clickContinue();
  guestTicketLookupPage.fillDemoOTP();
  guestTicketLookupPage.clickVerifyOTP();
  I.wait(5);
  guestTicketLookupPage.seeTicketList();
});

Scenario.skip('TC_GUEST_004: Xác thực OTP với mã sai', ({ guestTicketLookupPage }) => {
  const customer = users.customer.seed;

  guestTicketLookupPage.open();
  guestTicketLookupPage.fillPhone(customer.phone);
  guestTicketLookupPage.clickContinue();
  guestTicketLookupPage.fillOTP('000000');
  guestTicketLookupPage.clickVerifyOTP();
  guestTicketLookupPage.seeError(guestMessages.invalidOtp);
});

Scenario.skip('TC_GUEST_005: Tra cứu vé bằng email', ({ guestTicketLookupPage }) => {
  const customer = users.customer.seed;

  guestTicketLookupPage.open();
  guestTicketLookupPage.fillEmail(customer.email);
  guestTicketLookupPage.clickContinue();
  guestTicketLookupPage.seeOTPStep();
});

Scenario.skip('TC_GUEST_006: Tra cứu bằng SĐT không tồn tại trong hệ thống', ({ guestTicketLookupPage }) => {
  guestTicketLookupPage.open();
  guestTicketLookupPage.fillPhone('0999999999');
  guestTicketLookupPage.clickContinue();
  guestTicketLookupPage.seeError(guestMessages.phoneNotFound);
});

Scenario.skip('TC_GUEST_007: Gửi yêu cầu với trường trống', ({ guestTicketLookupPage }) => {
  guestTicketLookupPage.open();
  guestTicketLookupPage.clickContinue();
  guestTicketLookupPage.seeError(guestMessages.emptyLookup);
});

Scenario.skip('TC_GUEST_008: OTP hết thời gian hiệu lực', ({ I, guestTicketLookupPage }) => {
  const customer = users.customer.seed;

  guestTicketLookupPage.open();
  guestTicketLookupPage.fillPhone(customer.phone);
  guestTicketLookupPage.clickContinue();
  I.wait(305);
  guestTicketLookupPage.fillDemoOTP();
  guestTicketLookupPage.clickVerifyOTP();
  guestTicketLookupPage.seeError(guestMessages.expiredOtp);
});
