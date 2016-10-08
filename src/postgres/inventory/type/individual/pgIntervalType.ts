// TODO: test
// TODO: Better module name?

import parsePGInterval = require('postgres-interval')
import { NullableType, ObjectType, integerType, floatType } from '../../../../interface'
import { sql, objectToMap } from '../../../utils'
import { $$transformPGValueIntoValue } from '../../transformPGValueIntoValue'
import { $$transformValueIntoPGValue } from '../../transformValueIntoPGValue'

/**
 * The interval type represents a Postgres time interval which will have one of
 * a few different fields.
 */
const pgIntervalType = Object.assign(new ObjectType({
  name: 'interval',
  description: 'An interval of time that has passed.',
  fields: new Map([
    // All values in an interval are integers, except the value for seconds
    // which can store a fractional. Basically fractions will ”overflow” from
    // the integers all the way down to `seconds`.
    // TODO: descriptions…
    ['seconds', { type: new NullableType(floatType) }],
    ['minutes', { type: new NullableType(integerType) }],
    ['hours', { type: new NullableType(integerType) }],
    ['days', { type: new NullableType(integerType) }],
    ['months', { type: new NullableType(integerType) }],
    ['years', { type: new NullableType(integerType) }],
  ]),
}), {
  // The `pg` module will parse this into an object with the correct keys, we
  // just need to put it into a map to be good.
  [$$transformPGValueIntoValue]: (rawInterval: string): ObjectType.Value => {
    const interval = parsePGInterval(rawInterval)
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
  [$$transformValueIntoPGValue]: (value: ObjectType.Value): sql.SQL =>
    sql.query`${sql.value(Array.from(value).reduce((interval, [key, value]) => `${interval} ${value} ${key}`, ''))}`
})

export default pgIntervalType
