import { AdapterType, floatType } from '../../../../interface'
import { sql } from '../../../utils'
import PgType from '../PgType'

const pgFloatType: PgType<number> & AdapterType<number> = {
  kind: 'ADAPTER',
  baseType: floatType,
  isTypeOf: floatType.isTypeOf,
  transformPgValueIntoValue: value => {
    // If the number is a string, we want to parse it.
    if (typeof value === 'string') {
      // If this number represents money, it has some extra trimmings that
      // need to be fixed.
      if (value.startsWith('$'))
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
