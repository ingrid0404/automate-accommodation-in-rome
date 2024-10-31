function getStringMonthFromDate(actualDate) {
  switch (actualDate.getMonth()) {
    case 0:
      return "January";
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    case 11:
      return "December";
    default:
      return "";
  }
}

function getDateText(actualDate) {
  return "" + getShortMonthFromDate(actualDate) + " " + actualDate.getDate();
}
function getDateIntervalText(startDate, endDate) {
  let sameMonth = endDate.getMonth() - startDate.getMonth();
  let dateText = "";
  if (sameMonth) {
    dateText =
      getShortMonthFromDate(startDate) +
      " " +
      startDate.getDate() +
      " – " +
      getShortMonthFromDate(endDate) +
      " " +
      endDate.getDate();
  } else {
    dateText =
      getShortMonthFromDate(endDate) +
      " " +
      startDate.getDate() +
      " – " +
      endDate.getDate();
  }
  return dateText;
}

function getShortMonthFromDate(actualDate) {
  switch (actualDate.getMonth()) {
    case 0:
      return "Jan";
    case 1:
      return "Feb";
    case 2:
      return "Mar";
    case 3:
      return "Apr";
    case 4:
      return "May";
    case 5:
      return "Jun";
    case 6:
      return "Jul";
    case 7:
      return "Aug";
    case 8:
      return "Sept";
    case 9:
      return "Oct";
    case 10:
      return "Nov";
    default:
      return "Dec";
  }
}

function getDayNameFromDate(actualDate) {
  switch (actualDate.getDay()) {
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    case 7:
      return "Sunday";
    default:
      return "";
  }
}

function computeDateFormat(actualDate) {
  let dateComputed =
    actualDate.getMonth() +
    1 +
    "/" +
    (actualDate.getDate() < 10
      ? "0" + actualDate.getDate()
      : actualDate.getDate()) +
    "/" +
    actualDate.getFullYear();

  return dateComputed;
}

function getNumberOfMonthBetweenDates(startDate, endDate) {
  return endDate.getMonth() - startDate.getMonth();
}
module.exports = {
  getStringMonthFromDate,
  getDayNameFromDate,
  getShortMonthFromDate,
  getDateIntervalText,
  computeDateFormat,
  getNumberOfMonthBetweenDates,
  getDateText,
};
