import Context from './Context'
import Type from './type/Type'

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
// TODO: Paginators should not exist statically. We may only want paginators to
// exist at runtime. This means `orderings` and `defaultOrdering` should be
// stored somewhere else. This would allow us to dynamically create paginators
// based on arbitrary inputs (no `TInput`). The only problem is giving cursors
// meaning accross paginators. Perhaps we create long lived paginators? What
// then does that mean for procedure paginators where one is created on every
// call. Ponder these problems…
interface Paginator<TInput, TItemValue> {
  /**
   * The name of the paginator. This name can be used to help
   * distinguish cursors when mixed with different paginators.
   */
  readonly name: string

  /**
   * The type of the values returned by this paginator.
   */
  readonly itemType: Type<TItemValue>

  /**
   * A unique array of ordering objects which represent the different ways
   * values from the paginator may be ordered.
   *
   * The name of each ordering object is unique.
   */
  readonly orderings: Map<string, Paginator.Ordering<TInput, TItemValue, mixed>>

  /**
   * The default ordering for our paginated values. A default ordering is
   * required.
   */
  readonly defaultOrdering: Paginator.Ordering<TInput, TItemValue, mixed>

  /**
   * Gets the total count of values in our collection. If a condition is
   * supplied then we will get the total count of all values in the collection
   * that meet the specified condition.
   */
  count (context: Context, input: TInput): Promise<number>
}

// We use a namespace so we only have to export one thing from this module
// while at the same time being able to reference types that will be needed
// with `Paginator.Page`, for example.
namespace Paginator {
  /**
   * A `Paginator.Ordering` instance will be the thing which actually queries
   * the set for values. The reason we created a new object is to allow to
   * ensure that cursors are associated with their ordering.
   */
  export interface Ordering<TInput, TItemValue, TCursor> {
    /**
     * Gets the cursor for a single value in the set. There are two ways to get
     * the cursor for a value, the first is to get the cursor returned by
     * `readPage`, the other is to use this method. Calling this function will
     * be generally less performant then just using the cursor returned by
     * `readPage`. Use this method only when you can’t call `readPage`.
     *
     * May return synchronously or asynchronously.
     */
    getCursorForValue? (value: TItemValue): TCursor | Promise<TCursor>

    /**
     * Reads values in a collection relative to a cursor which is used as a
     * “bookmark” for a specific value in the paginator’s ordered collection.
     *
     * All values returned by this method will be in a consistent order.
     *
     * @see Paginator.PageConfig
     */
    readPage (
      context: Context,
      input: TInput,
      config: Paginator.PageConfig<TCursor>,
    ): Promise<Paginator.Page<TItemValue, TCursor>>
  }

  /**
   * Configuration used to request a page from our paginator.
   *
   * How does forwards and backwards pagination differ, you may ask. So say we
   * have a set of `[1, 2, 3, 4, 5, 6, 7]` and our cursor has our starting
   * position be the value `4`. Say we also have a limit of 2 and we decide to
   * read forward. Well then our resulting set (page) would be `[5, 6]`. Say,
   * however, we chose to read backwards using the same cursor and limit. Then
   * our set (page) would be `[2, 3]`. Note that the set would not be `[3, 2]`.
   *
   * Cannot use `first` and `last` at the same time.
   */
  export type PageConfig<TCursor> = {
    first?: number,
    last?: number,
    // TODO: rename to start cursor
    afterCursor?: TCursor,
    // TODO: rename to end cursor
    beforeCursor?: TCursor,
  }

  /**
   * A collection page object is the result of a paginator reading a page using
   * a `PageConfig`. It contains information that can be used by
   * pagination implementations to display values in the page and to continue
   * paginating the collection.
   *
   * The cursors returned can *only* be used again when using the same exact
   * `ordering`. Extenders of `Paginator` should not add ordering information
   * to `TCursor`. Rather consumers should make sure that cursors are not cross
   * contaminated.
   */
  // TODO: Is there a way to forse the cursor must correspond to ordering
  // constraint on a type level? Instead, instances must make these checks.
  export type Page<TValue, TCursor> = {
    values: Array<{ value: TValue, cursor: TCursor }>,
    hasNextPage (): Promise<boolean>,
    hasPreviousPage (): Promise<boolean>,
  }
}

export default Paginator
