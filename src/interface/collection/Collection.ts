import ObjectType from '../type/ObjectType'
import Paginator from '../Paginator'
import CollectionKey from './CollectionKey'
import Condition from './Condition'

/**
 * A collection represents a set of typed values that can be operated on in
 * basic CRUD fashion in our system.
 */
interface Collection<TValue> {
  /**
   * The name of our collection.
   */
  readonly name: string

  /**
   * The optional description of our collection.
   */
  readonly description?: string | undefined

  /**
   * The type of *all* the values in our collection.
   */
  readonly type: ObjectType<TValue>

  /**
   * Get all of the unique identifiers for this collection. A key is a token
   * that can be used to select and reselect any singular value in a collection
   * by.
   */
  // TODO: Test that we don’t have any keys with the same name.
  readonly keys: Array<CollectionKey<mixed>>

  /**
   * Gets the primary unique identifier for this collection. While a
   * collection may have many keys, only one is the *primary* identifier.
   * However, a collection may not have a primary key.
   */
  readonly primaryKey?: CollectionKey<mixed> | null

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
  readonly paginator?: Paginator<Condition, ObjectType.Value> | null

  /**
   * Creates a value in our collection. Returns the newly created value.
   * Helpful if the value passed in was missing any default values.
   *
   * If this collection can not create values, this method may be undefined.
   */
  // TODO: Test that we can use this method on an empty collection and then
  // use all the other methods to interact with our created objects.
  // TODO: Is there a better way to type `context`?
  create?: ((context: mixed, value: ObjectType.Value) => Promise<ObjectType.Value>) | null
}

export default Collection
