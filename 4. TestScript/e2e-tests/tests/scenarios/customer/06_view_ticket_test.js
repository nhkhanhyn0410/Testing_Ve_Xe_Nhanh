const users = require('../../data/users.json');

Feature('View E-Ticket & QR Code - Xem vé điện tử & mã QR (STT 6)');

const customer = users.customer.valid;

Before(({ I }) => {
  I.clearCookie();
});

function loginCustomer(I, loginPage) {
  loginPage.open();
  loginPage.login(customer.email, customer.password);
  I.wait(15);
  I.dontSeeInCurrentUrl('/login');
}

Scenario('TC_TICKET_001: Xem danh sách vé đã đặt sau khi đăng nhập',
  ({ I, loginPage, myTicketsPage }) => {
    loginCustomer(I, loginPage);

    myTicketsPage.open();
    myTicketsPage.seeTicketList();
    I.saveScreenshot('TC_TICKET_001_ticket_list.png');
  }
);

Scenario('TC_TICKET_002: Xem chi tiết 1 vé cụ thể',
  ({ I, loginPage, myTicketsPage }) => {
    loginCustomer(I, loginPage);
    myTicketsPage.open();
    myTicketsPage.seeTicketList();
    I.click(locate(myTicketsPage.elements.ticketRow).first());
    I.wait(3);
    I.saveScreenshot('TC_TICKET_002_ticket_detail.png');
  }
);

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

Scenario('TC_TICKET_004: Chưa đăng nhập → truy cập /my-tickets → redirect login',
  ({ I }) => {
    I.clearCookie();
    I.amOnPage('/my-tickets');
    I.wait(5);
    I.seeInCurrentUrl('/login');
    I.saveScreenshot('TC_TICKET_004_unauthenticated.png');
  }
);

Scenario('TC_TICKET_005: Tài khoản chưa đặt vé → danh sách trống',
  ({ I, loginPage, myTicketsPage }) => {
    loginPage.open();
    loginPage.login(customer.email, customer.password);
    I.wait(5);
    myTicketsPage.open();
    I.wait(3);
    I.saveScreenshot('TC_TICKET_005_empty_list.png');
  }
);
