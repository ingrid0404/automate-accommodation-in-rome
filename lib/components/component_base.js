const { By, until } = require('selenium-webdriver');
const assert = require('assert');

class ComponentBase {
  constructor(driver, waitTimeout = 10000) {
    this.driver = driver;
    this.waitTimeout = waitTimeout;
  }

  async clickWhenClickable(element, waitTimeout = 10000) {
    await this.driver.wait(
      until.elementIsVisible(element),
      waitTimeout
    );
    await this.driver.wait(
      until.elementIsEnabled(element),
      waitTimeout
    );
    await element.click();
  }

  async scrollToElementByXPath(xpath, waitTimeout = 10000) {
    let element = await this.waitForElementByXpath(
      xpath,
      waitTimeout
    );
    await this.driver.actions().scroll(0, 0, 0, 0, element).perform();
    return element;
  }

  async hoverElement(element) {
    let actions = this.driver.actions({ async: true });
    await actions.move({ origin: element }).perform();
  }
  async clickWhenClickableByCss(cssClass, waitTimeout = 10000) {
    const element = await this.waitForElementByCss(
      cssClass,
      waitTimeout
    );
    await this.clickWhenClickable(element, waitTimeout);
  }

  async clickWhenClickableByXpath(xpath, waitTimeout = 10000) {
    const element = await this.waitForElementByXpath(
      xpath,
      waitTimeout
    );
    await this.clickWhenClickable(element, waitTimeout);
  }

  async waitForElementByXpathFromSpecificElement(
    element,
    xpath,
    waitTimeout = 10000
  ) {
    const result = await element.findElement(
      By.xpath(xpath),
      waitTimeout
    );
    return result;
  }
  async waitForElementByXpath(xpath, waitTimeout = 10000) {
    const result = await this.driver.findElement(
      By.xpath(xpath),
      waitTimeout
    );
    return result;
  }

  async waitForElementsByXpath(xpath, waitTimeout = 10000) {
    const result = await this.driver.findElements(
      By.xpath(xpath),
      waitTimeout
    );
    return result;
  }

  async waitForElementByCss(cssClass, waitTimeout = 10000) {
    const result = await this.driver.findElement(
      By.css(cssClass),
      waitTimeout
    );
    return result;
  }

  async sendKeysToElementByXpath(xpat, keys) {
    let element = await this.waitForElementByXpath(xpat);
    await this.driver.wait(
      until.elementIsEnabled(element),
      this.waitTimeout
    );
    await element.sendKeys(keys);
  }

  async getCssValueFromElement(element, cssValue) {
    let value = await element.getCssValue(cssValue);
    return value;
  }
  async getTextOfElementByXpath(element, xpath, waitTimeout = 10000) {
    let c = await element.findElement(By.xpath(xpath), waitTimeout);
    let text = await c.getText();
    return text;
  }
  async getTextFromElementByXpath(xpath) {
    let element = await this.waitForElementByXpath(xpath);
    let text = await element.getText();
    return text;
  }
  async getTextFromElement(element) {
    let text = await element.getText();
    return text;
  }

  async getTextsFromElementsByXpath(xpath) {
    let elements = await this.waitForElementsByXpath(xpath);
    let texts = [];
    for (let index = 0; index < elements.length; index++) {
      let text = await elements[index].getText();
      texts.push(text);
    }
    return texts;
  }

  async getElementAttribute(element, attribute) {
    let attributeValue = await element.getAttribute(attribute);
    return attributeValue;
  }
  async getAttributeByXpath(xpath, attribute, expectedValue) {
    let element = await this.waitForElementByXpath(xpath);
    let attributeValue = await this.getElementAttribute(
      element,
      attribute
    );
    assert.equal(expectedValue, attributeValue);
  }
}

module.exports = ComponentBase;