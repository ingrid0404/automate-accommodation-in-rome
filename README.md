# automate-accommodation-in-rome

This is an automation project that has the purpose to automate finding accomodations in Rome, Italy.

## Run Locally
You need to install [Node](https://nodejs.org/en/) on your machine. 

```sh
npm install
```

## Running UI Test

```sh
npm run test
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
LOCATION = rome
START_DATE = 7
END_DATE = 14
NUMBER_OF_ADULTS = 2
NUMBER_OF_CHILDREN = 1
AMENITIES = 'Pool'
NUMBER_OF_BEDROOMS = 5
  
```
