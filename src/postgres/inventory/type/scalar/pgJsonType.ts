import { AdapterType, jsonType } from '../../../../interface'
import { sql } from '../../../utils'
import PgType from '../PgType'

const pgJsonType: PgType<mixed> & AdapterType<mixed> = {
  kind: 'ADAPTER',
  baseType: jsonType,
  isTypeOf: jsonType.isTypeOf,
  transformPgValueIntoValue: value => value,
  transformValueIntoPgValue: value => sql.query`${sql.value(JSON.stringify(value))}`,
}

export default pgJsonType
