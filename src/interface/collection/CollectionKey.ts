import Type from '../type/Type'
import ObjectType from '../type/ObjectType'
import Collection from './Collection'

/**
 * A collection key will uniquely identify any value in a collection. They key
 * may then be used to reliably reselect the value. A collection may have many
 * keys, but only one primary key.
 */
interface CollectionKey<TKeyValue> {
  /**
   * The collection this key is for.
   *
   * An instance of `CollectionKey` will almost always need to have an instance
   * of the collection it is for. This is so that it can correctly implement
   * methods like `getKeyFromValue`, `update`, and so on which need information
   * about the collection object type itself.
   *
   * Establishing this circular dependency is also helpful in that `Relation`
   * instances can use this.
   *
   * Everyone wins, so we add it to the interface.
   */
  readonly collection: Collection

  /**
   * The name of our collection key.
   */
  readonly name: string

  /**
   * An optional description for our collection key.
   */
  readonly description?: string | undefined

  /**
   * The type for our key. With knowledge of the key’s type we can then
   * expose a way for the API to construct a key.
   */
  readonly keyType: Type<TKeyValue>

  /**
   * Gets the key directly from a value. Using this method we are able to get a
   * unique key identifier for our value. A key that we can use again to
   * operate on the value.
   *
   * However, not all values must have a key therefore the return type is
   * nullable.
   */
  getKeyFromValue (value: ObjectType.Value): TKeyValue | undefined

  /**
   * Reads a single value from the collection using that value’s key.
   *
   * If nothing was found, return `null`.
   */
  // TODO: Test this.
  readonly read?: ((context: mixed, key: TKeyValue) => Promise<ObjectType.Value | null>) | null

  /**
   * Updates a value in the collection by using that value’s key. Returned is
   * value after the updates have been applied.
   *
   * The patch object is a map in which the keys corresponds to field keys on
   * the collection’s `ObjectType`. The values of the patch object represent the
   * new value.
   *
   * If nothing was updated, an error should be thrown.
   */
  // TODO: Test this.
  readonly update?: ((context: mixed, key: TKeyValue, patch: Map<string, mixed>) => Promise<ObjectType.Value>) | null

  /**
   * Delete a value from the collection by using the value’s key. Returned is
   * the value before it was deleted.
   *
   * If nothing was deleted an error should be thrown.
   */
  // TODO: Test this.
  readonly delete?: ((context: mixed, key: TKeyValue) => Promise<ObjectType.Value>) | null
}

export default CollectionKey
