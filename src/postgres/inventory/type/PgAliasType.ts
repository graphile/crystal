import { AliasType } from '../../../interface'
import { sql } from '../../utils'
import PgType from './PgType'

class PgAliasType<TValue> extends PgType<TValue> implements AliasType<TValue> {
  public readonly kind: 'ALIAS' = 'ALIAS'
  public readonly name: string
  public readonly description: string | undefined
  public readonly baseType: PgType<TValue>

  constructor ({ name, description, baseType }: { name: string, description: string | undefined, baseType: PgType<TValue> }) {
    super()
    this.name = name
    this.description = description
    this.baseType = baseType
  }

  public isTypeOf (value: mixed): value is TValue {
    return this.baseType.isTypeOf(value)
  }

  public transformPgValueIntoValue (pgValue: mixed): TValue {
    return this.baseType.transformPgValueIntoValue(pgValue)
  }

  public transformValueIntoPgValue (value: TValue): sql.Sql {
    return this.baseType.transformValueIntoPgValue(value)
  }
}

export default PgAliasType
