const assert = require("assert");
const ComponentBase = require("./component_base");

class AdvancedFilters extends ComponentBase {
  constructor(driver, waitTimeout = 10000, amenities, numberOfBedrooms) {
    super(driver, waitTimeout);
    this.amenities = amenities;
    this.numberOfBedrooms = numberOfBedrooms;
  }

  async waitForSectionToLoad() {
    this.log("Wait for advanced filters to load");
    await this.waitForElementsByXpath(
      '//span[text()="Filters"]/ancestor::button',
    );
  }

  async openAdvancedFiltersModal() {
    this.log("Open the advanced filters popup");
    await this.clickWhenClickableByXpath(
      '//span[text()="Filters"]/ancestor::button',
    );

    await this.waitForElementByXpath(
      "//div[@role='dialog'][@aria-label='Filters']",
    );
  }

  async applyFilters() {
    this.log("Apply the new filters");
    await this.clickWhenClickableByXpath(
      "//div[@role='dialog'][@aria-label='Filters']//footer//a",
    );
  }

  async clickClearFilters() {
    await this.clickWhenClickableByXpath("//footer/button[text()='Clear all']");
  }

  async checkFiltersAdded(numberOfFilters) {
    let advancedFiltersNumber = await this.getTextFromElementByXpath(
      '//span[text()="Filters"]/ancestor::button/following-sibling::div',
    );
    assert(
      Number(advancedFiltersNumber),
      numberOfFilters,
      "Number of advanced filters does not match",
    );
  }

  async getIncreaseButtonById(id) {
    let increaseBtn = await this.waitForElementByXpath(
      `//div[@id='${id}']/button[@aria-label='increase value'][@type='button']`,
    );
    return increaseBtn;
  }

  async getNumberFromPanel(id, expectedNumber) {
    let actualNumber = await this.getTextFromElementByXpath(
      `//div[@id='${id}']/div/span`,
    );

    assert.equal(
      Number(actualNumber.split(" ")[0]),
      expectedNumber,
      `Expected number of is not correct for element: ${id}`,
    );
  }

  async addBedrooms() {
    this.log(`Select the number of bedrooms as ${this.numberOfBedrooms}`);
    let increaseBtn = await this.getIncreaseButtonById(
      "stepper-filter-item-min_bedrooms-stepper",
    );
    // await this.scrollToElement(increaseBtn);

    for (let index = 0; index < this.numberOfBedrooms; index++) {
      await this.clickWhenClickable(increaseBtn);
    }

    await this.getNumberFromPanel(
      "stepper-filter-item-min_bedrooms-stepper",
      this.numberOfBedrooms,
    );
  }

  async addAmenities() {
    await this.clickShowMoreButton();
    for (let index = 0; index < this.amenities.length; index++) {
      await this.addAmenity(this.amenities[index]);
    }
  }

  async addAmenity(amenity) {
    this.log(`Select ${amenity} from the Facilities section.`);
    await this.clickWhenClickableByXpath(
      `//span[text()='${amenity}']/parent::button`,
    );
    await this.getAttributeByXpath(
      `//span[text()='${amenity}']/parent::button`,
      "aria-pressed",
      "true",
    );
  }

  async clickShowMoreButton() {
    await this.clickWhenClickableByXpath(
      "//span[text()='Show more']/parent::button",
    );
  }

  async submitAdvancedFilters() {
    await this.openAdvancedFiltersModal();
    await this.addBedrooms();
    await this.addAmenities();
    await this.applyFilters();
  }

  async clearAdvancedFilters() {
    await this.openAdvancedFiltersModal();
    await this.clickClearFilters();
    await this.applyFilters();
  }
}
module.exports = AdvancedFilters;
