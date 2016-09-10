import NamedType from './NamedType'

/**
 * Any type in our system.
 *
 * Every type object has (in it’s type definition) an associated type, named
 * `TValue`. The difference between a `Type` and `TValue` (often expressed
 * together as `Type<TValue>`) is important to understand. A `Type` we can
 * statically introspect, getting the name, description, and more information.
 * `TValue` represents the compiler type of the `Type` object’s internal value.
 * So both `Type` and `TValue` represent the same thing, the difference is in
 * the usage. `TValue` is statically defined in code used by the compiler
 * whereas `Type` is defined at runtime.
 */
abstract class Type<TValue> {
  /**
   * Determines if the provided value is valid for this type. For example, a
   * string type with a `TValue` of `string` may implement this method as
   * `typeof value === 'string'`.
   */
  public abstract isTypeOf (value: mixed): value is TValue

  /**
   * Every type should have a named type at it’s “heart” as unnamed types are
   * inherently abstract. As inventories will only let us register named types, we
   * need to get the named type.
   */
  public abstract getNamedType (): NamedType<any>
}

export default Type
