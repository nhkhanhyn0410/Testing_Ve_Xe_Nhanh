const users = require('../../data/users.json');

Feature('Operator - Quản lý voucher (CRUD, kích hoạt/vô hiệu)');

const operator = users.operator.valid;
const timestamp = Date.now();

const newVoucherData = {
  code: `GIAM20-${timestamp}`,
  description: 'Giảm 20%',
  discountType: 'Phần trăm (%)',
  discountValue: '20',
  usagePerUser: '1',
};

const duplicateVoucherData = {
  code: 'PHUONGTRANG10',
  description: 'Voucher trùng mã để kiểm tra validate',
  discountType: 'Phần trăm (%)',
  discountValue: '10',
  usagePerUser: '1',
};

const existingVoucherCode = 'PHUONGTRANG10';

Before(({ I, operatorLoginPage }) => {
  I.clearCookie();
  operatorLoginPage.open();
  operatorLoginPage.login(operator.email, operator.password);

  I.waitForElement('body', 30);
  I.wait(2);
  I.seeInCurrentUrl('/operator');
});

Scenario('TC_OP_VCH_001: Hiển thị danh sách voucher', ({ I, operatorVouchersPage }) => {
  operatorVouchersPage.open();
  operatorVouchersPage.seeVoucherList();

  I.saveScreenshot('TC_OP_VCH_001_voucher_list.png');
});

Scenario('TC_OP_VCH_002: Tạo voucher mới thành công', ({ I, operatorVouchersPage }) => {
  operatorVouchersPage.open();
  operatorVouchersPage.clickCreateVoucher();
  operatorVouchersPage.fillVoucherForm(newVoucherData);
  operatorVouchersPage.selectStartDateToday();
  operatorVouchersPage.selectEndDatePlus30Days();
  operatorVouchersPage.submitCreateVoucher();

  operatorVouchersPage.ensureBackToVoucherList();
  operatorVouchersPage.searchVoucherByCode(newVoucherData.code);
  operatorVouchersPage.seeVoucherInList(newVoucherData.code);
  operatorVouchersPage.seeVoucherStatus(newVoucherData.code, 'Hoạt động');

  I.saveScreenshot('TC_OP_VCH_002_create_voucher_success.png');
});

Scenario('TC_OP_VCH_003: Tạo voucher với mã trùng', ({ I, operatorVouchersPage }) => {
  operatorVouchersPage.open();
  operatorVouchersPage.clickCreateVoucher();
  operatorVouchersPage.fillVoucherForm(duplicateVoucherData);

  // testcase fail mong đợi: tập trung check validate mã trùng
  operatorVouchersPage.submitCreateVoucher();
  operatorVouchersPage.seeDuplicateVoucherError();

  I.saveScreenshot('TC_OP_VCH_003_duplicate_voucher_code.png');
});

Scenario('TC_OP_VCH_004: Vô hiệu hóa voucher', ({ I, operatorVouchersPage }) => {
  operatorVouchersPage.open();
  operatorVouchersPage.searchVoucherByCode(existingVoucherCode);
  operatorVouchersPage.seeVoucherInList(existingVoucherCode);
  operatorVouchersPage.toggleVoucherStatus(existingVoucherCode);

  operatorVouchersPage.ensureBackToVoucherList();
  operatorVouchersPage.searchVoucherByCode(existingVoucherCode);
  operatorVouchersPage.seeVoucherInList(existingVoucherCode);
  operatorVouchersPage.seeVoucherStatusInRow(existingVoucherCode, ['Tắt', 'Đã tắt', 'Inactive']);

  I.saveScreenshot('TC_OP_VCH_004_disable_voucher.png');
});