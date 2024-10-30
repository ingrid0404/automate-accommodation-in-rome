require("dotenv").config();

const TARGET_URL = process.env.WEBSITE ?? "https://www.airbnb.com/";
const WEBSITE_TITLE =
  process.env.WEBSITE_TITLE ??
  "Airbnb | Vacation rentals, cabins, beach houses, & more";

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
    super(driver, waitTimeout, TARGET_URL, WEBSITE_TITLE);
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
    await this.navigate();
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

  async resetTest() {
    this.log("Reset test case");
    await this.navigateToPage();
    await this.checkUrl();
    await this.submitFilters();
  }
}

module.exports = AirbnbPage;
