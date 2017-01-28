// TODO: test
// TODO: Better module name?

import parsePgInterval = require('postgres-interval')
import { ObjectType } from '../../../../interface'
import { sql } from '../../../utils'
import pgFloatType from '../scalar/pgFloatType'
import pgIntegerType from '../scalar/pgIntegerType'
import PgType from '../PgType'
import PgNullableType from '../PgNullableType'

interface PgInterval {
  seconds?: number
  minutes?: number
  hours?: number
  days?: number
  months?: number
  years?: number
}

const intervalUnits = ['seconds', 'minutes', 'hours', 'days', 'months', 'years']

/**
 * The interval type represents a Postgres time interval which will have one of
 * a few different fields.
 */
const pgIntervalType: ObjectType<PgInterval> & PgType<PgInterval> = {
  kind: 'OBJECT',
  name: 'interval',
  description: 'An interval of time that has passed where the smallest distinct unit is a second.',

  fields: new Map([
    // All values in an interval are integers, except the value for seconds
    // which can store a fractional. Basically fractions will ”overflow” from
    // the integers all the way down to `seconds`.
    ['seconds', {
      description: 'A quantity of seconds. This is the only non-integer field, as all the other fields will dump their overflow into a smaller unit of time. Intervals don’t have a smaller unit than seconds.',
      type: new PgNullableType(pgFloatType),
      getValue: (interval: PgInterval) => interval.seconds,
    }],
    ['minutes', {
      description: 'A quantity of minutes.',
      type: new PgNullableType(pgIntegerType),
      getValue: (interval: PgInterval) => interval.minutes,
    }],
    ['hours', {
      description: 'A quantity of hours.',
      type: new PgNullableType(pgIntegerType),
      getValue: (interval: PgInterval) => interval.hours,
    }],
    ['days', {
      description: 'A quantity of days.',
      type: new PgNullableType(pgIntegerType),
      getValue: (interval: PgInterval) => interval.days,
    }],
    ['months', {
      description: 'A quantity of months',
      type: new PgNullableType(pgIntegerType),
      getValue: (interval: PgInterval) => interval.months,
    }],
    ['years', {
      description: 'A quantity of years',
      type: new PgNullableType(pgIntegerType),
      getValue: (interval: PgInterval) => interval.years,
    }],
  ]),

  isTypeOf: (_value: mixed): _value is PgInterval => {
    throw new Error('Unimplemented')
  },

  fromFields: fields => {
    const interval = {}
    intervalUnits.forEach(unit => { interval[unit] = fields.get(unit) })
    return interval
  },

  // The `pg` module will parse this into an object with the correct keys, we
  // just need to put it into a map to be good.
  transformPgValueIntoValue: (rawInterval: string): PgInterval =>
    parsePgInterval(rawInterval),

  // Take our map and turn it into a string representation of a Postgres
  // interval. Does this by adding each key (which we know is a valid interval
  // identifier) to a string with it’s associated value.
  transformValueIntoPgValue: (interval: PgInterval): sql.Sql =>
    sql.query`${sql.value(
      intervalUnits
        .map(unit => ({ unit, value: interval[unit] }))
        .filter(({ value }) => typeof value === 'number')
        .map(({ unit, value }) => `${value} ${unit}`)
        .join(' '),
    )}`,
}

export default pgIntervalType
