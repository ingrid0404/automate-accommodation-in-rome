const assert = require('assert');
const ComponentBase = require('./component_base');
const { getDateIntervalText } = require('../utils');

class ResultsSection extends ComponentBase {
  constructor(
    driver,
    waitTimeout = 10000,
    location,
    startDate,
    endDate,
    numberOfAdults,
    numberOfChildren
  ) {
    super(driver, waitTimeout);
    this.location = location;
    this.startDate = startDate;
    this.endDate = endDate;
    this.numberOfAdults = numberOfAdults;
    this.numberOfChildren = numberOfChildren;
  }

  async getFirstResult() {
    let results = await super.waitForElementsByXpath(
      '//div[@data-testid="card-container"]/a'
    );
    return results[0];
  }

  async getIdOfFirstResult() {
    let result = await this.getFirstResult();
    let targetId = await super.getElementAttribute(
      result,
      'aria-labelledby'
    );
    return targetId;
  }
  async checkFilterGuests() {
    let totalNumberOfGuests =
      this.numberOfAdults + this.numberOfChildren;

    let text = await super.getTextFromElementByXpath(
      "//button[@data-testid='little-search-guests']/div[1]"
    );
    assert.equal(text, `${totalNumberOfGuests} guests`);
  }
  async checkFilterLocation() {
    let text = await super.getTextFromElementByXpath(
      "//button[@data-testid='little-search-location']/div"
    );
    assert.equal(text, this.location);
  }

  async checkFilterDates() {
    let text = await super.getTextFromElementByXpath(
      "//button[@data-testid='little-search-anytime']/div"
    );
    let expectedText = getDateIntervalText(
      this.startDate,
      this.endDate
    );
    assert.equal(text, expectedText);
  }

  async checkNumberOfBeds(minimulNumberOfBeds) {
    let cards = await this.getCardsResultsInfo();
    for (let index = 0; index < cards.length; index++) {
      let cardInfoTextArray = cards[index].split('\n');
      let beds = cardInfoTextArray.find((info) =>
        info.includes('bedrooms')
      );
      if (beds) {
        let number = Number(beds.split(' ')[0]);
        assert(number >= minimulNumberOfBeds);
      }
    }
  }

  async checkListings() {
    let containHomeOrApartment = true;

    let listings = await super.getTextsFromElementsByXpath(
      "//div[@data-testid='listing-card-title']"
    );
    for (let index = 0; index < listings.length; index++) {
      let listingName = listings[index];
      if (
        !(
          listingName.includes('home') ||
          listingName.includes('condo') ||
          listingName.includes('apartment')
        )
      ) {
        containHomeOrApartment = false;
        return;
      }
    }
    assert.equal(containHomeOrApartment, true);
  }
  async waitForSectionToLoad() {
    await super.waitForElementByXpath(
      "//div[@data-testid='little-search-icon']"
    );
    await this.driver.sleep(2000);
  }

  async checkFilterInformation() {
    await this.checkFilterLocation();
    await this.checkFilterDates();
    await this.checkFilterGuests();
    await this.checkListings();
  }

  async getResultsCards() {
    let elements = await super.waitForElementsByXpath(
      "//div[@data-testid='card-container']"
    );
    return elements;
  }
  async getCardIndexName(cards, index) {
    let name = await super.getTextOfElementByXpath(
      cards[index],
      "//span[@data-testid='listing-card-name']"
    );
    return name;
  }
  async getCardIndexTitle(cards, index) {
    let title = await super.getTextOfElementByXpath(
      cards[index],
      "//div[@data-testid='listing-card-title']"
    );
    return title;
  }
  async getCardIndexPrice(cards, index) {
    let price = await super.getTextOfElementByXpath(
      cards[index],
      "//div[@data-testid='listing-card-title']"
    );
    return price.split(' ')[0];
  }
  async getCardsResultsInfo() {
    let cards = await super.getTextsFromElementsByXpath(
      "//div[@data-testid='listing-card-title']/parent::div"
    );
    return cards;
  }

  async checkCardResults() {
    let cards = await this.getCardsResultsInfo();
    for (let index = 0; index < cards.length; index++) {
      let cardInfoTextArray = cards[index].split('\n');
      let match =
        cardInfoTextArray.some((card) => /Home/g.test(card)) ||
        cardInfoTextArray.some((card) => /Apartment/g.test(card)) ||
        cardInfoTextArray.some((card) => /Condo/g.test(card)) ||
        cardInfoTextArray.some((card) => /Loft/g.test(card)) ||
        cardInfoTextArray.some((card) => /beds/g.test(card));
      assert(match);
    }
  }

  async checkCardResultsIsDisplayedTwice() {
    let targetId = await this.getIdOfFirstResult();
    let selector = `//div[@aria-labelledby='${targetId}']/div/div[2]`;
    let cards = await super.waitForElementsByXpath(selector);

    assert.equal(cards.length, 2);

    let resultsCardText = await super.getElementAttribute(
      cards[0],
      'innerText'
    );
    let resultsCardTextArray = resultsCardText.split('\n');

    let mapCardText = await super.getElementAttribute(
      cards[1],
      'innerText'
    );
    let mapCardTextArray = mapCardText.split('\n');

    if (
      mapCardTextArray.length === 0 &&
      resultsCardTextArray.length
    ) {
      assert.fail();
    }
    for (let index = 0; index < mapCardTextArray.length; index++) {
      if (!resultsCardTextArray.includes(mapCardTextArray[index])) {
        assert.fail();
      }
    }

    assert(true);
  }
}

module.exports = ResultsSection;
