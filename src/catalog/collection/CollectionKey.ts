import Type from '../type/Type'
import Collection from './Collection'

/**
 * A collection key will uniquely identify any value in a collection. They key
 * may then be used to reliably reselect the value. A collection may have many
 * keys, but only one primary key.
 */
abstract class CollectionKey<TValue, TKey> {
  private _description: string | undefined = undefined

  constructor (
    private _collection: Collection<TValue>,
    private _name: string,
    private _type: Type<TKey>
  ) {
    if (_collection && _collection.addKey)
      _collection.addKey(this)
  }

  /**
   * Gets the name of our collection key.
   */
  public getName (): string {
    return this._name
  }

  /**
   * Sets the description for our collection.
   */
  public setDescription (description: string | undefined): this {
    this._description = description
    return this
  }

  /**
   * Gets an optional description for our collection key.
   */
  public getDescription (): string | undefined {
    return this._description
  }

  /**
   * Gets the collection for which this key applies.
   */
  public getCollection (): Collection<TValue> {
    return this._collection
  }

  /**
   * Gets the type for our key. With knowledge of the key’s type we can then
   * expose a way for the API to construct a key.
   */
  public getType (): Type<TKey> {
    return this._type
  }

  /**
   * Gets the key directly from a value. Using this method we are able to get a
   * unique key identifier for our value. A key that we can use again to
   * operate on the value.
   *
   * However, not all values must have a key therefore the return type is
   * nullable.
   */
  public abstract getKeyForValue (value: TValue): TKey | undefined

  /**
   * Reads a single value from the collection using that value’s key.
   */
  // TODO: Test this.
  public abstract read (key: TKey): Promise<TValue | undefined>

  /**
   * Updates a value in the collection by using that value’s key. Returned is
   * value after the updates have been applied.
   */
  // TODO: Patch object.
  // TODO: Test this.
  public abstract update (key: TKey): Promise<TValue>

  /**
   * Delete a value from the collection by using the value’s key. Returned is
   * the value before it was deleted.
   */
  // TODO: Test this.
  public abstract delete (key: TKey): Promise<TValue>
}

export default CollectionKey
