const { I } = inject();

module.exports = {
  elements: {
    pageHeading: 'h1, h2, .ant-typography',
    routeInfoSection: '//*[contains(. ,"Thông tin lộ trình") or contains(. ,"Chi tiết chuyến") or contains(. ,"Giờ khởi hành") or contains(. ,"Nhà xe")]',
    seatMap: '.seat-available, .seat-selected, .seat-booked, [class*="seat-"]',
    availableSeat: '.seat-available',
    selectedSeat: '.seat-selected',
    bookedSeat: '.seat-booked',
    pendingSeat: '.seat-pending, .seat-holding, .seat-reserved',
    pickupPointCard: '//div[contains(@class,"ant-card") and .//span[text()="Điểm đón"]]//div[contains(@class,"cursor-pointer")] | //section[.//*[contains(text(),"Điểm đón")]]//*[contains(@class,"cursor-pointer") or self::label or self::button]',
    dropoffPointCard: '//div[contains(@class,"ant-card") and .//span[text()="Điểm trả"]]//div[contains(@class,"cursor-pointer")] | //section[.//*[contains(text(),"Điểm trả")]]//*[contains(@class,"cursor-pointer") or self::label or self::button]',
    selectedPickupPoint: '//*[contains(text(),"Điểm đón")]/ancestor::*[contains(@class,"ant-card") or self::section][1]//*[contains(@class,"selected") or contains(@class,"active") or @aria-checked="true"]',
    selectedDropoffPoint: '//*[contains(text(),"Điểm trả")]/ancestor::*[contains(@class,"ant-card") or self::section][1]//*[contains(@class,"selected") or contains(@class,"active") or @aria-checked="true"]',
    continueButton: '//button[contains(.,"Tiếp tục")]',
    selectedSeatsDisplay: '//*[contains(.,"Ghế đã chọn") or contains(.,"Ghế chọn")]',
    totalPrice: '//*[contains(.,"Tổng cộng") or contains(.,"Tổng tiền") or contains(.,"Thành tiền")]',
    tripMeta: '//*[contains(.,"Nhà xe") or contains(.,"Giờ khởi hành") or contains(.,"Giá vé")]',
    emptySeatWarning: '//*[contains(.,"Vui lòng chọn ít nhất 1 ghế")]',
    loadingSpinner: '.ant-spin, .ant-spin-spinning',
  },

  waitForPageLoad() {
    I.waitForElement('body', 30);
    I.waitForInvisible(this.elements.loadingSpinner, 30);
    I.wait(3);
  },

  seeTripDetail() {
    I.waitForElement(this.elements.routeInfoSection, 30);
    I.seeElement(this.elements.tripMeta);
  },

  seeSeatMap() {
    I.waitForElement(this.elements.seatMap, 30);
  },
seeBookedSeatDisabled() {
  I.waitForElement(this.elements.bookedSeat, 15);
  I.seeElement(`${this.elements.bookedSeat}[disabled]`);
},
  seeSeatStatuses() {
   this.seeSeatMap();
  I.seeElement(this.elements.availableSeat);
  },

  selectFirstAvailableSeat() {
    I.waitForElement(this.elements.availableSeat, 30);
    I.click(locate(this.elements.availableSeat).first());
    I.wait(1);
  },

  selectAvailableSeats(count) {
    I.waitForElement(this.elements.availableSeat, 10);
    for (let i = 0; i < count; i++) {
      I.click(locate(this.elements.availableSeat).at(i + 1));
      I.wait(0.5);
    }
  },

  clickFirstSelectedSeat() {
    I.waitForElement(this.elements.selectedSeat, 15);
    I.click(locate(this.elements.selectedSeat).first());
    I.wait(1);
  },

  clickFirstBookedSeat() {
    I.waitForElement(this.elements.bookedSeat, 15);
    I.click(locate(this.elements.bookedSeat).first());
    I.wait(1);
  },

  selectFirstPickupPoint() {
    I.waitForElement(this.elements.pickupPointCard, 30);
    I.click(locate(this.elements.pickupPointCard).first());
    I.wait(1);
  },

  selectFirstDropoffPoint() {
    I.waitForElement(this.elements.dropoffPointCard, 30);
    I.click(locate(this.elements.dropoffPointCard).first());
    I.wait(1);
  },

  clickContinue() {
    I.click(this.elements.continueButton);
    I.wait(2);
  },

seeContinueDisabled() {
  I.seeElement('//button[contains(.,"Tiếp tục") and @disabled]');
},
  
  seeSeatSelected() {
    I.seeElement(this.elements.selectedSeat);
    I.seeElement(this.elements.selectedSeatsDisplay);
    I.seeElement(this.elements.totalPrice);
  },

  seeSeatSelectionCleared() {
    I.dontSeeElement(this.elements.selectedSeat);
  },

  seeMultipleSeatsSelected(expectedCount = 2) {
    I.seeNumberOfVisibleElements(this.elements.selectedSeat, expectedCount);
    I.seeElement(this.elements.totalPrice);
  },

  seeBookedSeatRemainsBooked() {
    I.seeElement(this.elements.bookedSeat);
    I.dontSeeElement(this.elements.selectedSeat);
  },

  seePickupPointSelected() {
  I.waitForElement(this.elements.pickupPointCard, 30);
},

seeDropoffPointSelected() {
  I.waitForElement(this.elements.dropoffPointCard, 30);
},

  seeSeatRequiredWarning() {
    I.seeElement(this.elements.emptySeatWarning);
  }
};