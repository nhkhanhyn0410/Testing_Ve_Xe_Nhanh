const users = require('../../data/users.json');

Feature('Cancel Ticket - Hủy vé');

Before(({ I }) => {
  I.amOnPage('/');
  I.waitForElement('body', 30);
  I.clearCookie();
});

Scenario('TC_CANCEL_001: Hiển thị trang hủy vé', ({ I, cancelTicketPage }) => {
  cancelTicketPage.open();
  I.see('Hủy vé');
  I.saveScreenshot('TC_CANCEL_001_cancel_page.png');
});

Scenario('TC_CANCEL_002: Tra cứu booking bằng mã đặt vé hợp lệ', ({ I, cancelTicketPage }) => {
  cancelTicketPage.open();
  cancelTicketPage.fillBookingId('BK000001');
  cancelTicketPage.fillEmail(users.customer.seed.email);
  cancelTicketPage.fillPhone(users.customer.seed.phone);
  cancelTicketPage.clickSearch();
  I.wait(5);
  I.saveScreenshot('TC_CANCEL_002_booking_found.png');
});

Scenario('TC_CANCEL_003: Tra cứu booking với mã không tồn tại', ({ I, cancelTicketPage }) => {
  cancelTicketPage.open();
  cancelTicketPage.fillBookingId('FAKECODE999');
  cancelTicketPage.fillEmail('fake@email.com');
  cancelTicketPage.fillPhone('0999999999');
  cancelTicketPage.clickSearch();
  I.wait(5);
  I.saveScreenshot('TC_CANCEL_003_booking_not_found.png');
});

Scenario('TC_CANCEL_004: Gửi form hủy vé với trường trống', ({ I, cancelTicketPage }) => {
  cancelTicketPage.open();
  cancelTicketPage.clickSearch();
  I.wait(2);
  I.saveScreenshot('TC_CANCEL_004_empty_fields.png');
});

Scenario('TC_CANCEL_005: Xem chính sách hoàn tiền sau khi tìm thấy booking', ({ I, cancelTicketPage }) => {
  cancelTicketPage.open();
  cancelTicketPage.fillBookingId('BK000001');
  cancelTicketPage.fillEmail(users.customer.seed.email);
  cancelTicketPage.fillPhone(users.customer.seed.phone);
  cancelTicketPage.clickSearch();
  I.wait(5);
  cancelTicketPage.seeBookingInfo();
  I.saveScreenshot('TC_CANCEL_005_refund_policy.png');
});
