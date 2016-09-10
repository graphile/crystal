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

  constructor (
    private _name: string,
    private _type: ObjectType<TValue>,
  ) {}

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
   * Get all of the unique identifiers for this collection. A key is a token
   * that can be used to select and reselect any singular value in a collection
   * by.
   *
   * @see Collection#getPrimaryKey
   */
  // TODO: Test that we don’t have any keys with the same name.
  public getKeys (): Array<CollectionKey<TValue, any>> {
    return []
  }

  /**
   * Gets the primary unique identifier for this collection. While a
   * collection may have many keys, only one is the *primary* identifier.
   * However, a collection may not have a primary key.
   *
   * @see Collection#getKeys
   */
  public getPrimaryKey (): CollectionKey<TValue, any> | undefined {
    return undefined
  }

  /**
   * Returns a paginators that can be used to paginate through all of
   * the values in the collection. Each paginator provides a different “view”
   * or “sort” on the values. The values returned by each paginator should not
   * be different, only the order in which the values are returned.
   *
   * Cursors may not be shared across different paginators and paginator names
   * must be unique.
   *
   * A paginator has a `Type` instance associated with it, similar to our
   * `Collection`. The `Collection`’s `Paginator` instance should really have
   * the same `Type` as the `Collection`. This isn’t a hard requirement and
   * things might work fine if they’re different, but it may not work forever.
   */
  public getPaginator (): Paginator<TValue, any> | undefined {
    return undefined
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
  public abstract create (context: mixed, value: TValue): Promise<TValue>
}

export default Collection
