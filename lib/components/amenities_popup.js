const assert = require("assert");
const ComponentBase = require("./component_base");

class AmenitiesPopup extends ComponentBase {
  constructor(driver, waitTimeout = 10000, amenities) {
    super(driver, waitTimeout);
    this.amenities = amenities;
  }

  async waitForPopupToLoad() {
    await this.waitForElementByXpath(
      "//div[@aria-label=\"What this place offers\"][@role='dialog']",
    );
  }

  async checkIfAmenitiesArePresent() {
    let visibleAmenities = await this.getTextsFromElementsByXpath(
      "//div[@aria-label=\"What this place offers\"][@role='dialog']//li",
    );
    for (let index = 0; index < this.amenities.length; index++) {
      this.log(
        `Check that the ${this.amenities[index]} option is displayed in the ‘Amenities’ popup under the ‘Amenities’ section.`,
      );
      let regex = new RegExp(`${this.amenities[index]}`, "i");
      let findAmenityName = visibleAmenities.find((amenity) =>
        regex.test(amenity),
      );
      assert(
        findAmenityName,
        `Cannot find ${this.amenities[index]} amenity in the list.`,
      );

      await this.scrollToElementByXPath(
        `//div[@aria-label=\"What this place offers\"][@role='dialog']//li//*[text()='${findAmenityName}']`,
      );
    }
  }
}
module.exports = AmenitiesPopup;
