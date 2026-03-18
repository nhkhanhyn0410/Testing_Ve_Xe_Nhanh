const users = require("../../data/users.json");

Feature("Guest Ticket Lookup - Tra cứu vé (Guest OTP)");

Before(({ I }) => {
  I.amOnPage("/");
  I.waitForElement("body", 30);
  I.clearCookie();
});

Scenario(
  "TC_GUEST_001: Hiển thị trang tra cứu vé",
  ({ I, guestTicketLookupPage }) => {
    guestTicketLookupPage.open();
    I.see("Tra cứu vé");
    I.saveScreenshot("TC_GUEST_001_lookup_page.png");
  },
);

Scenario(
  "TC_GUEST_002: Gửi yêu cầu OTP với SĐT hợp lệ",
  ({ I, guestTicketLookupPage }) => {
    const customer = users.customer.seed;

    guestTicketLookupPage.open();
    guestTicketLookupPage.fillPhone(customer.phone);
    guestTicketLookupPage.clickContinue();
    guestTicketLookupPage.seeOTPStep();
    I.saveScreenshot("TC_GUEST_002_otp_step.png");
  },
);

Scenario(
  "TC_GUEST_003: Xác thực OTP với mã demo 123456",
  ({ I, guestTicketLookupPage }) => {
    const customer = users.customer.seed;

    guestTicketLookupPage.open();
    guestTicketLookupPage.fillPhone(customer.phone);
    guestTicketLookupPage.clickContinue();
    guestTicketLookupPage.fillDemoOTP();
    guestTicketLookupPage.clickVerifyOTP();
    I.wait(5);
    I.saveScreenshot("TC_GUEST_003_otp_verified.png");
  },
);

Scenario(
  "TC_GUEST_004: Xác thực OTP với mã sai",
  ({ I, guestTicketLookupPage }) => {
    const customer = users.customer.seed;

    guestTicketLookupPage.open();
    guestTicketLookupPage.fillPhone(customer.phone);
    guestTicketLookupPage.clickContinue();
    guestTicketLookupPage.fillOTP("000000");
    guestTicketLookupPage.clickVerifyOTP();
    I.wait(3);
    I.saveScreenshot("TC_GUEST_004_wrong_otp.png");
  },
);

Scenario(
  "TC_GUEST_005: Tra cứu vé bằng email",
  ({ I, guestTicketLookupPage }) => {
    const customer = users.customer.seed;

    guestTicketLookupPage.open();
    guestTicketLookupPage.fillEmail(customer.email);
    guestTicketLookupPage.clickContinue();
    guestTicketLookupPage.seeOTPStep();
    I.saveScreenshot("TC_GUEST_005_email_lookup.png");
  },
);

Scenario(
  "TC_GUEST_006: Gửi yêu cầu OTP với SĐT không tồn tại",
  ({ I, guestTicketLookupPage }) => {
    guestTicketLookupPage.open();
    guestTicketLookupPage.fillPhone("0999999999");
    guestTicketLookupPage.clickContinue();
    I.wait(3);
    I.saveScreenshot("TC_GUEST_006_phone_not_found.png");
  },
);

Scenario(
  "TC_GUEST_007: Gửi yêu cầu với trường trống",
  ({ I, guestTicketLookupPage }) => {
    guestTicketLookupPage.open();
    guestTicketLookupPage.clickContinue();
    I.wait(2);
    I.saveScreenshot("TC_GUEST_007_empty_fields.png");
  },
);
Scenario(
  "TC_GUEST_008: OTP hết thời gian hiệu lực",
  ({ I, guestTicketLookupPage }) => {
    const customer = users.customer.seed;

    guestTicketLookupPage.open();
    guestTicketLookupPage.fillPhone(customer.phone);
    guestTicketLookupPage.clickContinue();
    I.wait(60);
    guestTicketLookupPage.fillDemoOTP();
    guestTicketLookupPage.clickVerifyOTP();
    guestTicketLookupPage.seeError(guestMessages.expiredOtp);
  },
);
