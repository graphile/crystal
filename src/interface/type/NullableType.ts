import Type from './Type'

/**
 * A nullable type is a type whose value may be null (realistically any
 * constant value), or the value of a base type.
 *
 * You can think of a nullable like `Option` in Rust or `Maybe` in Haskell.
 *
 * A nullable type has two associated types, `TNullValue` and `TNonNullValue`.
 * Nullable types do not expect the null value to be the JavaScript
 * `null`/`undefined`. That is for data producers to decide.
 *
 * There should only ever be one value for `TNullValue`.
 */
interface NullableType<
  TNullValue,
  TNonNullValue,
> extends Type<TNullValue | TNonNullValue> {
  // The unique type kind.
  readonly kind: 'NULLABLE'

  /**
   *
   */
  readonly nonNullType: Type<TNonNullValue>
  readonly nullValue: TNullValue
  isNull (value: TNullValue | TNonNullValue): value is TNullValue
  isNotNull (value: TNullValue | TNonNullValue): value is TNonNullValue
}

export default NullableType
