const { I } = inject();

module.exports = {

  elements: {
    searchInput: '//input[contains(@placeholder,"Tìm kiếm")]',
    dateRangePicker: '.ant-picker-range',
    ticketTable: '.ant-table',
    ticketRow: '.ant-table-row',
  },

  tabs: {
    upcoming: '//div[contains(@class,"ant-tabs-tab") and contains(.,"Sắp tới")]',
    past: '//div[contains(@class,"ant-tabs-tab") and contains(.,"Đã đi")]',
    cancelled: '//div[contains(@class,"ant-tabs-tab") and contains(.,"Đã hủy")]',
  },

  buttons: {
    viewQR: '//button[.//span[contains(@class,"anticon-qrcode")] or contains(.,"QR") or contains(.,"Xem mã QR")]',
    cancelTicket: '//button[contains(@class,"danger") or .//span[contains(@class,"CloseCircleOutlined")]]',
    back: '//button[.//span[contains(@class,"ArrowLeftOutlined")]]',
  },

  modal: {
    qrModal: '.ant-modal',
    qrImage: '.ant-modal img',
    cancelModal: '.ant-modal',
    cancelReason: '.ant-modal textarea',
    confirmCancel: '.ant-modal .ant-btn-dangerous',
    closeModal: '.ant-modal-close',
  },

  messages: {
    success: '.ant-message-success',
    error: '.ant-message-error',
  },

  open() {
    I.amOnPage('/my-tickets');
    I.waitForElement(this.elements.ticketTable, 30);
  },

  waitForPageLoad() {
    I.waitForElement(this.elements.ticketTable, 30);
    I.waitForInvisible('.ant-spin', 30);
  },

  switchToUpcoming() {
    I.click(this.tabs.upcoming);
    I.wait(2);
  },

  switchToPast() {
    I.click(this.tabs.past);
    I.wait(2);
  },

  switchToCancelled() {
    I.click(this.tabs.cancelled);
    I.wait(2);
  },

  searchTicket(keyword) {
    I.fillField(this.elements.searchInput, keyword);
    I.wait(2);
  },

  clickViewQR(index) {
    const btn = index
      ? locate(this.buttons.viewQR).at(index)
      : locate(this.buttons.viewQR).first();
    I.click(btn);
    I.waitForElement(this.modal.qrModal, 10);
  },

  closeQRModal() {
    I.click(this.modal.closeModal);
    I.wait(1);
  },

  clickCancelTicket(index) {
    const btn = index
      ? locate(this.buttons.cancelTicket).at(index)
      : locate(this.buttons.cancelTicket).first();
    I.click(btn);
    I.waitForElement(this.modal.cancelModal, 10);
  },

  fillCancelReason(reason) {
    I.fillField(this.modal.cancelReason, reason);
  },

  confirmCancel() {
    I.click(this.modal.confirmCancel);
    I.wait(3);
  },

  seeTicketList() {
    I.seeElement(this.elements.ticketTable);
  },

  seeTicketCode(code) {
    I.see(code);
  },

  seeQRModal() {
    I.seeElement(this.modal.qrImage);
  },
};
