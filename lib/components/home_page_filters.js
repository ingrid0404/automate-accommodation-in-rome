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
    await super.sendKeysToElementByXpath(
      "//input[@data-testid='structured-search-input-field-query']",
      this.location,
    );
  }

  async validateLocation() {
    await super.getAttributeByXpath(
      "//input[@data-testid='structured-search-input-field-query']",
      "value",
      this.location,
    );
  }
  async addIntervalToDatePicker() {
    await super.clickWhenClickableByCss(
      "div[data-testid='structured-search-input-field-split-dates-0'][role='button']",
    );
    await super.waitForElementByXpath(
      "//div[@data-testid='structured-search-input-field-dates-panel']",
    );
    let currentMonthString = getStringMonthFromDate(this.currentDate);
    let currentYear = this.currentDate.getFullYear();

    await super.waitForElementByXpath(
      `//h2[text()="${currentMonthString} ${currentYear}"]`,
    );

    let startDateComputed = computeDateFormat(this.startDate);
    let endDateComputed = computeDateFormat(this.endDate);

    let countNumber = getNumberOfMonthBetweenDates(
      this.currentDate,
      this.startDate,
    );

    await this.moveArrow(countNumber);

    await super.clickWhenClickableByXpath(
      `//div[@data-testid='${startDateComputed}']`,
    );
    countNumber = getNumberOfMonthBetweenDates(this.startDate, this.endDate);
    await this.moveArrow(countNumber);

    await super.clickWhenClickableByXpath(
      `//div[@data-testid='${endDateComputed}']`,
    );
  }

  async validateIntervalInDatePicker() {
    let startDateText = await super.getTextFromElementByXpath(
      "//div[@data-testid='structured-search-input-field-split-dates-0']/div/div[2]",
    );
    assert.equal(
      startDateText,
      getDateText(this.startDate),
      "Start date value does not match expected start date value",
    );

    let endDateText = await super.getTextFromElementByXpath(
      "//div[@data-testid='structured-search-input-field-split-dates-1']/div/div[2]",
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
      "//button[@data-testid='structured-search-input-search-button']",
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
