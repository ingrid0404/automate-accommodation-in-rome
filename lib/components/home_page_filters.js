const assert = require("assert");
const { By, until } = require("selenium-webdriver");
const ComponentBase = require("./component_base");
const {
  getNumberOfMonthBetweenDates,
  getStringMonthFromDate,
  getDateText,
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
    await this.waitForElementByXpath("//div[text()='Where']");
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
    this.log(`Enter ${this.location}`);
    await this.sendKeysToElementById(
      "bigsearch-query-location-input",
      this.location,
    );

    this.log("Wait for drop down to be visible");
    let listBox = await this.waitForElementById(
      "bigsearch-query-location-listbox",
    );
    assert(await this.waitUntilElementIsVisible(listBox));

    this.log(`Select ${this.location} as a location`);
    await this.clickWhenClickableByXpath(
      `//*[@id='bigsearch-query-location-listbox']//*[@role='option']//*[text()='${this.location}']`,
    );
  }

  async validateLocation() {
    this.log(`Verify ${this.location} as a location`);
    await this.getAttributeById(
      "bigsearch-query-location-input",
      "value",
      this.location,
    );
  }

  async clickOnCheckInButton() {
    this.log("Click on Check In");
    await this.clickWhenClickableByXpath(
      "//div[text()='Check in']/ancestor::div[@role='button']",
    );
  }

  async checkIfCalendarIsVisible(currentMonthString, currentYear) {
    this.log("Check if calendar is visible");
    await this.waitForElementById("tabs");
    await this.waitForElementByXpath(
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
    this.log(`Pick a date: ${year} ${month} ${date}`);
    let monthTable = await this.getMonthTable(month, year);
    let dateElement = await this.waitForElementByXpathFromSpecificElement(
      monthTable,
      `//div[text()='${date}']//ancestor::td[@role='button'][@aria-disabled="false"]`,
    );
    await this.clickWhenClickable(dateElement);
  }

  async checkDateFromTableIsSelected(year, month, date) {
    let backgroundColor = await this.getCssValueByXPath(
      `//h2[text()="${month} ${year}"]/parent::section/parent::div/following-sibling::table//div[text()='${date}']`,
      "color",
    );
    return backgroundColor;
  }

  async moveArrowToPick(currentDate, dateToPick) {
    let countNumber = getNumberOfMonthBetweenDates(currentDate, dateToPick);

    await this.moveArrow(countNumber);
  }

  async selectAndCheckDateInCalendar(actualDate) {
    let year = actualDate.getFullYear();
    let month = getStringMonthFromDate(actualDate);
    let date = actualDate.getDate();

    let colorBefore = await this.checkDateFromTableIsSelected(
      year,
      month,
      date,
    );

    await this.selectDateFromMothTable(year, month, date);

    let colorAfter = await this.checkDateFromTableIsSelected(year, month, date);

    this.log(`Check date: ${year} ${month} ${date} is selected from calendar`);
    assert.notEqual(
      colorBefore,
      colorAfter,
      `Date ${year} ${month} ${date} was not selected in calendar`,
    );
  }
  async addIntervalToDatePicker() {
    await this.clickOnCheckInButton();

    let currentMonthString = getStringMonthFromDate(this.currentDate);
    let currentYear = this.currentDate.getFullYear();
    await this.checkIfCalendarIsVisible(currentMonthString, currentYear);

    await this.moveArrowToPick(this.currentDate, this.startDate);
    await this.selectAndCheckDateInCalendar(this.startDate);

    await this.moveArrowToPick(this.startDate, this.endDate);
    await this.selectAndCheckDateInCalendar(this.endDate);
  }

  async validateIntervalInDatePicker() {
    let startDateText = await this.getTextFromElementByXpath(
      "//div[text()='Check in']/following-sibling::div",
    );
    assert.equal(
      startDateText,
      getDateText(this.startDate),
      "Start date value does not match expected start date value",
    );

    let endDateText = await this.getTextFromElementByXpath(
      "//div[text()='Check out']/following-sibling::div",
    );
    assert.equal(
      endDateText,
      getDateText(this.endDate),
      "End date value does not match expected end date value",
    );
  }

  async checkIfGuestPanelIsVisible() {
    this.log("Check if guest panel is visible");
    await this.waitForElementById("searchFlow-title-label-adults");
    await this.waitForElementById("searchFlow-title-label-children");
    await this.waitForElementById("searchFlow-title-label-infants");
    await this.waitForElementById("searchFlow-title-label-pets");
  }

  async addGuest() {
    this.log("Select the number of guests as 2 adults and 1 child");
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
    this.log(`Add ${this.numberOfAdults} adults to panel`);
    let increaseAdultsButton =
      await this.getIncreaseButtonById("stepper-adults");
    for (let index = 0; index < this.numberOfAdults; index++) {
      await increaseAdultsButton.click();
    }
    this.log("Check number of children");
    await this.getNumberOfGuestFromPanel("stepper-adults", this.numberOfAdults);
  }

  async addChildren() {
    this.log(`Add ${this.numberOfChildren} children to panel`);
    let increaseChildrenButton =
      await this.getIncreaseButtonById("stepper-children");
    for (let index = 0; index < this.numberOfChildren; index++) {
      await increaseChildrenButton.click();
    }

    this.log("Check number of children");
    await this.getNumberOfGuestFromPanel(
      "stepper-children",
      this.numberOfChildren,
    );
  }

  async checkNumberOfGuests() {
    let actualNumberOfGuests = await this.getTextFromElementByXpath(
      "//div[text()='Who']/following-sibling::div",
    );
    assert.equal(
      actualNumberOfGuests.split(" ")[0],
      this.numberOfAdults + this.numberOfChildren,
    );
  }

  async clickSearchButton() {
    this.log("Search for properties with the selected criteria");
    await this.clickWhenClickableByXpath(
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
    this.log("Click on next month arrow");
    for (let count = 0; count < countNumber; count++) {
      await this.clickWhenClickableByXpath(
        "//button[@aria-label='Move forward to switch to the next month.']",
      );
    }
  }

  async movePrevArrow(countNumber) {
    this.log("Click on previous month arrow");
    for (let count = 0; count < countNumber; count++) {
      await this.clickWhenClickableByXpath(
        "//button[@aria-label='Move backward to switch to the previous month.']",
      );
    }
  }
}

module.exports = HomePageFilters;
