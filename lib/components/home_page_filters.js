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

  async addGuest() {
    await super.clickWhenClickableByXpath(
      "//div[@data-testid='structured-search-input-field-guests-button'][@role='button']",
    );
    await super.waitForElementByXpath(
      "//div[@data-testid='structured-search-input-field-guests-panel']",
    );
    await this.addAdults();
    await this.addChildren();
    await this.checkNumberOfGuests();
  }

  async addAdults() {
    let increaseAdultsButton = await super.waitForElementByXpath(
      "//button[@data-testid='stepper-adults-increase-button'][@type='button']",
    );
    for (let index = 0; index < this.numberOfAdults; index++) {
      await increaseAdultsButton.click();
    }
  }

  async addChildren() {
    let increaseChildrenButton = await super.waitForElementByXpath(
      "//button[@data-testid='stepper-children-increase-button'][@type='button']",
    );
    for (let index = 0; index < this.numberOfChildren; index++) {
      await increaseChildrenButton.click();
    }
  }

  async checkNumberOfGuests() {
    let actualNumberOfGuests = await super.getTextFromElementByXpath(
      "//div[@data-testid='structured-search-input-field-guests-button']/div/div[2]",
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
