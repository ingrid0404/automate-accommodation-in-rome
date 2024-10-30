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
    await super.waitForElementsByXpath(
      "//button[@data-testid='category-bar-filter-button']",
    );
  }

  async openAdvancedFiltersModal() {
    await this.clickWhenClickableByXpath(
      "//button[@data-testid='category-bar-filter-button']",
    );

    await super.waitForElementByXpath(
      "//div[@role='dialog'][@aria-label='Filters']",
    );
  }

  async applyFilters() {
    await super.clickWhenClickableByXpath("//footer/div/a");
  }

  async clickClearFilters() {
    await super.clickWhenClickableByXpath(
      "//footer/button[text()='Clear all']",
    );
  }

  async checkFiltersAdded(numberOfFilters) {
    let advancedFiltersBtn = await super.getTextFromElementByXpath(
      "//button[@data-testid='category-bar-filter-button']/following-sibling::div",
    );
    assert(Number(advancedFiltersBtn), numberOfFilters);
  }
  async addBedrooms() {
    await super.scrollToElementByXPath(
      "//button[@data-testid='stepper-filter-item-min_bedrooms-stepper-increase-button']",
    );
    for (let index = 0; index < this.numberOfBedrooms; index++) {
      await super.clickWhenClickableByXpath(
        "//button[@data-testid='stepper-filter-item-min_bedrooms-stepper-increase-button']",
      );
    }

    let numberOfBedrooms = await super.getTextFromElementByXpath(
      "//div[@data-testid='stepper-filter-item-min_bedrooms-stepper-value']",
    );
    assert.equal(
      numberOfBedrooms,
      `${this.numberOfBedrooms}+`,
      `Does not contain: ${this.numberOfBedrooms}`,
    );
  }

  async addAmenities() {
    await this.clickShowMoreButton();
    for (let index = 0; index < this.amenities.length; index++) {
      await this.addAmenity(this.amenities[index]);
    }
  }
  async addAmenity(amenity) {
    await super.clickWhenClickableByXpath(
      `//span[text()='${amenity}']/parent::button`,
    );
    await super.getAttributeByXpath(
      `//span[text()='${amenity}']/parent::button`,
      "aria-pressed",
      "true",
    );
  }

  async clickShowMoreButton() {
    await super.clickWhenClickableByXpath(
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
