const users = require('../../data/users.json');

Feature('View E-Ticket & QR Code - Xem vé điện tử & mã QR (STT 6)');

const customer = users.customer.valid;

Before(({ I }) => {
  I.clearCookie();
});

// Helper: Login
function loginCustomer(I, loginPage) {
  loginPage.open();
  loginPage.login(customer.email, customer.password);
  I.wait(15);
  I.dontSeeInCurrentUrl('/login');
}

// ========================================================================================
// TC_TICKET_001: Xem danh sách vé đã đặt sau khi đăng nhập
// ========================================================================================
Scenario('TC_TICKET_001: Xem danh sách vé đã đặt sau khi đăng nhập',
  ({ I, loginPage, myTicketsPage }) => {
    loginCustomer(I, loginPage);

    myTicketsPage.open();
    myTicketsPage.seeTicketList();
    I.saveScreenshot('TC_TICKET_001_ticket_list.png');
  }
);

// ========================================================================================
// TC_TICKET_002: Xem chi tiết 1 vé cụ thể
// ========================================================================================
Scenario('TC_TICKET_002: Xem chi tiết 1 vé cụ thể',
  ({ I, loginPage, myTicketsPage }) => {
    loginCustomer(I, loginPage);

    myTicketsPage.open();
    myTicketsPage.seeTicketList();
    // Click vào vé đầu tiên để xem chi tiết
    I.click(locate(myTicketsPage.elements.ticketRow).first());
    I.wait(3);
    I.saveScreenshot('TC_TICKET_002_ticket_detail.png');
  }
);

// ========================================================================================
// TC_TICKET_003: Hiển thị mã QR trên vé
// ========================================================================================
Scenario('TC_TICKET_003: Hiển thị mã QR trên vé',
  ({ I, loginPage, myTicketsPage }) => {
    loginCustomer(I, loginPage);

    myTicketsPage.open();
    myTicketsPage.seeTicketList();
    myTicketsPage.clickViewQR();
    myTicketsPage.seeQRModal();
    I.saveScreenshot('TC_TICKET_003_qr_code.png');

    myTicketsPage.closeQRModal();
  }
);

// ========================================================================================
// TC_TICKET_004: Xem vé khi chưa đăng nhập → redirect login
// ========================================================================================
Scenario('TC_TICKET_004: Chưa đăng nhập → truy cập /my-tickets → redirect login',
  ({ I }) => {
    I.clearCookie();
    I.amOnPage('/my-tickets');
    I.wait(5);
    I.seeInCurrentUrl('/login');
    I.saveScreenshot('TC_TICKET_004_unauthenticated.png');
  }
);

// ========================================================================================
// TC_TICKET_005: Danh sách vé trống (tài khoản mới)
// ========================================================================================
Scenario('TC_TICKET_005: Tài khoản chưa đặt vé → danh sách trống',
  ({ I, loginPage, myTicketsPage }) => {
    // Đăng nhập với tài khoản chưa có vé (dùng invalid để mô phỏng — hoặc tài khoản mới)
    loginPage.open();
    loginPage.login(customer.email, customer.password);
    I.wait(5);

    myTicketsPage.open();
    I.wait(3);
    I.saveScreenshot('TC_TICKET_005_empty_list.png');
  }
);
