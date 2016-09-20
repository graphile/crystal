import Type from './Type'
import NamedType from './NamedType'

/**
 * A nullable type is an unnamed wrapper around any other type that signifies
 * the value may be null *or* the wrapped type’s value. Similar to the monad
 * `Maybe` in Haskell, or `Option` in Rust.
 *
 * Why did we choose to default to non-nullable when the two original
 * technologies (PostgreSQL and GraphQL) have every type as nullable by
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
 * Given the problem space of PostgreSQL and GraphQL it makes sense they would
 * default to all types being nullable, however given the problem space of our
 * interface, it makes more sense to be non-nullable by default then wrap types
 * with an instance of this type.
 *
 * Also note that it is possible that a nullable type could wrap another
 * nullable type. This may lead to unexpected behavior.
 */
class NullableType<TValue extends TNonNullValue | null | undefined, TNonNullValue> extends Type<TValue> {
  constructor (public readonly nonNullType: Type<TNonNullValue>) {
    super()
  }

  /**
   * Checks if the value is null, or it is a type of the nullable types non
   * null composite type.
   */
  public isTypeOf (value: mixed): value is TValue {
    return value == null || this.nonNullType.isTypeOf(value)
  }

  /**
   * Returns the named type inside this nullable type’s non-null type.
   */
  public getNamedType (): NamedType<mixed> {
    return this.nonNullType.getNamedType()
  }
}

export default NullableType
