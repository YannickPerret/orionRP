// server/utils/dateUtils.js
const { DateTime } = require('luxon');

module.exports = {
  getCurrentTimestamp() {
    return DateTime.utc().toISO();
  },
  parseTimestamp(timestamp) {
    return DateTime.fromISO(timestamp);
  },
};
