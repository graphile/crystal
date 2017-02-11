import { EnumType } from '../../../interface'
import { sql } from '../../utils'
import PgType from './PgType'

class PgEnumType extends PgType<string> implements EnumType<string> {
  public readonly kind: 'ENUM' = 'ENUM'
  public readonly name: string
  public readonly description: string | undefined
  public readonly variants: Map<string, string>

  constructor ({ name, description, variants }: { name: string, description: string | undefined, variants: Set<string> }) {
    super()
    this.name = name
    this.description = description
    this.variants = new Map(variants.entries())
  }

  public isTypeOf (value: mixed): value is string {
    if (typeof value !== 'string')
      return false

    return this.variants.has(value)
  }

  public transformPgValueIntoValue (pgValue: mixed): string {
    if (!this.isTypeOf(pgValue))
      throw new Error(`Invalid enum value '${typeof pgValue}'.`)

    return pgValue
  }

  public transformValueIntoPgValue (value: string): sql.Sql {
    return sql.query`${sql.value(value)}`
  }
}

export default PgEnumType
