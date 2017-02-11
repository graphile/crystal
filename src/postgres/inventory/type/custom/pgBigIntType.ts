import pgStringType from '../scalar/pgStringType'
import PgAliasType from '../PgAliasType'

const pgBigIntType = new PgAliasType({
  name: 'big_int',
  description:
    'A signed eight-byte integer. The upper big integer values are greater then ' +
    'the max value for a JavaScript number. Therefore all big integers will be ' +
    'output as strings and not numbers.',
  baseType: pgStringType,
})

export default pgBigIntType
