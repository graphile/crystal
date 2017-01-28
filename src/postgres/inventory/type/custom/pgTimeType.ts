import pgStringType from '../scalar/pgStringType'
import PgAliasType from '../PgAliasType'

const pgTimeType = new PgAliasType({
  name: 'time',
  description: 'The exact time of day, does not include the date. May or may not have a timezone offset.',
  baseType: pgStringType,
})

export default pgTimeType
