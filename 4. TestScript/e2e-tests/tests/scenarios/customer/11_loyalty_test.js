const users = require('../../data/users.json');

Feature('Customer: Chương trình khách hàng thân thiết (STT 11)');

const customer = users.customer.valid;

// Helper: Login customer → vào trang loyalty
async function loginAndGoToLoyalty(I, loginPage, loyaltyPage) {
  loginPage.open();
  loginPage.login(customer.email, customer.password);
  I.wait(15);
  I.dontSeeInCurrentUrl('/login');
  loyaltyPage.open();
}

Before(({ I }) => {
  I.clearCookie();
});

// ========================================================================================
// TC_LOYALTY_001: Hiển thị tổng quan chương trình loyalty
// ========================================================================================
Scenario('TC_LOYALTY_001: Hiển thị tổng quan chương trình loyalty',
  async ({ I, loginPage, loyaltyPage }) => {
    await loginAndGoToLoyalty(I, loginPage, loyaltyPage);

    loyaltyPage.seeLoyaltyOverview();
    loyaltyPage.seePoints();
    I.saveScreenshot('TC_LOYALTY_001_overview.png');
  }
);

// ========================================================================================
// TC_LOYALTY_002: Xem hạng thành viên hiện tại
// ========================================================================================
Scenario('TC_LOYALTY_002: Xem hạng thành viên hiện tại',
  async ({ I, loginPage, loyaltyPage }) => {
    await loginAndGoToLoyalty(I, loginPage, loyaltyPage);

    I.seeElement(loyaltyPage.elements.currentTier);
    I.saveScreenshot('TC_LOYALTY_002_current_tier.png');
  }
);

// ========================================================================================
// TC_LOYALTY_003: Xem lịch sử tích điểm
// ========================================================================================
Scenario('TC_LOYALTY_003: Xem lịch sử tích điểm',
  async ({ I, loginPage, loyaltyPage }) => {
    await loginAndGoToLoyalty(I, loginPage, loyaltyPage);

    loyaltyPage.clickViewHistory();
    I.wait(3);
    I.saveScreenshot('TC_LOYALTY_003_history.png');
  }
);

// ========================================================================================
// TC_LOYALTY_004: Truy cập trang loyalty history trực tiếp
// ========================================================================================
Scenario('TC_LOYALTY_004: Truy cập trang loyalty history trực tiếp',
  async ({ I, loginPage, loyaltyPage }) => {
    loginPage.open();
    loginPage.login(customer.email, customer.password);
    I.wait(15);
    I.dontSeeInCurrentUrl('/login');

    loyaltyPage.openHistory();
    I.wait(3);
    I.saveScreenshot('TC_LOYALTY_004_history_direct.png');
  }
);
