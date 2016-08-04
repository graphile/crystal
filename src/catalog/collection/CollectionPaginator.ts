import Condition from './Condition'

/**
 * A collection paginator is an object that implements cursor based pagination
 * to paginate through the values that can be read from a collection. This is
 * in it’s own object to keep the `Collection` object small while also
 * potentially allowing for multiple paginators in the future.
 *
 * A cursor is a unique string that represents the position of a pagination
 * implementation in the *entire* collection result set.
 *
 * The reason we use cursor based pagination instead of the traditional (and
 * frankly easier) offset/limit pagination is that offset/limit pagination has
 * some flaws. Mainly that if someone inserts a value into the beginning of
 * your collection, your offset is now off by one and the user may up skipping
 * or repeating values. Neither of these scenarios are ideal, especially when
 * the data being skipped or repeated is business critical. Therefore cursor
 * based pagination, while harder to implement, is the best option for
 * pagination and should always be used.
 *
 * Also, one of the main practical use cases of this abstract interface is
 * GraphQL which as a community has embraced connections as *the standard* way
 * to do pagination.
 *
 * An implementor may choose to use offsets as cursors, however the dangers
 * stated above will still apply. If using offsets as cursors the danger is
 * that *all* of the cursors in the *entire* collection can change on seemingly
 * trivial writes which is non-ideal.
 */
abstract class CollectionPaginator<TValue> {
  constructor (
    private _name: string
  ) {}

  /**
   * Returns the name of the paginator. This name can be used to help
   * distinguish cursors when mixed with different paginators.
   */
  public getName (): string {
    return this._name
  }

  /**
   * Reads values in a collection relative to a cursor which is used as a
   * “bookmark” for a specific value in the paginator’s ordered collection.
   *
   * @see CollectionPaginator.PageConfig
   */
  public abstract readPage (
    context: any,
    config: CollectionPaginator.PageConfig
  ): Promise<CollectionPaginator.Page<TValue>>
}

// We use a namespace so we only have to export one thing from this module
// while at the same time being able to reference types that will be needed
// with `CollectionPaginator.Page`, for example.
namespace CollectionPaginator {
  /**
   * Configuration used to request a page from our paginator.
   *
   * How does forwards and backwards pagination differ, you may ask. So say we
   * have a set of `[1, 2, 3, 4, 5, 6, 7]` and our cursor has our starting
   * position be the value `4`. Say we also have a limit of 2 and we decide to
   * read forward. Well then our resulting set (page) would be `[5, 6]`. Say,
   * however, we chose to read backwards using the same cursor and limit. Then
   * our set (page) would be `[2, 3]`. Note that the set would not be `[3, 2]`.
   */
  export type PageConfig = {
    backwards?: boolean,
    cursor?: any,
    limit?: number,
    condition?: Condition,
  }

  /**
   * A collection page object is the result of a paginator reading a page using
   * a `CollectionPageConfig`. It contains information that can be used by
   * pagination implementations to display values in the page and to continue
   * paginating the collection.
   */
  export type Page<TValue> = {
    values: TValue[],
    cursors: any[],
    hasNextPage: boolean,
    hasPrevPage: boolean,
  }
}

export default CollectionPaginator
