import { ListType } from '../../../interface'
import { sql } from '../../utils'
import PgType from './PgType'
import PgNullableType from './PgNullableType'
import PgEnumType from './PgEnumType'
import PgClassType from './PgClassType'

class PgListType<TItemValue> extends PgType<Array<TItemValue>> implements ListType<Array<TItemValue>, TItemValue> {
  public readonly kind: 'LIST' = 'LIST'
  public readonly itemType: PgType<TItemValue>

  constructor (itemType: PgType<TItemValue>) {
    super()
    this.itemType = itemType
  }

  public isTypeOf (value: mixed): value is Array<TItemValue> {
    if (!Array.isArray(value))
      return false

    return value.reduce((same, item) => same && this.itemType.isTypeOf(item), true)
  }

  public intoArray (value: Array<TItemValue>): Array<TItemValue> {
    return value
  }

  public fromArray (value: Array<TItemValue>): Array<TItemValue> {
    return value
  }

  public transformPgValueIntoValue (pgValue: mixed): Array<TItemValue> {
    if (!Array.isArray(pgValue))
      throw new Error(`Expected array value from Postgres. Not '${typeof pgValue}'.`)

    return pgValue.map(item => this.itemType.transformPgValueIntoValue(item))
  }

  public transformValueIntoPgValue (value: Array<TItemValue>): sql.Sql {
    if (value.length === 0)
      return sql.query`'{}'`

    // a list of enums or custom types must be casted explicitly, otherwise it would be treated as text[]
    const nonNullType = this.itemType instanceof PgNullableType ? this.itemType.nonNullType : this.itemType
    const listType = sql.identifier(nonNullType instanceof PgEnumType || nonNullType instanceof PgClassType ? nonNullType.name : 'text')
    return sql.query`array[${sql.join(value.map(item => this.itemType.transformValueIntoPgValue(item)), ', ')}]::${listType}[]`
  }
}

export default PgListType
