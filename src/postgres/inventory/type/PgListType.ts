import { ListType } from '../../../interface'
import { sql } from '../../utils'
import PgType from './PgType'

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
    return sql.query`array[${sql.join(value.map(item => this.itemType.transformValueIntoPgValue(item)), ', ')}]`
  }
}

export default PgListType
