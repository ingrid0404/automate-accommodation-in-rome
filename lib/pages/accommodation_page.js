const assert = require("assert");
const BasePage = require("./base_page");
const AmenitiesPopup = require("../components/amenities_popup");
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
    this.amenitiesPopup = new AmenitiesPopup(driver, waitTimeout, amenities);
  }

  async verifyAccomodationName(expectedName) {
    let elementName = await this.getTextFromElementByXpath("//section//h1");
    assert.equal(elementName, expectedName, "Porperty name is not expected");
  }

  async closeTranslationModalIfExists() {
    let modal = await this.waitForElementsByXpath(
      "//button[@aria-label='Close']",
    );
    if (modal.length) {
      await this.clickWhenClickable(modal[0]);
    }
  }

  async clickShowAllAmenities() {
    this.log("Click on Show all amenities");
    await this.clickWhenClickableByXpath(
      '//button[boolean(number(substring-before(substring-after(., "Show all "), "amenities")))]',
    );
  }

  async checkAmenitiesAreVisible() {
    try {
      await this.closeTranslationModalIfExists();
      await this.clickShowAllAmenities();
      await this.amenitiesPopup.waitForPopupToLoad();
      await this.amenitiesPopup.checkIfAmenitiesArePresent();
    } catch (e) {
      console.log(e);
      assert.fail();
    } finally {
      await this.changeToTab("previous", true);
    }
  }
}
module.exports = AccommodationPage;
