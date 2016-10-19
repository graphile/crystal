/**
 * A type in our type system.
 *
 * Every type will have a `TValue` which represents the internal value of this
 * type.
 *
 * All of the types in our interface represent *data access patterns*. They do
 * not perscript how the data should be stored or fetched, but rather just how
 * to expose that data. So for example, we could have a string type that was
 * really an object. Or an object type that was actually an integer. The type
 * system should not be perscriptive.
 *
 * Data producers can keep data however it is most performant, while data
 * consumers will retrieve that data in a given shape.
 */
interface Type<TValue> {
  /**
   * Every type will have a constant `kind` string. This will tell our system
   * how the type should be interacted with. This is mostly useful in the
   * `switchType` function.
   */
  readonly kind: string

  /**
   * Tests if a given value is of this type.
   */
  isTypeOf (value: mixed): value is TValue
}

export default Type
