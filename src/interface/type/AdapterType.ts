import Type from './Type'

/**
 * An adapter type is a special kind of type similar to an alias type that
 * allows you to add special logic to another type without mutating that type
 * and without creating a new type like `AliasType`.
 *
 * This is useful in type systems which add their own special logic to types.
 * Such as the Postgres type system which adds logic to serialize and
 * deserialize data to and from the database. An adapter type can wrap a type
 * from another type system and add these specific methods on top.
 *
 * In `switchType` adapters are always ignored and their base types are switched
 * on instead. This is because adapter types are not useful outside of type
 * system definition. Type system consumption (which is `switchType`’s primary
 * focus) does not need to care about adapter types.
 */
interface AdapterType<TValue> extends Type<TValue> {
  // The unique string tag for adapter types.
  readonly kind: 'ADAPTER'

  /**
   * The base type which should always be used in consumption instead of the
   * adapter type.
   */
  readonly baseType: Type<TValue>
}

export default AdapterType
