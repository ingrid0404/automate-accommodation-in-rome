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
    await this.resultsSection.checkFilterInformation();
    await this.resultsSection.checkCardResults();
  }

  async refresh() {
    await this.refresh();
  }

  async checkNumberOfBeds() {
    this.log(
      " Verify that the properties displayed on the first page have at least the number of selected bedrooms",
    );
    await this.resultsSection.checkNumberOfBeds(this.numberOfBedrooms);
  }

  async checkCardAppearsTwoTimes(targetId) {
    this.log(
      " Verify that the details shown in the map popup are the same as the ones shown in the search results",
    );
    let samePropertyName = await this.waitForElementsByXpath(
      `//div[@aria-labelledby='${targetId}']`,
    );
    assert.equal(
      samePropertyName.length,
      2,
      "Property name does not appear twice",
    );

    let infoFromResults =
      await this.resultsSection.getInfoAboutCardByTargetId(targetId);
    let mapInfoListing =
      await this.mapComponent.getInfoFromCardByTargetId(targetId);

    if (mapInfoListing.length === 0 && infoFromResults.length) {
      assert(
        mapCardTextArray.length > 0,
        "There is no card displayed on the map",
      );
    }
    for (let index = 0; index < mapInfoListing.length; index++) {
      assert(
        infoFromResults.includes(mapInfoListing[index]),
        `Does not include the same informations: ${mapInfoListing[index]}`,
      );
    }
  }

  async hoverOverFirstProperty() {
    this.log("Hover over the first property in the results list.");
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
  }

  async clickOnPinFromMap() {
    this.log("Click the property`s pin on the map.");
    let targetId = await this.resultsSection.getIdOfResultByIndex(0);

    let propertyTitle =
      await this.resultsSection.getTitleOfResultsByTargetId(targetId);

    let propertyPrice =
      await this.resultsSection.getPriceOfListingByTargetId(targetId);

    await this.mapComponent.clickOnBulletFromMap(propertyTitle, propertyPrice);
    await this.checkCardAppearsTwoTimes(targetId);
  }

  async clickOnFirstResult() {
    await this.clickOnResultByIndex(0);
  }

  async clickOnResultByIndex(index) {
    let result = await this.resultsSection.getListingByIndex(index);
    await result.click();
  }

  async getSubtitleOfFirstResult() {
    let targetId = await this.resultsSection.getIdOfResultByIndex(0);
    let subtitle =
      await this.resultsSection.getSubtitleOfResultByTargetId(targetId);
    return subtitle;
  }

  async openFirstResult() {
    this.log("Open the details of the first property");
    let originalWindow = await this.getOriginalWindow();
    let subtitle = await this.getSubtitleOfFirstResult();
    await this.clickOnFirstResult();
    await this.changeToTab("next", false, originalWindow);
    return subtitle;
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
