const assert = require("assert");
const BasePage = require("./base_page");
const MapComponent = require("../components/map_component");
const ResultsSection = require("../components/results_section");
const AdvancedFilters = require("../components/advanced_filters");

class ResultsPage extends BasePage {
  constructor(
    driver,
    waitTimeout = 10000,
    location,
    startDate,
    endDate,
    numberOfAdults,
    numberOfChildren,
    amenities = [],
    numberOfBedrooms = 0,
    targetUrl = "",
    websiteTitle = "",
  ) {
    super(driver, waitTimeout, targetUrl, websiteTitle);
    this.numberOfBedrooms = numberOfBedrooms;
    this.mapComponent = new MapComponent(driver, waitTimeout);
    this.resultsSection = new ResultsSection(
      driver,
      waitTimeout,
      location,
      startDate,
      endDate,
      numberOfAdults,
      numberOfChildren,
    );
    this.advancedFilters = new AdvancedFilters(
      driver,
      waitTimeout,
      amenities,
      numberOfBedrooms,
    );
  }

  async waitForPageToLoad() {
    this.log("Wait for Results page to load");
    await this.mapComponent.waitForSectionToLoad();
    await this.resultsSection.waitForSectionToLoad();
  }

  async checkResultsSection() {
    await this.resultsSection.waitForSectionToLoad();
    await this.resultsSection.checkFilterInformation();
    await this.resultsSection.checkCardResults();
  }
  async refresh() {
    await super.refresh();
  }

  async checkNumberOfBeds() {
    await this.resultsSection.checkNumberOfBeds(this.numberOfBedrooms);
  }

  async checkCardAppearsTwoTimes(name) {
    let samePropertyName = await super.waitForElementsByXpath(
      `//span[text()='${name}']`,
    );
    assert.equal(
      samePropertyName.length,
      2,
      "property name does not appear twice",
    );
  }

  async checkMapSection() {
    let cards = await this.resultsSection.getResultsCards();
    let propertyName = await this.resultsSection.getCardIndexName(cards, 0);
    let propertyTitle = await this.resultsSection.getCardIndexTitle(cards, 0);

    let propertyPrice = await this.resultsSection.getPricePerNight(0);

    await this.mapComponent.checkBulletFromMapChangesColorOnHover(
      cards,
      propertyTitle,
      propertyPrice,
    );

    await this.mapComponent.clickOnBulletFromMap(propertyTitle, propertyPrice);
    await this.checkCardAppearsTwoTimes(propertyName);
    await this.resultsSection.checkCardResultsIsDisplayedTwice();
  }

  async clickOnFirstResult() {
    let firstResult = await this.resultsSection.getFirstCard();
    await firstResult.click();
  }

  async openFirstResult() {
    let originalWindow = await super.getOriginalWindow();
    await this.clickOnFirstResult();
    await super.changeToTab("next", false, originalWindow);
  }

  async addAdvancedFilters() {
    await this.advancedFilters.waitForSectionToLoad();
    await this.advancedFilters.submitAdvancedFilters();
  }
  async checkAdvancedFilters() {
    await this.advancedFilters.checkFiltersAdded();
  }

  async removeAdvancedFilters() {
    await this.advancedFilters.clearAdvancedFilters();
  }
}

module.exports = ResultsPage;
