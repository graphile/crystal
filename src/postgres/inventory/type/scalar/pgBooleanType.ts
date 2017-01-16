import { AdapterType, booleanType } from '../../../../interface'
import { sql } from '../../../utils'
import PgType from '../PgType'

const pgBooleanType: PgType<boolean> & AdapterType<boolean> = {
  kind: 'ADAPTER',
  baseType: booleanType,
  isTypeOf: booleanType.isTypeOf,
  transformPgValueIntoValue: value => {
    if (!booleanType.isTypeOf(value))
      throw new Error(`Expected boolean. Not '${typeof value}'.`)

    return value
  },
  transformValueIntoPgValue: value =>
    sql.query`${sql.value(value)}`,
}

export default pgBooleanType
