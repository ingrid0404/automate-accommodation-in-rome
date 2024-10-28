const BasePage = require("./base_page");
const HomePageFilters = require("../components/home_page_filters");

class AirbnbPage extends BasePage {
  constructor(
    driver,
    waitTimeout = 10000,
    location,
    currentDate,
    startDate,
    endDate,
    numberOfAdults,
    numberOfChildren,
  ) {
    let targetUrl = "https://www.airbnb.com/";
    let websiteTitle =
      "Airbnb | Vacation rentals, cabins, beach houses, & more";
    super(driver, waitTimeout, targetUrl, websiteTitle);
    this.homePageFilters = new HomePageFilters(
      driver,
      waitTimeout,
      location,
      currentDate,
      startDate,
      endDate,
      numberOfAdults,
      numberOfChildren,
    );
  }

  async navigateToPage() {
    await super.navigate();
  }

  async checkUrl() {
    await super.checkUrl();
  }

  async refresh() {
    await super.refresh();
  }

  async submitFilters() {
    await this.homePageFilters.waitForSectionToLoad();
    await this.homePageFilters.submit();
  }
}

module.exports = AirbnbPage;
