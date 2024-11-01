const assert = require("assert");
const ComponentBase = require("./component_base");
const { getDateIntervalText } = require("../utils");

class ResultsSection extends ComponentBase {
  constructor(
    driver,
    waitTimeout = 10000,
    location,
    startDate,
    endDate,
    numberOfAdults,
    numberOfChildren,
  ) {
    super(driver, waitTimeout);
    this.location = location;
    this.startDate = startDate;
    this.endDate = endDate;
    this.numberOfAdults = numberOfAdults;
    this.numberOfChildren = numberOfChildren;
  }

  async getListings() {
    let listings = await this.waitForElementsByXpath(
      "//div[@id='site-content']//div[@class=\"\"]/div/div[2]/div[@itemprop=\"itemListElement\"]//div[@role='group'][@aria-labelledby]",
    );
    return listings;
  }
  async getListingByIndex(index) {
    let listing = await this.getListings();
    return listing[index];
  }

  async getIdOfResultByIndex(index) {
    let result = await this.getListingByIndex(index);
    let targetId = await this.getElementAttribute(result, "aria-labelledby");
    return targetId;
  }

  async getTitleOfResultsByTargetId(targetId) {
    this.log(`Get title of listing: ${targetId}`);
    let title = await this.getTextFromElementById(targetId);
    return title;
  }

  async getSubtitleOfResultByTargetId(targetId) {
    this.log(`Get Subtitle of listing: ${targetId}`);
    let subtitle = await this.getTextFromElementByXpath(
      `//div[@id='${targetId}']/following-sibling::div[1]`,
    );
    return subtitle;
  }

  async getInfoAboutCardByTargetId(targetId) {
    let info = await this.getTextFromElementByXpath(
      `//div[@id='site-content']//div[@id='${targetId}']/parent::div`,
    );
    info = info.split("\n");
    return info;
  }

  async checkFilterGuests() {
    let totalNumberOfGuests = this.numberOfAdults + this.numberOfChildren;

    this.log("Expect number of guests to be: " + totalNumberOfGuests);

    let text = await this.getTextFromElementByXpath(
      "//span[text()='Guests']/following-sibling::div[1]",
    );
    assert.equal(
      text,
      `${totalNumberOfGuests} guests`,
      "Incorrect number of guests",
    );
  }
  async checkFilterLocation() {
    this.log("Expect location to be: " + this.location);
    let text = await this.getTextFromElementByXpath(
      "//span[text()='Location']/following-sibling::div",
    );
    let regex = new RegExp(`${text}`, "i");
    assert.match(
      this.location,
      regex,
      "Location value does not match expected location value",
    );
  }

  async checkFilterDates() {
    let expectedText = getDateIntervalText(this.startDate, this.endDate);
    this.log("Expect filter dates to be: " + expectedText);
    let text = await this.getTextFromElementByXpath(
      '//span[text()="Check in / Check out"]/following-sibling::div',
    );
    assert.equal(
      text,
      expectedText,
      "Date interval value does not match expected date interval value",
    );
  }

  async checkNumberOfBeds(minimulNumberOfBeds) {
    this.log("Check number of bedrooms to be at least: " + minimulNumberOfBeds);
    let cards = await this.getCardsResultsInfo();
    for (let index = 0; index < cards.length; index++) {
      let cardInfoTextArray = cards[index].split("\n");
      let bedrooms = cardInfoTextArray.find((info) =>
        info.includes("bedrooms"),
      );
      if (bedrooms) {
        let number = Number(bedrooms.split(" ")[0]);
        assert(
          number >= minimulNumberOfBeds,
          "Number of bedrooms insufficient",
        );
      }
    }
  }

  async waitForSectionToLoad() {
    await this.waitForPageToFullyLoad();
    await this.driver.sleep(1000);
    this.log("Wait for results section to load");
    let loading = await this.elementNotVisible("//div[@aria-label='Loading']");
    assert(loading, "Still loading");

    let listing = await this.getListings();
    let prices = await this.getTextsFromElements(listing, "/div/div[last()]");

    assert(prices.length > 0, "No results price listed");
    assert(listing.length > 0, "No results cards listed");
  }

  async checkFilterInformation() {
    this.log(
      " Verify that the applied filters are correct in the results page",
    );
    await this.checkFilterLocation();
    await this.checkFilterDates();
    await this.checkFilterGuests();
  }

  async getPriceOfListingByTargetId(targetId) {
    this.log(`Get price of listing: ${targetId}`);
    let price = await this.getTextFromElementByXpath(
      `//div[@aria-labelledby="${targetId}"]//div[@class=''][@role='presentation']//span[1]/div[1]/span[last()-1]`,
    );
    let priceNumber = price.match(/\d+/g);
    return priceNumber;
  }

  async getCardsResultsInfo() {
    let cards = await this.getListings();
    let texts = await this.getTextsFromElements(cards);
    return texts;
  }

  async checkCardResults() {
    this.log("Verify that the displayed properties match the applied filters");
    let cards = await this.getCardsResultsInfo();
    for (let index = 0; index < cards.length; index++) {
      let cardInfoTextArray = cards[index].split("\n");
      let match =
        cardInfoTextArray.some((card) => /Home/gi.test(card)) ||
        cardInfoTextArray.some((card) => /Villa/gi.test(card)) ||
        cardInfoTextArray.some((card) => /House/gi.test(card)) ||
        cardInfoTextArray.some((card) => /Apartment/gi.test(card)) ||
        cardInfoTextArray.some((card) => /Condo/gi.test(card)) ||
        cardInfoTextArray.some((card) => /Loft/gi.test(card)) ||
        cardInfoTextArray.some((card) => /beds/gi.test(card));
      if (!match) {
        console.log(cardInfoTextArray);
      }
      assert(match, `Card result number ${index} does not match filters`);
    }
  }
}

module.exports = ResultsSection;
