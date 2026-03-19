const users = require('../../data/users.json');

Feature('Operator: Quản lý xe - CRUD, trạng thái (STT 14)');

const operator = users.operator.valid;

async function loginAndGoToBuses(I, operatorLoginPage, operatorBusesPage) {
  operatorLoginPage.open();
  operatorLoginPage.login(operator.email, operator.password);
  I.wait(15);
  I.dontSeeInCurrentUrl('/login');
  operatorBusesPage.open();
}

Before(({ I }) => {
  I.clearCookie();
});

Scenario('TC_OP_BUS_001: Hiển thị danh sách xe',
  async ({ I, operatorLoginPage, operatorBusesPage }) => {
    await loginAndGoToBuses(I, operatorLoginPage, operatorBusesPage);

    operatorBusesPage.seeBusesTable();
    I.seeElement(operatorBusesPage.elements.tableRow);
    I.saveScreenshot('TC_OP_BUS_001_buses_list.png');
  }
);

Scenario('TC_OP_BUS_002: Thêm xe mới thành công',
  async ({ I, operatorLoginPage, operatorBusesPage }) => {
    await loginAndGoToBuses(I, operatorLoginPage, operatorBusesPage);

    operatorBusesPage.createBus('29A-12345', 'Limousine');

    I.waitForElement(operatorBusesPage.messages.success, 10);
    operatorBusesPage.seeBus('29A-12345');
    I.saveScreenshot('TC_OP_BUS_002_create_success.png');
  }
);


Scenario('TC_OP_BUS_003: Thêm xe với biển số trùng → lỗi',
  async ({ I, operatorLoginPage, operatorBusesPage }) => {
    await loginAndGoToBuses(I, operatorLoginPage, operatorBusesPage);

    // Dùng biển số xe đã có trong seed data (PT-001)
    operatorBusesPage.createBus('PT-001', 'Limousine');

    operatorBusesPage.seeError();
    I.saveScreenshot('TC_OP_BUS_003_duplicate_plate.png');
  }
);

Scenario('TC_OP_BUS_004: Sửa thông tin xe',
  async ({ I, operatorLoginPage, operatorBusesPage }) => {
    await loginAndGoToBuses(I, operatorLoginPage, operatorBusesPage);

    operatorBusesPage.clickEdit();
    operatorBusesPage.editBusNumber('29A-EDITED');
    operatorBusesPage.submitBus();

    // Toast hiển thị nhanh → dùng waitForElement để bắt kịp
    I.waitForElement(operatorBusesPage.messages.success, 10);
    I.saveScreenshot('TC_OP_BUS_004_edit_success.png');
  }
);

Scenario('TC_OP_BUS_005: Thay đổi trạng thái xe (active/inactive)',
  async ({ I, operatorLoginPage, operatorBusesPage }) => {
    await loginAndGoToBuses(I, operatorLoginPage, operatorBusesPage);

    operatorBusesPage.clickEdit();
    operatorBusesPage.selectStatus('Ngừng Hoạt Động');
    operatorBusesPage.submitBus();

    I.waitForElement(operatorBusesPage.messages.success, 10);
    I.saveScreenshot('TC_OP_BUS_005_status_changed.png');
  }
);
