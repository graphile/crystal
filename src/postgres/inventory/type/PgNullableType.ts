import { NullableType } from '../../../interface'
import { sql } from '../../utils'
import PgType from './PgType'

class PgNullableType<TNonNullValue> extends PgType<TNonNullValue | null | undefined> implements NullableType<TNonNullValue> {
  // The unique type kind.
  public readonly kind: 'NULLABLE' = 'NULLABLE'

  /**
   * The type for the non-null value.
   */
  public readonly nonNullType: PgType<TNonNullValue>

  constructor (nonNullType: PgType<TNonNullValue>) {
    super()
    this.nonNullType = nonNullType
  }

  /**
   * Determines if the value passed in is the non-null variant.
   */
  public isNonNull (value: TNonNullValue | null | undefined): value is TNonNullValue {
    return value != null
  }

  /**
   * Checks if the value is null, if so returns true. Otherwise we run
   * `nonNullType.isTypeOf` on the value.
   */
  public isTypeOf (value: mixed): value is TNonNullValue | null | undefined {
    return value == null || this.nonNullType.isTypeOf(value)
  }

  /**
   * Transforms a Postgres value into an internal value for this type.
   */
  public transformPgValueIntoValue (pgValue: mixed): TNonNullValue | null | undefined {
    return pgValue == null ? null : this.nonNullType.transformPgValueIntoValue(pgValue)
  }

  /**
   * Transforms our internal value into a Postgres SQL query.
   */
  public transformValueIntoPgValue (value: TNonNullValue | null | undefined): sql.Sql {
    return value == null ? sql.query`null` : this.nonNullType.transformValueIntoPgValue(value)
  }
}

export default PgNullableType
