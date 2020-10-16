// @flow

// Regexp construction enhanced from `postgres-interval`, which is licensed
// under the MIT license and is copyright (c) Ben Drucker <bvdrucker@gmail.com>
// (bendrucker.me).

const NUMBER = "([+-]?\\d+)";
const YEAR = `${NUMBER}\\s+years?`;
const MONTH = `${NUMBER}\\s+mons?`;
const DAY = `${NUMBER}\\s+days?`;
// NOTE: PostgreSQL automatically overflows seconds into minutes and minutes
// into hours, so we can rely on minutes and seconds always being 2 digits
// (plus decimal for seconds). The overflow stops at hours - hours do not
// overflow into days, so could be arbitrarily long.
const TIME = "([+-])?(\\d+):(\\d\\d):(\\d\\d(?:\\.\\d{1,6})?)";

const INTERVAL = new RegExp(
  "^\\s*" +
    // All parts of an interval are optional
    [YEAR, MONTH, DAY, TIME].map(str => "(?:" + str + ")?").join("\\s*") +
    "\\s*$"
);

export type Interval = {
  years: number,
  months: number,
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
};

// All intervals will have exactly these properties:
const BASE: Interval = Object.freeze({
  years: 0,
  months: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0.0,
});

export function parseInterval(interval: string): Interval {
  const result = { ...BASE };

  if (!interval) {
    return result;
  }

  const matches = INTERVAL.exec(interval);
  if (!matches) {
    throw new Error(`Failed to parse interval '${interval}' from PostgreSQL`);
  }

  const [
    ,
    years,
    months,
    days,
    plusMinusTime,
    hours,
    minutes,
    seconds,
  ] = matches;

  const timeMultiplier = plusMinusTime === "-" ? -1 : 1;

  if (years) result.years = parseInt(years, 10);
  if (months) result.months = parseInt(months, 10);
  if (days) result.days = parseInt(days, 10);
  if (hours) result.hours = timeMultiplier * parseInt(hours, 10);
  if (minutes) result.minutes = timeMultiplier * parseInt(minutes, 10);
  // Seconds can be decimal; all other values are integer
  if (seconds) result.seconds = timeMultiplier * parseFloat(seconds);

  return result;
}
