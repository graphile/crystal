import Type from '../type/Type'
import Collection from './Collection'

/**
 * A collection key will uniquely identify any value in a collection. They key
 * may then be used to reliably reselect the value. A collection may have many
 * keys, but only one primary key.
 */
interface CollectionKey<TValue, TKey> {
  /**
   * The name of our collection key.
   */
  readonly name: string

  /**
   * An optional description for our collection key.
   */
  readonly description: string | undefined

  /**
   * The type for our key. With knowledge of the key’s type we can then
   * expose a way for the API to construct a key.
   */
  readonly type: Type<TKey>

  /**
   * Gets the key directly from a value. Using this method we are able to get a
   * unique key identifier for our value. A key that we can use again to
   * operate on the value.
   *
   * However, not all values must have a key therefore the return type is
   * nullable.
   */
  getKeyFromValue (value: TValue): TKey | undefined

  /**
   * Reads a single value from the collection using that value’s key.
   */
  // TODO: Test this.
  read?: ((context: mixed, key: TKey) => Promise<TValue | undefined>) | null

  /**
   * Updates a value in the collection by using that value’s key. Returned is
   * value after the updates have been applied.
   */
  // TODO: Patch object.
  // TODO: Test this.
  update?: ((context: mixed, key: TKey) => Promise<TValue>) | null

  /**
   * Delete a value from the collection by using the value’s key. Returned is
   * the value before it was deleted.
   */
  // TODO: Test this.
  delete?: ((context: mixed, key: TKey) => Promise<TValue>) | null
}

export default CollectionKey
