import NamedType from './NamedType'

/**
 * Any type in our system.
 *
 * Every type object has (in it’s type definition) an associated type, named
 * `TValue`. The difference between a `Type` and `TValue` (often expressed
 * together as `Type<TValue>`) is important to understand. A `Type` we can
 * statically introspect, getting the name, description, and more information.
 * `TValue` represents the compiler type of the `Type` object’s value.
 * So both `Type` and `TValue` represent the same thing, the difference is in
 * the usage. `TValue` is statically defined in code used by the compiler
 * whereas `Type` is defined at runtime.
 *
 * Note that although all types are classes, you could easily use the
 * Typescript `implements` feature to manually implement the interface. Even
 * though these are classes all branching logic is done with functions that
 * don’t require exact inheritance.
 */
abstract class Type<TValue> {
  /**
   * Every type must implement an `isTypeOf` function which will completely
   * validate that a value conforms to this type’s specifications. Often this
   * method will not be implemented efficiently so it may not be suitable for
   * hot code paths.
   */
  public abstract isTypeOf (value: mixed): value is TValue

  /**
   * Every type should have a named type at it’s “heart” as unnamed types are
   * inherently abstract. As inventories will only let us register named types, we
   * need to get the named type.
   */
  public abstract getNamedType (): NamedType<mixed>
}

export default Type
