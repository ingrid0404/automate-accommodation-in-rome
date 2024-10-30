const { Builder } = require("selenium-webdriver");
const fs = require("fs");
require("dotenv").config();

const BROWSER = process.env.BROWSER ?? "chrome";
const WAIT_TIMEOUT = Number(process.env.WAIT_TIMEOUT) ?? 10000;
const START_DATE = Number(process.env.START_DATE) ?? 7;
const END_DATE = Number(process.env.END_DATE) ?? 14;
const NUMBER_OF_ADULTS = Number(process.env.NUMBER_OF_ADULTS) ?? 2;
const NUMBER_OF_CHILDREN = Number(process.env.NUMBER_OF_CHILDREN) ?? 1;
const LOCATION = process.env.LOCATION ?? "rome";
const AMENITIES = process.env.AMENITIES.split(" ") ?? ["Pool"];
const NUMBER_OF_BEDROOMS = Number(process.env.NUMBER_OF_BEDROOMS) ?? 5;

const AirbnbPage = require("../lib/pages/airbnb_page");
const ResultsPage = require("../lib/pages/results_page");
const AccommodationPage = require("../lib/pages/accommodation_page");

let airBnbPage;
let resultsPage;
let accommodationPage;
let driver;

let currentDate = new Date();
let startDate = new Date();
startDate.setDate(currentDate.getDate() + START_DATE);
let endDate = new Date();
endDate.setDate(currentDate.getDate() + END_DATE);

describe("UI test cases", function () {
  before(async () => {
    driver = await new Builder().forBrowser(BROWSER).build();
    await driver.manage().window().maximize();

    airBnbPage = new AirbnbPage(
      driver,
      WAIT_TIMEOUT,
      LOCATION,
      currentDate,
      startDate,
      endDate,
      NUMBER_OF_ADULTS,
      NUMBER_OF_CHILDREN,
    );
  });

  beforeEach(async function () {
    await airBnbPage.navigateToPage();
    await airBnbPage.checkUrl();
    await airBnbPage.submitFilters();
  });

  afterEach(async function () {
    if (this.currentTest.state !== "passed") {
      console.log("Take screenshot");
      let currentDate = new Date();

      if (!fs.existsSync("./screenshots")) {
        fs.mkdirSync("./screenshots");
      }

      fs.writeFileSync(
        `./screenshots/${this.currentTest.title} ${currentDate.toDateString()}.png`,
        await driver.takeScreenshot(),
        "base64",
      );

      await airBnbPage.navigateToPage();
      await airBnbPage.checkUrl();
      await airBnbPage.submitFilters();
    }
  });

  after(async function () {
    await driver.quit();
  });

  it("test 1 - Verify that the results match the search criteria", async function () {
    resultsPage = new ResultsPage(
      driver,
      WAIT_TIMEOUT,
      LOCATION,
      startDate,
      endDate,
      NUMBER_OF_ADULTS,
      NUMBER_OF_CHILDREN,
    );
    resultsPage.log(
      "Start test case Verify that the results match the search criteria",
    );
    await resultsPage.waitForPageToLoad();
    await resultsPage.checkResultsSection();
    resultsPage.log(
      "End of test case Verify that the results match the search criteria",
    );
  });

  it("test 2 - Verify that the results and details page match the extra filters", async function () {
    resultsPage = new ResultsPage(
      driver,
      WAIT_TIMEOUT,
      LOCATION,
      startDate,
      endDate,
      NUMBER_OF_ADULTS,
      NUMBER_OF_CHILDREN,
      AMENITIES,
      NUMBER_OF_BEDROOMS,
    );
    accommodationPage = new AccommodationPage(driver, WAIT_TIMEOUT, AMENITIES);
    resultsPage.log("Start test case 02");
    await resultsPage.waitForPageToLoad();
    await resultsPage.submitAdvancedFilters();
    await resultsPage.openFirstResult();
    await accommodationPage.checkAmenitiesAreVisible();
    await resultsPage.removeAdvancedFilters();
    resultsPage.log("End of test case 02");
  });

  it("test 3 - Verify that a property is displayed on the map correctly", async function () {
    resultsPage = new ResultsPage(
      driver,
      WAIT_TIMEOUT,
      LOCATION,
      startDate,
      endDate,
      NUMBER_OF_ADULTS,
      NUMBER_OF_CHILDREN,
    );
    resultsPage.log("Start test case 03");
    await resultsPage.waitForPageToLoad();
    await resultsPage.checkMapSection();
    resultsPage.log("End of test case 03");
  });
});
