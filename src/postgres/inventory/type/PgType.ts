import { Type } from '../../../interface'
import { sql } from '../../utils'

/**
 * A type that represents some type in Postgres.
 */
abstract class PgType<TValue> implements Type<TValue> {
  public abstract readonly kind: string

  /**
   * Tests if a given value is of this type.
   */
  public abstract isTypeOf (value: mixed): value is TValue

  /**
   * Transforms a Postgres value into an internal value for this type.
   */
  public abstract transformPgValueIntoValue (pgValue: mixed): TValue

  /**
   * Transforms our internal value into a Postgres SQL query.
   */
  public abstract transformValueIntoPgValue (value: TValue): sql.Sql
}

export default PgType
