const { I } = inject();

module.exports = {
  elements: {
    fromCityInput: '#fromCity',
    toCityInput: '#toCity',
    dateInput: '#date',
    searchButton: '//button[contains(.,"Tìm chuyến xe")] | //button[contains(.,"Tìm chuyến xe ngay")]',
    swapButton: '//button[contains(@class,"swap") or contains(@aria-label,"swap") or contains(.,"Đổi chiều")]',
    tripCard: '//*[contains(@class,"trip") and (contains(@class,"card") or contains(@class,"item"))] | //div[contains(@class,"ant-card")][.//button[contains(.,"Chọn chuyến này")]]',
    selectTripButton: '//button[contains(.,"Chọn chuyến này")]',
    loadingSpinner: '.ant-spin-spinning',
    antSelectOption: '//div[contains(@class,"ant-select-item-option")]',
    notification: '//*[contains(@class,"ant-message") or contains(@class,"ant-notification") or contains(@class,"alert")]',
    sortSelect: '//*[self::div or self::button][contains(.,"Sắp xếp") or contains(.,"Sort")]',
    filterPanel: '//*[contains(.,"Bộ lọc") or contains(.,"Lọc")]'
  },

  messages: {
    noResults: ['Không tìm thấy chuyến xe', 'Không có chuyến xe', 'Không tìm thấy'],
    missingFrom: ['Vui lòng nhập điểm đi', 'Vui lòng chọn điểm đi'],
    missingTo: ['Vui lòng nhập điểm đến', 'Vui lòng chọn điểm đến'],
    samePoint: ['Điểm đi và điểm đến không được giống nhau', 'Điểm đi và điểm đến không được trùng nhau']
  },

  _formatDate(date) {
    const d = date || new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  },

  open() {
    I.amOnPage('/trips');
    I.waitForElement('body', 30);
    I.wait(3);
  },

  async selectCity(fieldSelector, city) {
    I.click(fieldSelector);
    I.clearField(fieldSelector);
    I.fillField(fieldSelector, city);
    I.wait(1);
    I.click(`${this.elements.antSelectOption}[contains(normalize-space(.),"${city}")]`);
    I.wait(0.5);
  },

  fillDate(date) {
    const dateStr = date || this._formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000));
    I.click(this.elements.dateInput);
    I.clearField(this.elements.dateInput);
    I.fillField(this.elements.dateInput, dateStr);
    I.pressKey('Escape');
    I.wait(0.5);
  },

  clickSearch() {
    I.click(this.elements.searchButton);
    I.wait(2);
  },

  async searchTrip(from, to, date) {
    I.waitForElement(this.elements.fromCityInput, 30);
    if (from) {
      await this.selectCity(this.elements.fromCityInput, from);
    }
    if (to) {
      await this.selectCity(this.elements.toCityInput, to);
    }
    this.fillDate(date);
    this.clickSearch();
    this.waitForLoadingCompleted();
  },

  waitForLoadingCompleted() {
    I.wait(2);
    try {
      I.waitForInvisible(this.elements.loadingSpinner, 20);
    } catch (error) {
      I.say('Loading spinner không xuất hiện hoặc đã ẩn sẵn.');
    }
  },

  waitForTripsLoaded() {
    this.waitForLoadingCompleted();
    I.waitForElement(this.elements.selectTripButton, 60);
  },

  selectFirstTrip() {
    I.waitForElement(this.elements.selectTripButton, 60);
    I.click(locate(this.elements.selectTripButton).first());
    I.wait(3);
  },

  seeSearchPage() {
    I.see('Tìm chuyến xe');
    I.seeElement(this.elements.fromCityInput);
    I.seeElement(this.elements.toCityInput);
    I.seeElement(this.elements.dateInput);
  },

  seeSearchResults() {
    this.waitForTripsLoaded();
    I.seeElement(this.elements.selectTripButton);
  },

  seeNoResults() {
    this.waitForLoadingCompleted();
    this._seeOneOfTexts(this.messages.noResults);
  },

  seeValidationMessage(messageOptions) {
    this._seeOneOfTexts(Array.isArray(messageOptions) ? messageOptions : [messageOptions]);
  },

  seeTripInformation() {
    this.waitForTripsLoaded();
    this._seeAnyElement([
      '//*[contains(text(),"Giờ khởi hành")]',
      '//*[contains(text(),"Loại xe")]',
      '//*[contains(text(),"Ghế trống")]',
      '//*[contains(text(),"VNĐ") or contains(text(),"đ")]',
      this.elements.tripCard
    ]);
  },

  swapRoute() {
    I.click(this.elements.swapButton);
    I.wait(1);
  },

  seeRouteValues(from, to) {
    I.seeInField(this.elements.fromCityInput, from);
    I.seeInField(this.elements.toCityInput, to);
  },

  applySortOption(optionText) {
    I.click(this.elements.sortSelect);
    I.click(`//div[contains(@class,"ant-select-item-option")][contains(normalize-space(.),"${optionText}")] | //li[contains(normalize-space(.),"${optionText}")]`);
    this.waitForLoadingCompleted();
  },

  openFilterPanel() {
    I.click(this.elements.filterPanel);
    I.wait(1);
  },

  _seeOneOfTexts(texts) {
    let lastError;
    for (const text of texts) {
      try {
        I.see(text);
        return;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error(`None of expected texts were visible: ${texts.join(', ')}`);
  },

  _seeAnyElement(locators) {
    let lastError;
    for (const locator of locators) {
      try {
        I.seeElement(locator);
        return;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error(`None of expected elements were visible: ${locators.join(', ')}`);
  }
};