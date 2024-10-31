# automate-accommodation-in-rome

This is an automation project that has the purpose to facilitate the process of searching for accomodations in a specified location.
Technologies utilized in this project include Selenium for browser automation, Mocha for testing, and npm (Node Package Manager) for managing project dependencies and scripts.

## Run Locally
You need to install [Node](https://nodejs.org/en/) on your machine. 

```sh
npm install
```

## Running UI Test

```sh
npm run test
```

## Running UI Test with reports

Use this command to generate reports.
Reports will be saved in the __'./mochawesome-report'__ folder.
```sh
npm run test-report
```

## Failures

In case a test fails, a screenshot is taken and saved in the __'./screenshots'__ folder.

## Documentation

In order to customize the automations task create and .env file at the root of the project.

#### .env

```ini
WEBSITE = https://www.airbnb.com/
WEBSITE_TITLE = Airbnb | Vacation rentals, cabins, beach houses, & more
BROWSER = chrome
WAIT_TIMEOUT = 10000
LOCATION = Rome, Italy
START_DATE_OFFSET = 7
END_DATE_OFFSET = 14
NUMBER_OF_ADULTS = 2
NUMBER_OF_CHILDREN = 1
AMENITIES = 'Pool'
NUMBER_OF_BEDROOMS = 5
  
```
