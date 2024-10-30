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
    await this.refresh();
  }

  async checkNumberOfBeds() {
    await this.resultsSection.checkNumberOfBeds(this.numberOfBedrooms);
  }

  async checkCardAppearsTwoTimes(targetId) {
    let samePropertyName = await this.waitForElementsByXpath(
      `//div[@aria-labelledby='${targetId}']`,
    );

    assert.equal(
      samePropertyName.length,
      2,
      "Property name does not appear twice",
    );

    let infoFromResults = await this.getTextFromElementByXpath(
      `//div[@id='site-content']//div[@id='${targetId}']/parent::div`,
    );
    let mapInfoListing = await this.getTextFromElementByXpath(
      `//div[@aria-roledescription='map']//div[@id='${targetId}']/parent::div`,
    );

    let resultsCardTextArray = infoFromResults.split("\n");
    let mapCardTextArray = mapInfoListing.split("\n");

    if (mapCardTextArray.length === 0 && resultsCardTextArray.length) {
      assert(
        mapCardTextArray.length > 0,
        "There is no card displayed on the map",
      );
    }
    for (let index = 0; index < mapCardTextArray.length; index++) {
      assert(
        resultsCardTextArray.includes(mapCardTextArray[index]),
        `Does not include the same informations: ${mapCardTextArray[index]}`,
      );
    }
  }

  async checkMapSection() {
    let cards = await this.resultsSection.getListings();
    let targetId = await this.resultsSection.getIdOfResultByIndex(0);

    let propertyTitle =
      await this.resultsSection.getTitleOfResultsByTargetId(targetId);

    let propertyPrice =
      await this.resultsSection.getPriceOfListingByTargetId(targetId);

    await this.mapComponent.checkBulletFromMapChangesColorOnHover(
      cards,
      propertyTitle,
      propertyPrice,
    );

    await this.mapComponent.clickOnBulletFromMap(propertyTitle, propertyPrice);
    await this.checkCardAppearsTwoTimes(targetId);
  }

  async clickOnFirstResult() {
    let firstResult = await this.resultsSection.getListingByIndex(0);
    await firstResult.click();
  }

  async openFirstResult() {
    let originalWindow = await this.getOriginalWindow();
    await this.clickOnFirstResult();
    await this.changeToTab("next", false, originalWindow);
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

  async submitAdvancedFilters() {
    await this.addAdvancedFilters();
    await this.waitForPageToLoad();
    await this.checkAdvancedFilters(2);
    await this.checkNumberOfBeds();
  }
}

module.exports = ResultsPage;
