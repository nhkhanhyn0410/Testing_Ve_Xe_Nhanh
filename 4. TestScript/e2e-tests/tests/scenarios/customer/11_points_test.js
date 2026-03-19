const users = require("../../data/users.json");

Feature("Loyalty Points - Tích điểm thưởng");

Before(({ I }) => {
  I.amOnPage("/");
  I.waitForElement("body", 30);
});

function loginAndOpenLoyaltyFromProfile(I, loginPage, loyaltyPage) {
  const user = users.customer.valid;
  loginPage.open();
  loginPage.login(user.email, user.password);

  // Bắt buộc đăng nhập thành công trước khi vào menu hồ sơ.
  I.wait(5);
  I.dontSeeInCurrentUrl("/login");
  I.dontSeeElement(loginPage.messages.error);

  // Vào hồ sơ và mở mục Loyalty program.
  loyaltyPage.openFromProfileMenu();
  I.seeInCurrentUrl("/loyalty");
}

Scenario(
  "TC_LOYALTY_001: Đăng nhập thành công và thấy mục Loyalty program trong hồ sơ",
  ({ I, loginPage, loyaltyPage }) => {
    loginAndOpenLoyaltyFromProfile(I, loginPage, loyaltyPage);
    loyaltyPage.seeLoyaltyOverview();
    I.saveScreenshot("TC_LOYALTY_001_overview.png");
  },
);

Scenario(
  "TC_LOYALTY_002: Xem lịch sử tích điểm",
  ({ I, loginPage, loyaltyPage }) => {
    loginAndOpenLoyaltyFromProfile(I, loginPage, loyaltyPage);
    loyaltyPage.openHistoryTab();
    loyaltyPage.seeHistoryTimeline();
    I.saveScreenshot("TC_LOYALTY_002_history.png");
  },
);

Scenario(
  "TC_LOYALTY_003: Xem quyền lợi theo hạng thành viên",
  ({ I, loginPage, loyaltyPage }) => {
    loginAndOpenLoyaltyFromProfile(I, loginPage, loyaltyPage);
    loyaltyPage.seeTierBenefits();
    I.saveScreenshot("TC_LOYALTY_003_benefits.png");
  },
);

Scenario(
  "TC_LOYALTY_004: Đổi điểm thưởng lấy voucher",
  ({ I, loginPage, loyaltyPage }) => {
    loginAndOpenLoyaltyFromProfile(I, loginPage, loyaltyPage);
    loyaltyPage.openRedeemTab();
    loyaltyPage.selectFirstVoucherAndRedeem();
    loyaltyPage.seeRedeemResult();
    I.saveScreenshot("TC_LOYALTY_004_redeem_success.png");
  },
);

Scenario(
  "TC_LOYALTY_005: Đổi điểm khi không đủ điểm",
  ({ I, loginPage, loyaltyPage }) => {
    loginAndOpenLoyaltyFromProfile(I, loginPage, loyaltyPage);
    loyaltyPage.openRedeemTab();
    loyaltyPage.selectHighestCostVoucher();
    loyaltyPage.confirmRedeem();
    loyaltyPage.seeInsufficientPointsMessage();
    I.saveScreenshot("TC_LOYALTY_005_not_enough_points.png");
  },
);
