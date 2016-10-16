// TODO: test
// TODO: Better module name?

import parsePgInterval = require('postgres-interval')
import { NullableType, ObjectType, integerType, floatType } from '../../../../interface'
import { sql } from '../../../utils'
import { $$transformPgValueIntoValue } from '../../transformPgValueIntoValue'
import { $$transformValueIntoPgValue } from '../../transformValueIntoPgValue'

/**
 * The interval type represents a Postgres time interval which will have one of
 * a few different fields.
 */
const pgIntervalType = Object.assign(new ObjectType({
  name: 'interval',
  description: 'An interval of time that has passed where the smallest distinct unit is a second.',
  fields: new Map([
    // All values in an interval are integers, except the value for seconds
    // which can store a fractional. Basically fractions will ”overflow” from
    // the integers all the way down to `seconds`.
    ['seconds', {
      description: 'A quantity of seconds. This is the only non-integer field, as all the other fields will dump their overflow into a smaller unit of time. Intervals don’t have a smaller unit than seconds.',
      type: new NullableType(floatType),
    }],
    ['minutes', {
      description: 'A quantity of minutes.',
      type: new NullableType(integerType),
    }],
    ['hours', {
      description: 'A quantity of hours.',
      type: new NullableType(integerType),
    }],
    ['days', {
      description: 'A quantity of days.',
      type: new NullableType(integerType),
    }],
    ['months', {
      description: 'A quantity of months',
      type: new NullableType(integerType),
    }],
    ['years', {
      description: 'A quantity of years',
      type: new NullableType(integerType),
    }],
  ]),
}), {
  // The `pg` module will parse this into an object with the correct keys, we
  // just need to put it into a map to be good.
  [$$transformPgValueIntoValue]: (rawInterval: string): ObjectType.Value => {
    const interval = parsePgInterval(rawInterval)
    return new Map<string, number | undefined>([
      ['seconds', interval.seconds],
      ['minutes', interval.minutes],
      ['hours', interval.hours],
      ['days', interval.days],
      ['months', interval.months],
      ['years', interval.years],
    ])
  },

  // Take our map and turn it into a string representation of a Postgres
  // interval. Does this by adding each key (which we know is a valid interval
  // identifier) to a string with it’s associated value.
  [$$transformValueIntoPgValue]: (value: ObjectType.Value): sql.Sql =>
    sql.query`${sql.value(Array.from(value).reduce((interval, [key, num]) => `${interval} ${num} ${key}`, ''))}`,
})

export default pgIntervalType
