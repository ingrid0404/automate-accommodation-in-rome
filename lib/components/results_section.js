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

  async getFirstCard() {
    let cards = await super.waitForElementsByXpath(
      '//div[@data-testid="card-container"]',
    );
    return cards[0];
  }
  async getFirstResult() {
    let results = await super.waitForElementsByXpath(
      '//div[@data-testid="card-container"]/a',
    );
    return results[0];
  }

  async getIdOfFirstResult() {
    let result = await this.getFirstResult();
    let targetId = await super.getElementAttribute(result, "aria-labelledby");
    return targetId;
  }
  async checkFilterGuests() {
    let totalNumberOfGuests = this.numberOfAdults + this.numberOfChildren;

    this.log("Expect number of guests to be: " + totalNumberOfGuests);

    let text = await super.getTextFromElementByXpath(
      "//button[@data-testid='little-search-guests']/div[1]",
    );
    assert.equal(
      text,
      `${totalNumberOfGuests} guests`,
      "Incorrect number of guests",
    );
  }
  async checkFilterLocation() {
    this.log("Expect location to be: " + this.location);
    let text = await super.getTextFromElementByXpath(
      "//button[@data-testid='little-search-location']/div",
    );
    assert.equal(
      text,
      this.location,
      "Location value does not match expected location value",
    );
  }

  async checkFilterDates() {
    let expectedText = getDateIntervalText(this.startDate, this.endDate);
    this.log("Expect filter dates to be: " + expectedText);
    let text = await super.getTextFromElementByXpath(
      '//span[text()="Check in / Check out"]/following-sibling::div',
    );
    assert.equal(
      text,
      expectedText,
      "Date interval value does not match expected date interval value",
    );
  }

  async checkNumberOfBeds(minimulNumberOfBeds) {
    let cards = await this.getCardsResultsInfo();
    for (let index = 0; index < cards.length; index++) {
      let cardInfoTextArray = cards[index].split("\n");
      let beds = cardInfoTextArray.find((info) => info.includes("bedrooms"));
      if (beds) {
        let number = Number(beds.split(" ")[0]);
        assert(number >= minimulNumberOfBeds, "Number of beds insufficient");
      }
    }
  }

  async checkListings() {
    this.log("Check listing results are correct according to filters");
    let listings = await super.getTextsFromElementsByXpath(
      "//div[@data-testid='listing-card-title']",
    );
    for (let index = 0; index < listings.length; index++) {
      let listingName = listings[index];
      if (
        !(
          listingName.includes("home") ||
          listingName.includes("condo") ||
          listingName.includes("apartment")
        )
      ) {
        assert.fail(`Listing ${listingName} does not meet filters criteria`);
      }
    }
  }
  async waitForSectionToLoad() {
    this.log("Wait for results section to load");
    let elements = await this.waitForElementsByXpath(
      "//div[@data-testid='card-container']",
    );
    let prices = await this.waitForElementsByXpath(
      "//div[@data-testid='price-availability-row']",
    );
    assert(prices.length > 0, "No results price listed");
    assert(elements.length > 0, "No results cards listed");
  }

  async checkFilterInformation() {
    this.log("Check filter information");
    await this.checkFilterLocation();
    await this.checkFilterDates();
    await this.checkFilterGuests();
    await this.checkListings();
  }

  async getResultsCards() {
    let elements = await super.waitForElementsByXpath(
      "//div[@data-testid='card-container']",
    );
    return elements;
  }
  async getPricePerNight(index) {
    let price = await this.getTextsFromElementsByXpath(
      "//div[@data-testid='price-availability-row']//span[1]/div[1]",
    );
    let priceWithCurrency;
    let splitPrice = price[index].split("\n");
    if (splitPrice.length === 2) {
      priceWithCurrency = splitPrice[0];
    } else priceWithCurrency = splitPrice[1];

    let priceWitoutCurrency = priceWithCurrency.split(" ")[0];
    return priceWitoutCurrency;
  }
  async getCardIndexName(cards, index) {
    let name = await super.getTextOfElementByXpath(
      cards[index],
      "//span[@data-testid='listing-card-name']",
    );
    return name;
  }
  async getCardIndexTitle(cards, index) {
    let title = await super.getTextOfElementByXpath(
      cards[index],
      "//div[@data-testid='listing-card-title']",
    );
    return title;
  }

  async getCardsResultsInfo() {
    let cards = await super.getTextsFromElementsByXpath(
      "//div[@data-testid='listing-card-title']/parent::div",
    );
    return cards;
  }

  async checkCardResults() {
    this.log("Check listing results are correct according to filters");
    let cards = await this.getCardsResultsInfo();
    for (let index = 0; index < cards.length; index++) {
      let cardInfoTextArray = cards[index].split("\n");
      let match =
        cardInfoTextArray.some((card) => /Home/g.test(card)) ||
        cardInfoTextArray.some((card) => /Apartment/g.test(card)) ||
        cardInfoTextArray.some((card) => /Condo/g.test(card)) ||
        cardInfoTextArray.some((card) => /Loft/g.test(card)) ||
        cardInfoTextArray.some((card) => /beds/g.test(card));
      assert(match, `Card result number ${index} does not match filters`);
    }
  }

  async checkCardResultsIsDisplayedTwice() {
    let targetId = await this.getIdOfFirstResult();
    let selector = `//div[@aria-labelledby='${targetId}']/div/div[2]`;
    let cardsWithSameTargetId = await super.waitForElementsByXpath(selector);

    assert.equal(
      cardsWithSameTargetId.length,
      2,
      "The card is not displayed twice",
    );

    let resultsCardText = await super.getElementAttribute(
      cardsWithSameTargetId[0],
      "innerText",
    );
    let resultsCardTextArray = resultsCardText.split("\n");

    let mapCardText = await super.getElementAttribute(
      cardsWithSameTargetId[1],
      "innerText",
    );
    let mapCardTextArray = mapCardText.split("\n");

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
}

module.exports = ResultsSection;
