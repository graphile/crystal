import Catalog from '../Catalog'
import Relation from '../Relation'
import ObjectType from '../type/object/ObjectType'
import CollectionKey from './CollectionKey'
import Paginator from './Paginator'
import Condition from './Condition'

/**
 * A collection represents a set of typed values that can be operated on in
 * basic CRUD fashion in our system.
 */
abstract class Collection<TValue> {
  private _description: string | undefined = undefined

  private _keys: Set<CollectionKey<TValue, any>> = new Set()
  private _primaryKey: CollectionKey<TValue, any> | undefined = undefined

  constructor (
    private _catalog: Catalog,
    private _name: string,
    private _type: ObjectType<TValue>,
  ) {
    // This should always exist, but in tests we don’t need it.
    // TODO: I’m not sure I like this pattern.
    if (_catalog && _catalog.addCollection)
      _catalog.addCollection(this)
  }

  /**
   * Returns the catalog this collection belongs to.
   */
  public getCatalog (): Catalog {
    return this._catalog
  }

  /**
   * Gets the name of our collection.
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
   * Gets the optional description of our collection.
   */
  public getDescription (): string | undefined {
    return this._description
  }

  /**
   * Get the type of *all* the values in our collection.
   */
  public getType (): ObjectType<TValue> {
    return this._type
  }

  /**
   * Adds a key to our collection, checking if the key’s collection is correct.
   *
   * @see Collection#getKeys
   * @see Collection#setPrimaryKey
   */
  // TODO: Maybe key’s should be an implementation detail. What collection
  // wants external sources adding keys to the collection? Some collections
  // might, but this is probably not the right default.
  public addKey (key: CollectionKey<TValue, any>): this {
    if (key.getCollection() !== this)
      throw new Error('Cannot add key to a collection it does not represent.')

    this._keys.add(key)

    return this
  }

  /**
   * Get all of the unique identifiers for this collection. A key is a token
   * that can be used to select and reselect any singular value in a collection
   * by.
   *
   * @see Collection#addKey
   * @see Collection#getPrimaryKey
   */
  // TODO: Test that we don’t have any keys with the same name.
  public getKeys (): CollectionKey<TValue, any>[] {
    return Array.from(this._keys)
  }

  /**
   * Sets the primary key for the collection. In order to set the primary key,
   * the key argument *must* have already been added using `Collection#addKey`.
   *
   * @see Collection#getPrimaryKey
   * @see Collection#addKey
   */
  // TODO: Do we really want external things to change a collection’s primary
  // key? I don’t think so. See the note on `Collection#addKey`, similar
  // reservations here too.
  public setPrimaryKey (key: CollectionKey<TValue, any>): this {
    if (!this._keys.has(key))
      throw new Error('Must add key to the collection before making it the primary key.')

    this._primaryKey = key

    return this
  }

  /**
   * Gets the primary unique identifier for this collection. While a
   * collection may have many keys, only one is the *primary* identifier.
   * However, a collection may not have a primary key.
   *
   * @see Collection#setPrimaryKey
   * @see Collection#getKeys
   */
  public getPrimaryKey (): CollectionKey<TValue, any> | undefined {
    return this._primaryKey
  }

  /**
   * Returns a paginators that can be used to paginate through all of
   * the values in the collection. Each paginator provides a different “view”
   * or “sort” on the values. The values returned by each paginator should not
   * be different, only the order in which the values are returned.
   *
   * Cursors may not be shared across different paginators and paginator names
   * must be unique.
   */
  public getPaginator (): Paginator<TValue, any> | undefined {
    return undefined
  }

  /**
   * Get all the relations for which this collection is the tail.
   * That means the relations in which the values of this collection point to
   * the values of other collections.
   *
   * @see Relation
   */
  public getTailRelations (): Relation<TValue, any, any>[] {
    return this._catalog.getRelations().filter(relation => relation.getTailCollection() === this)
  }

  /**
   * Get all the relations for which this collection is the head. That means
   * the relations in which another collections values point to a value in this
   * collection.
   *
   * @see Relation
   */
  public getHeadRelations (): Relation<any, TValue, any>[] {
    return this._catalog.getRelations().filter(relation => relation.getHeadCollectionKey().getCollection() === this)
  }

  /**
   * Statically specifies whether or not you can create a value within this
   * collection. If false, `Collection#create` should not be called.
   *
   * @see Collection#create
   */
  // TODO: Is `canCreate`/`canReadMany` the right abstraction? Maybe a
  // permissions object? Maybe we need to use interfaces? We also need to
  // consider the `CollectionKey` context as well.
  public canCreate (): boolean {
    return true
  }

  /**
   * Creates a value in our collection. Returns the newly created value.
   * Helpful if the value passed in was missing any default values.
   *
   * @see Collection#canCreate
   */
  // TODO: Test that we can use this method on an empty collection and then
  // use all the other methods to interact with our created objects.
  // TODO: Is there a better way to type `context`?
  public abstract create (context: any, value: TValue): Promise<TValue>
}

export default Collection
