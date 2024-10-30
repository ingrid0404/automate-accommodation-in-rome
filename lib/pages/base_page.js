const assert = require("assert");
const fs = require("fs");
const ComponentBase = require("../components/component_base");

class BasePage extends ComponentBase {
  constructor(driver, waitTimeout = 10000, targetUrl, websiteTitle) {
    super(driver, waitTimeout);
    this.targetUrl = targetUrl;
    this.websiteTitle = websiteTitle;
    this.waitTimeout = waitTimeout;
  }

  async getOriginalWindow() {
    const originalWindow = await this.driver.getWindowHandle();
    return originalWindow;
  }
  async getAllWindowHandles() {
    const allWindows = await this.driver.getAllWindowHandles();
    return allWindows;
  }

  async getPrevAndNextTabIndex(currentWindow) {
    const windows = await this.getAllWindowHandles();
    let prevTabIndex = -1,
      currentTabIndex = -1,
      nextTabIndex = -1;
    for (let index = 0; index < windows.length; index++) {
      if (windows[index] === currentWindow) {
        currentTabIndex = index;
        prevTabIndex = index - 1;
        nextTabIndex = index + 1;
        break;
      }
    }
    return {
      prevTabIndex: prevTabIndex,
      currentTabIndex: currentTabIndex,
      nextTabIndex: nextTabIndex,
    };
  }
  async changeToTab(tabOrder, closeCurrentTab = false, currentWindow = null) {
    let originalWindow = currentWindow;
    if (!originalWindow) {
      originalWindow = await this.getOriginalWindow();
    }
    const { prevTabIndex, nextTabIndex } =
      await this.getPrevAndNextTabIndex(originalWindow);

    const windows = await this.getAllWindowHandles();

    let tabIndex = -1;
    switch (tabOrder) {
      case "previous":
        tabIndex = prevTabIndex;
        break;
      case "next":
        tabIndex = nextTabIndex;
        break;
      default:
        assert.fail("Failed to change tab. Incorect order provided");
    }

    if (tabIndex > -1 && tabIndex < windows.length) {
      closeCurrentTab && (await this.driver.close());
      await this.driver.switchTo().window(windows[tabIndex]);
    } else {
      assert.fail("Failed to change tab.");
    }
  }

  async navigate() {
    this.log(`Navigate to: ${this.targetUrl}`);
    await this.driver.navigate().to(this.targetUrl);
    await this.driver.manage().setTimeouts({ implicit: 10000 });
    await this.waitForTitle();
  }

  async waitForTitle() {
    this.log(`Expect title to be: ${this.websiteTitle}`);
    let title = await this.driver.getTitle();
    assert.equal(this.websiteTitle, title, "Website title is not expected");
  }

  async checkUrl() {
    this.log(`Expect url to be: ${this.targetUrl}`);
    let currentURL = await this.driver.getCurrentUrl();
    assert.equal(this.targetUrl, currentURL, "Website url is not expected");
  }

  async refresh() {
    this.log("Refresh browser");
    await this.driver.navigate().refresh();
  }

  async closeBrowser() {
    this.log("Close browser");
    await this.driver.quit();
  }
}

module.exports = BasePage;
