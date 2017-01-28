import { AdapterType, integerType } from '../../../../interface'
import { sql } from '../../../utils'
import PgType from '../PgType'

const pgIntegerType: PgType<number> & AdapterType<number> = {
  kind: 'ADAPTER',
  baseType: integerType,
  isTypeOf: integerType.isTypeOf,
  transformPgValueIntoValue: value => {
    // If the number is a string, we want to parse it.
    if (typeof value === 'string') {
      // If this number represents money, it has some extra trimmings that
      // need to be fixed.
      if (value.startsWith('$'))
        return parseInt(value.slice(1).replace(',', ''), 10)

      return parseInt(value, 10)
    }

    if (!integerType.isTypeOf(value))
      throw new Error(`Expected integer. Not '${typeof value}'.`)

    return value
  },
  transformValueIntoPgValue: value =>
    sql.query`(${sql.value(value)} + 0)`,
}

export default pgIntegerType
