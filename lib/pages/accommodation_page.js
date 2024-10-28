const BasePage = require("./base_page");
class AccommodationPage extends BasePage {
  constructor(
    driver,
    waitTimeout = 10000,
    amenities,
    targetUrl = "",
    websiteTitle = "",
  ) {
    super(driver, waitTimeout, targetUrl, websiteTitle);
    this.amenities = amenities;
  }
  async closeTranslationModalIfExists() {
    try {
      await this.clickWhenClickableByXpath("//button[@aria-label='Close']");
    } catch (e) {
      console.log(e);
    }
  }

  async clickShowAllAmenities() {
    await this.clickWhenClickableByXpath(
      '//button[boolean(number(substring-before(substring-after(., "Show all "), "amenities")))]',
    );
  }
  async checkAmenitiesModalVisible() {
    await this.waitForElementByXpath(
      "//div[@aria-label=\"What this place offers\"][@role='dialog']",
    );
  }

  async checkIfAmenitiesArePresent() {
    let visibleAmenities = await this.getTextFromElementByXpath(
      "//div[@aria-label=\"What this place offers\"][@role='dialog']//li",
    );
  }
}
module.exports = AccommodationPage;
