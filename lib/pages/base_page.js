const assert = require('assert');
const ComponentBase = require('../components/component_base');

class BasePage extends ComponentBase {
  constructor(driver, waitTimeout = 10000, targetUrl, websiteTitle) {
    super(driver, waitTimeout);
    this.targetUrl = targetUrl;
    this.websiteTitle = websiteTitle;
    this.waitTimeout = waitTimeout;
  }

  async navigate() {
    await this.driver.navigate().to(this.targetUrl);
    await this.driver.manage().setTimeouts({ implicit: 10000 });
    await this.waitForTitle();
  }

  async waitForTitle() {
    let title = await this.driver.getTitle();
    assert.equal(this.websiteTitle, title);
  }

  async checkUrl() {
    let currentURL = await this.driver.getCurrentUrl();
    assert.equal(this.targetUrl, currentURL);
  }

  async refresh() {
    await this.driver.navigate().refresh();
  }

  async closeBrowser() {
    await this.driver.quit();
  }
}

module.exports = BasePage;
