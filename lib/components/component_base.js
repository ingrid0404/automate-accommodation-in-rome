const { By, until } = require("selenium-webdriver");
const assert = require("assert");

class ComponentBase {
  constructor(driver, waitTimeout = 10000) {
    this.driver = driver;
    this.waitTimeout = waitTimeout;
    this.log = (message) => process.stdout.write(`${message}\n`);
  }

  async clickWhenClickable(element, waitTimeout = 10000) {
    await this.driver.wait(until.elementIsVisible(element), waitTimeout);
    await this.driver.wait(until.elementIsEnabled(element), waitTimeout);
    await element.click();
  }

  async elementNotVisible(xpath, waitTimeout = 10000) {
    try {
      let element = await this.waitForElementByXpath(xpath, waitTimeout);
      let visibility = await this.waitUntilElementIsNotVisible(element);
      return visibility;
    } catch (e) {
      if (e.name === "NoSuchElementError") {
        return true;
      }
      if (e.name === "StaleElementReferenceError") {
        return true;
      }
      if (e.name === "TimeoutError") {
        return true;
      }

      return false;
    }
  }

  async waitUntilElementIsVisible(element, waitTimeout = 10000) {
    let visible = await this.driver.wait(
      until.elementIsVisible(element),
      waitTimeout,
    );
    return visible;
  }

  async waitUntilElementIsNotVisible(element, waitTimeout = 10000) {
    let notVisible = await this.driver.wait(
      until.elementIsNotVisible(element),
      waitTimeout,
    );
    return notVisible;
  }

  async scrollToElement(element) {
    await this.driver.actions().scroll(0, 0, 0, 0, element).perform();
  }

  async scrollToElementByXPath(xpath, waitTimeout = 10000) {
    let element = await this.waitForElementByXpath(xpath, waitTimeout);
    await this.scrollToElement(element);
    return element;
  }

  async hoverElement(element) {
    let actions = this.driver.actions({ async: true });
    await actions.move({ origin: element }).perform();
  }

  async clickWhenClickableByCss(cssClass, waitTimeout = 10000) {
    const element = await this.waitForElementByCss(cssClass, waitTimeout);
    await this.clickWhenClickable(element, waitTimeout);
  }

  async clickWhenClickableByXpath(xpath, waitTimeout = 10000) {
    const element = await this.waitForElementByXpath(xpath, waitTimeout);
    await this.clickWhenClickable(element, waitTimeout);
  }

  async waitForElementByXpathFromSpecificElement(
    element,
    xpath,
    waitTimeout = 10000,
  ) {
    const result = await element.findElement(By.xpath(xpath), waitTimeout);
    return result;
  }

  async waitForElementByXpath(xpath, waitTimeout = 10000) {
    const result = await this.driver.findElement(By.xpath(xpath), waitTimeout);
    return result;
  }

  async waitForElementsByXpath(xpath, waitTimeout = 10000) {
    const result = await this.driver.findElements(By.xpath(xpath), waitTimeout);
    return result;
  }

  async waitForElementById(id, waitTimeout = 10000) {
    const result = await this.driver.findElement(By.id(id), waitTimeout);
    return result;
  }

  async waitForElementByCss(cssClass, waitTimeout = 10000) {
    const result = await this.driver.findElement(By.css(cssClass), waitTimeout);
    return result;
  }

  async sendKeysToElementByXpath(xpath, keys, waitTimeout = 10000) {
    let element = await this.waitForElementByXpath(xpath);
    await this.driver.wait(until.elementIsEnabled(element), waitTimeout);
    await element.sendKeys(keys);
  }

  async sendKeysToElementById(id, keys, waitTimeout = 10000) {
    let element = await this.waitForElementById(id);
    await this.driver.wait(until.elementIsEnabled(element), waitTimeout);
    await element.sendKeys(keys);
  }

  async getCssValueByXPath(xpath, cssValue) {
    let value = await this.driver
      .findElement(By.xpath(xpath))
      .getCssValue(cssValue);
    return value;
  }
  async getCssValueFromElement(element, cssValue) {
    let value = await element.getCssValue(cssValue);
    return value;
  }

  async getTextOfElementByXpath(element, xpath, waitTimeout = 10000) {
    let _element = await element.findElement(By.xpath(xpath), waitTimeout);
    let text = await this.getTextFromElement(_element);
    return text;
  }

  async getTextsOfElementsByXpath(elements, xpath, waitTimeout = 10000) {
    let texts = [];
    for (let index = 0; index < elements.length; index) {
      let text = await this.getTextOfElementByXpath(
        elements[index],
        xpath,
        waitTimeout,
      );
      texts.push(text);
    }
    return texts;
  }

  async getTextFromElementByXpath(xpath) {
    let element = await this.waitForElementByXpath(xpath);
    let text = await this.getTextFromElement(element);
    return text;
  }

  async getTextFromElementById(id) {
    let element = await this.waitForElementById(id);
    let text = await this.getTextFromElement(element);
    return text;
  }

  async getTextFromElement(element) {
    let text = await element.getText();
    return text;
  }

  async getTextsFromElementsByXpath(xpath) {
    let elements = await this.waitForElementsByXpath(xpath);
    let texts = await this.getTextsFromElements(elements);
    return texts;
  }

  async getTextsFromElements(elements) {
    let texts = [];
    for (let index = 0; index < elements.length; index++) {
      let text = await this.getTextFromElement(elements[index]);
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
    let attributeValue = await this.getElementAttribute(element, attribute);
    assert.equal(
      expectedValue,
      attributeValue,
      "Element does not contain expected value",
    );
  }

  async getAttributeById(id, attribute, expectedValue) {
    let element = await this.waitForElementById(id);
    let attributeValue = await this.getElementAttribute(element, attribute);
    assert.equal(
      expectedValue,
      attributeValue,
      "Element does not contain expected value",
    );
  }
}

module.exports = ComponentBase;
