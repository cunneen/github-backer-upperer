/**
 * util to get current date and time as a string, without the "-T" or ":"
 * characters that the ISO format uses and without the milliseconds
 * e.g. "2021-03-01T12:34:56.789Z" becomes "20210301123456"
 * @returns {string} - the current date and time in YYYYMMDDHHMMSS format
 */
export const getDateTimeString = () =>
  new Date().toISOString().slice(0, -5).replace(/[-T:]/g, "");
