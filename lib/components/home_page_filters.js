const assert = require("assert");
const ComponentBase = require("./component_base");
const {
  getNumberOfMonthBetweenDates,
  getStringMonthFromDate,
  getDateText,
  computeDateFormat,
} = require("../utils");

class HomePageFilters extends ComponentBase {
  constructor(
    driver,
    waitTimeout = 10000,
    location,
    currentDate,
    startDate,
    endDate,
    numberOfAdults,
    numberOfChildren,
  ) {
    super(driver, waitTimeout);
    this.location = location;
    this.currentDate = currentDate;
    this.startDate = startDate;
    this.endDate = endDate;
    this.numberOfAdults = numberOfAdults;
    this.numberOfChildren = numberOfChildren;
  }

  async waitForSectionToLoad() {
    this.log("Wait for home page filters to load");
    await super.waitForElementByXpath("//div[text()='Where']");
  }

  async submit() {
    await this.addLocation();
    await this.validateLocation();
    await this.addIntervalToDatePicker();
    await this.validateIntervalInDatePicker();
    await this.addGuest();
    await this.clickSearchButton();
  }
  async addLocation() {
    await super.sendKeysToElementById(
      "bigsearch-query-location-input",
      this.location,
    );
  }

  async validateLocation() {
    await super.getAttributeById(
      "bigsearch-query-location-input",
      "value",
      this.location,
    );
  }

  async clickOnCheckInButton() {
    await this.clickWhenClickableByXpath(
      "//div[text()='Check in']/ancestor::div[@role='button']",
    );
  }

  async checkIfCalendarIsVisible(currentMonthString, currentYear) {
    this.log("Check if calendar is visible");
    await this.waitForElementById("tabs");
    await super.waitForElementByXpath(
      `//h2[text()="${currentMonthString} ${currentYear}"]`,
    );
  }

  async getMonthTable(month, year) {
    let table = await this.waitForElementByXpath(
      `//h2[text()="${month} ${year}"]/parent::section/parent::div/following-sibling::table`,
    );
    return table;
  }
  async selectDateFromMothTable(year, month, date) {
    let monthTable = await this.getMonthTable(month, year);
    let dateElement = await this.waitForElementByXpathFromSpecificElement(
      monthTable,
      `//div[text()='${date}']//ancestor::td[@role='button'][@aria-disabled="false"]`,
    );
    await this.clickWhenClickable(dateElement);
  }
  async addIntervalToDatePicker() {
    await this.clickOnCheckInButton();

    let currentMonthString = getStringMonthFromDate(this.currentDate);
    let currentYear = this.currentDate.getFullYear();
    await this.checkIfCalendarIsVisible(currentMonthString, currentYear);

    let countNumber = getNumberOfMonthBetweenDates(
      this.currentDate,
      this.startDate,
    );

    await this.moveArrow(countNumber);

    await this.selectDateFromMothTable(
      this.startDate.getFullYear(),
      getStringMonthFromDate(this.startDate),
      this.startDate.getDate(),
    );

    countNumber = getNumberOfMonthBetweenDates(this.startDate, this.endDate);
    await this.moveArrow(countNumber);

    await this.selectDateFromMothTable(
      this.endDate.getFullYear(),
      getStringMonthFromDate(this.endDate),
      this.endDate.getDate(),
    );
  }

  async validateIntervalInDatePicker() {
    let startDateText = await super.getTextFromElementByXpath(
      "//div[text()='Check in']/following-sibling::div",
    );
    assert.equal(
      startDateText,
      getDateText(this.startDate),
      "Start date value does not match expected start date value",
    );

    let endDateText = await super.getTextFromElementByXpath(
      "//div[text()='Check out']/following-sibling::div",
    );
    assert.equal(
      endDateText,
      getDateText(this.endDate),
      "End date value does not match expected end date value",
    );
  }

  async checkIfGuestPanelIsVisible() {
    await this.waitForElementById("searchFlow-title-label-adults");
    await this.waitForElementById("searchFlow-title-label-children");
    await this.waitForElementById("searchFlow-title-label-infants");
    await this.waitForElementById("searchFlow-title-label-pets");
  }

  async addGuest() {
    await this.clickWhenClickableByXpath(
      "//div[text()='Who']/ancestor::div[@role='button']",
    );
    await this.checkIfGuestPanelIsVisible();
    await this.addAdults();
    await this.addChildren();
    await this.checkNumberOfGuests();
  }

  async getIncreaseButtonById(id) {
    let increaseBtn = await this.waitForElementByXpath(
      `//div[@id='${id}']/button[@aria-label='increase value'][@type='button']`,
    );
    return increaseBtn;
  }

  async getNumberOfGuestFromPanel(id, expectedNumber) {
    let actualNumber = await this.getTextFromElementByXpath(
      `//div[@id='${id}']/div/span`,
    );
    assert.equal(
      Number(actualNumber),
      expectedNumber,
      `Expected number of guest not correct for element: ${id}`,
    );
  }

  async addAdults() {
    let increaseAdultsButton =
      await this.getIncreaseButtonById("stepper-adults");
    for (let index = 0; index < this.numberOfAdults; index++) {
      await increaseAdultsButton.click();
    }
    await this.getNumberOfGuestFromPanel("stepper-adults", this.numberOfAdults);
  }

  async addChildren() {
    let increaseChildrenButton =
      await this.getIncreaseButtonById("stepper-children");
    for (let index = 0; index < this.numberOfChildren; index++) {
      await increaseChildrenButton.click();
    }
    await this.getNumberOfGuestFromPanel(
      "stepper-children",
      this.numberOfChildren,
    );
  }

  async checkNumberOfGuests() {
    let actualNumberOfGuests = await super.getTextFromElementByXpath(
      "//div[text()='Who']/following-sibling::div",
    );
    assert.equal(
      actualNumberOfGuests.split(" ")[0],
      this.numberOfAdults + this.numberOfChildren,
    );
  }

  async clickSearchButton() {
    await super.clickWhenClickableByXpath(
      "//*[text()='Search']/ancestor::button",
    );
  }

  async moveArrow(countNumber) {
    if (countNumber > 0) {
      await this.moveNextArrow(countNumber);
    } else {
      let _countNumber = -countNumber;
      await this.movePrevArrow(_countNumber);
    }
  }

  async moveNextArrow(countNumber) {
    for (let count = 0; count < countNumber; count++) {
      await super.clickWhenClickableByXpath(
        "//button[@aria-label='Move forward to switch to the next month.']",
      );
    }
  }

  async movePrevArrow(countNumber) {
    for (let count = 0; count < countNumber; count++) {
      await super.clickWhenClickableByXpath(
        "//button[@aria-label='Move backward to switch to the previous month.']",
      );
    }
  }
}

module.exports = HomePageFilters;
