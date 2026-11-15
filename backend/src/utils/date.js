/**
 * utils/date.js
 *
 * WHY THIS FILE EXISTS:
 * "Today" depends on the time zone. Vercel servers run in UTC, so at
 * 2:00 AM in Hyderabad the server still thinks it's yesterday. Without this,
 * a customer booking for "today" early in the morning would be told the date
 * is in the past (or a past date would be accepted late at night).
 * Eko Tejas operates in India, so "today" always means today in IST.
 */

const BUSINESS_TIME_ZONE = "Asia/Kolkata";

// Returns "YYYY-MM-DD" for today in IST (en-CA locale formats dates as YYYY-MM-DD).
function todayInBusinessTimeZone(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

// Adds days to a "YYYY-MM-DD" string and returns a "YYYY-MM-DD" string.
// WHY UTC math: the input is a pure calendar date, so doing the math in UTC
// avoids daylight-saving shifts changing the result.
function addDays(isoDate, days) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

module.exports = { BUSINESS_TIME_ZONE, todayInBusinessTimeZone, addDays };
