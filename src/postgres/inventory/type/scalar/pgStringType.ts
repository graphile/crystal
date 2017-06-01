import { AdapterType, stringType } from '../../../../interface'
import { sql } from '../../../utils'
import PgType from '../PgType'

const pgStringType: PgType<string> & AdapterType<string> = {
  kind: 'ADAPTER',
  baseType: stringType,
  isTypeOf: stringType.isTypeOf,
  transformPgValueIntoValue: value => {
    if (typeof value === 'number')
      return value.toString(10)

    if (!stringType.isTypeOf(value))
      throw new Error(`Expected string. Not '${typeof value}'.`)

    return value
  },
  transformValueIntoPgValue: value =>
    sql.query`${sql.value(value)}`,
}

export default pgStringType
