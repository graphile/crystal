import pgStringType from '../scalar/pgStringType'
import PgAliasType from '../PgAliasType'

const pgDateType = new PgAliasType({
  name: 'date',
  description: 'The day, does not include a time.',
  baseType: pgStringType,
})

export default pgDateType
