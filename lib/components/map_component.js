const assert = require("assert");
const ComponentBase = require("./component_base");

class MapComponent extends ComponentBase {
  constructor(driver, waitTimeout = 10000) {
    super(driver, waitTimeout);
  }

  async waitForSectionToLoad() {
    this.log("Wait for map component to load");
    await this.waitForElementsByXpath(
      "//div[@aria-roledescription=\"map\"][@role='region'][@aria-roledescription='map']",
    );
    await this.getAttributeByXpath(
      "//div[@aria-roledescription=\"map\"][@role='region'][@aria-roledescription='map']",
      "aria-hidden",
      "false",
    );
  }

  async getBulletFromMap(title, price) {
    let bulletNameAndPrice = `${title}, ${price}`;

    let bulletFromMap = await this.waitForElementByXpath(
      `//span[contains(., '${bulletNameAndPrice}')]/parent::div/parent::div`,
    );
    return bulletFromMap;
  }

  async getBulletBackgroundColor(title, price) {
    let bulletFromMap = await this.getBulletFromMap(title, price);
    let backgroundColor = await this.getCssValueFromElement(
      bulletFromMap,
      "background-color",
    );
    return backgroundColor;
  }

  async clickOnBulletFromMap(title, price) {
    let bulletFromMap = await this.getBulletFromMap(title, price);
    await bulletFromMap.click();
    await this.driver.sleep(500);
  }

  async checkBulletFromMapChangesColorOnHover(cards, title, price) {
    let bulletElement = await this.getBulletFromMap(title, price);
    let prevBackgroundColor = await this.getBulletBackgroundColor(title, price);

    await this.hoverElement(cards[0]);
    bulletElement = await this.getBulletFromMap(title, price);
    let currentBackgroundColor = await this.getBulletBackgroundColor(
      title,
      price,
    );
    assert(
      currentBackgroundColor !== prevBackgroundColor,
      "Pin background color was not changed",
    );
  }
}

module.exports = MapComponent;
