const { Builder, Browser } = require('selenium-webdriver');
const AdvancedFilters = require('../lib/components/advanced_filters');
const AirbnbPage = require('../lib/pages/airbnb_page');
const ResultsPage = require('../lib/pages/results_page');

describe('UI test cases', () => {
  console.log('describe');
  let driver;
  let waitTimeout = 10000;
  let currentDate = new Date();
  let startDate = new Date();
  startDate.setDate(currentDate.getDate() + 7);
  let endDate = new Date();
  endDate.setDate(currentDate.getDate() + 14);
  let numberOfAdults = 2;
  let numberOfChildren = 1;
  let location = 'rome';
  let amenities = ['Pool'];
  let numberOfBedrooms = 5;

  let advancedFilters;
  let airBnbPage;
  let resultsPage;

  before(async () => {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
    airBnbPage = new AirbnbPage(
      driver,
      waitTimeout,
      location,
      currentDate,
      startDate,
      endDate,
      numberOfAdults,
      numberOfChildren
    );
    await airBnbPage.navigateToPage();
    await airBnbPage.checkUrl();

    await airBnbPage.submitFilters();
  });

  it('test case 01', async () => {
    resultsPage = new ResultsPage(
      driver,
      waitTimeout,
      location,
      startDate,
      endDate,
      numberOfAdults,
      numberOfChildren
    );
    await resultsPage.checkResultsSection();
  });

  it('test case 02', async () => {
    resultsPage = new ResultsPage(
      driver,
      waitTimeout,
      location,
      startDate,
      endDate,
      numberOfAdults,
      numberOfChildren
    );

    advancedFilters = new AdvancedFilters(
      driver,
      waitTimeout,
      amenities,
      numberOfBedrooms
    );
    await advancedFilters.waitForSectionToLoad();
    await advancedFilters.submitAdvancedFilters();
    await resultsPage.checkNumberOfBeds();
    await advancedFilters.clearAdvancedFilters();
  });

  it('test case 03', async () => {
    resultsPage = new ResultsPage(
      driver,
      waitTimeout,
      location,
      startDate,
      endDate,
      numberOfAdults,
      numberOfChildren
    );
    await resultsPage.waitForPageToLoad();
    await resultsPage.checkMapSection();
  });

  after(async () => await driver.quit());
});
