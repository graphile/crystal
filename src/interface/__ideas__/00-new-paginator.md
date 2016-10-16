```ts
/**
 * This is for a world when paginators are simple instances and are not used
 * statically. Currently paginators have a `name`, `itemType`, and `ordering`
 * properties which means they need to be statically defined. It may be useful
 * to just spin up new paginators whenever we get new input vs statically
 * threading it through.
 */

interface Collection<TItem> {
  orderings: Array<string>
  defaultOrdering: string

  getPaginator <TPosition>(ordering: string, condition: Condition): Paginator<TItem, TPosition>
}

// TODO: Async iterable.
interface Paginator<TElement, TPosition> {
  getElementPosition (element: TElement): TPosition
  hasNext (position: TPosition): Promise<boolean>
  hasPrevious (position: TPosition): Promise<boolean>
  readAll (range?: PaginatorRange<TPosition>): Promise<Array<{ element: TElement, position: TPosition }>>
  readFirst (n: number, range?: PaginatorRange<TPosition>): Promise<Array<{ element: TElement, position: TPosition }>>
  readLast (n: number, range?: PaginatorRange<TPosition>): Promise<Array<{ element: TElement, position: TPosition }>>
}

/**
 * A range of values in a set. A range consists of two endpoints, a start
 * endpoint and an ending endpoint. These endpoints are used to denote the
 * bounds of the range. The endpoints may also be included or excluded from the
 * range.
 */
interface PaginatorRange<TPosition> {
  start?: { position: TPosition, included?: boolean }
  end?: { position: TPosition, included?: boolean }
}

// Original Set:   0,1,2,3,4,5,6,7,8,9
// Range:              ( *---*   )
// Final Set:            3,4,5
```
