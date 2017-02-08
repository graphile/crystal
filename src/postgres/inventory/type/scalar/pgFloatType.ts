import { AdapterType, floatType } from '../../../../interface'
import { sql } from '../../../utils'
import PgType from '../PgType'

// In the absence of /\p{Sc}/ to match all currency symbols, we get the
// following regexp from http://stackoverflow.com/a/27175364/141284
const CURRENY_SYMBOL_REGEXP =
  /^[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/

const pgFloatType: PgType<number> & AdapterType<number> = {
  kind: 'ADAPTER',
  baseType: floatType,
  isTypeOf: floatType.isTypeOf,
  transformPgValueIntoValue: value => {
    // If the number is a string, we want to parse it.
    if (typeof value === 'string') {
      // If this number represents money, it has some extra trimmings that
      // need to be fixed.
      if (CURRENY_SYMBOL_REGEXP.test(value))
        return parseFloat(value.slice(1).replace(',', ''))

      return parseFloat(value)
    }

    if (!floatType.isTypeOf(value))
      throw new Error(`Expected float. Not '${typeof value}'.`)

    return value
  },
  transformValueIntoPgValue: value =>
    sql.query`(${sql.value(value)} + 0.0)`,
}

export default pgFloatType
