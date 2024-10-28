const assert = require("assert");
const ComponentBase = require("./component_base");

class MapComponent extends ComponentBase {
  constructor(driver, waitTimeout = 10000) {
    super(driver, waitTimeout);
  }

  async waitForSectionToLoad() {
    await super.waitForElementsByXpath('//div[@data-testid="map/GoogleMap"]');
    await super.getAttributeByXpath(
      '//div[@data-testid="map/GoogleMap"]',
      "aria-hidden",
      "false",
    );
  }

  async getBulletFromMap(title, price) {
    let bulletNameAndPrice = `${title}, ${price}`;

    let bulletFromMap = await super.waitForElementByXpath(
      `//span[contains(., '${bulletNameAndPrice}')]/parent::div/parent::div`,
    );
    return bulletFromMap;
  }

  async getBulletBackgroundColor(title, price) {
    let bulletFromMap = await this.getBulletFromMap(title, price);
    let backgroundColor = await super.getCssValueFromElement(
      bulletFromMap,
      "background-color",
    );
    return backgroundColor;
  }

  async clickOnBulletFromMap(title, price) {
    let bulletFromMap = await this.getBulletFromMap(title, price);
    await bulletFromMap.click();
  }

  async checkBulletFromMapChangesColorOnHover(cards, title, price) {
    let bulletElement = await this.getBulletFromMap(title, price);
    let prevBackgroundColor = await this.getBulletBackgroundColor(title, price);

    await super.hoverElement(cards[0]);
    bulletElement = await this.getBulletFromMap(title, price);
    let currentBackgroundColor = await this.getBulletBackgroundColor(
      title,
      price,
    );
    assert(currentBackgroundColor !== prevBackgroundColor);
  }
}

module.exports = MapComponent;
