const { Builder } = require("selenium-webdriver");
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

describe("UI test cases", () => {
  let driver;

  let currentDate = new Date();
  let startDate = new Date();
  startDate.setDate(currentDate.getDate() + START_DATE);
  let endDate = new Date();
  endDate.setDate(currentDate.getDate() + END_DATE);

  let airBnbPage;
  let resultsPage;
  let accommodationPage;

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
    await airBnbPage.navigateToPage();
    await airBnbPage.checkUrl();
    await airBnbPage.submitFilters();
  });

  it("test case 01", async () => {
    resultsPage = new ResultsPage(
      driver,
      WAIT_TIMEOUT,
      LOCATION,
      startDate,
      endDate,
      NUMBER_OF_ADULTS,
      NUMBER_OF_CHILDREN,
    );
    resultsPage.log("Start test case 01");
    await resultsPage.waitForPageToLoad();
    // await resultsPage.checkResultsSection();
    resultsPage.log("End of test case 01");
  });

  it("test case 02", async () => {
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
    await resultsPage.addAdvancedFilters();
    await resultsPage.waitForPageToLoad();
    await resultsPage.checkAdvancedFilters(2);
    await resultsPage.checkNumberOfBeds();
    await resultsPage.openFirstResult();
    await accommodationPage.checkAmenitiesAreVisible();
    await resultsPage.removeAdvancedFilters();
    resultsPage.log("End of test case 02");
  });

  it("test case 03", async () => {
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

  after(async () => await driver.quit());
});
