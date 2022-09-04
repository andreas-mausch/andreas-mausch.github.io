const { DateTime } = require("luxon")

module.exports = {
  date: dateObject => DateTime.fromJSDate(dateObject).setLocale("en").toLocaleString(DateTime.DATE_MED),
  isoDate: dateObject => DateTime.fromJSDate(dateObject).toISODate(),
  isoDateTime: dateObject => DateTime.fromJSDate(dateObject).toISO()
}
