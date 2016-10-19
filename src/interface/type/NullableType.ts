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
 *
 * Why did we choose to default to non-nullable when the two original
 * technologies (PostgreSql and GraphQL) have every type as nullable by
 * default?
 *
 * 1. Non-nullable makes sense. It’s hard to remember that the domain of every
 *    type includes `null`. However, if we specify that a type’s domain *must*
 *    include `null` through this nullable type, our programs are easier to
 *    think about.
 * 2. It’s easier to statically type. With Typescript we can easily *add* types
 *    with a union, but we can’t take away a type. It would also be a pain to
 *    add `| null` to every `TValue`. Note that we are looking at this problem
 *    from the perspective of `strictNullTypes` on. Without `strictNullTypes`
 *    this choice doesn’t matter.
 * 3. Matches functional programming patterns. As mentioned before, this is a
 *    ubiquitous pattern in functional programming languages.
 *
 * Also note that a nullable type may wrap another nullable type unlike in
 * GraphQL where a non-null type may not wrap another non-null type.
 */
interface NullableType<
  TNullValue,
  TNonNullValue,
> extends Type<TNullValue | TNonNullValue> {
  // The unique type kind.
  readonly kind: 'NULLABLE'

  /**
   * The type for the non-null value.
   */
  readonly nonNullType: Type<TNonNullValue>

  /**
   * The single null value for this type.
   */
  readonly nullValue: TNullValue

  /**
   * Determines if the value passed in is the null variant.
   */
  isNull (value: TNullValue | TNonNullValue): value is TNullValue

  /**
   * Determines if the value passed in is the non-null variant.
   */
  isNonNull (value: TNullValue | TNonNullValue): value is TNonNullValue
}

export default NullableType
