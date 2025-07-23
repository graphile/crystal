# connection

Wraps a collection fetch to provide the utilities for working with GraphQL
cursor connections. It only requires one argument which is a step that
represents a collection (list) of records. This collection step is expected to
either yield an array, to yield an object with an `items` key that's an array
(`{ items: any[] }`), or to support the `.items()` method.

```ts
interface ConnectionParams {
  fieldArgs?: FieldArgs;
}
export function connection<
  TItem,
  TItemStep extends Step<TItem> = Step<TItem>,
  TNodeStep extends Step = TItemStep,
  TCursorValue = string,
  TCollectionStep extends ConnectionOptimizedStep<
    TItem,
    TItemStep,
    TNodeStep,
    TCursorValue
  > = ConnectionOptimizedStep<TItem, TItemStep, TNodeStep, TCursorValue>,
>(
  step: TCollectionStep,
  params?: ConnectionParams,
): ConnectionStep<TItem, TItemStep, TNodeStep, TCursorValue, TCollectionStep> {
```

## Improving performance

Out of the box, `connection()` tries to handle connection concerns for you, but
doing so is incredibly expensive (we need you to fetch all the data so that we
can handle the pagination in memory).

To fix this, your underlying step may indicate that it supports certain
optimizations for this by implementing `paginationFeatures`. For full
optimization you should honour the following arguments:

- `reverse` - if true, the `limit`, `after` and `offset` apply in reverse - i.e.
  apply them from the end of the list working backwards.
  `before`. Do **NOT** return the data in reverse order!
- `limit` - only fetch this many nodes
- `after` - only fetch nodes after this cursor

You can indicate which features you support:

- `cursor` - you support cursor pagination - the `after` argument. Note: if you
  indicate `cursor` support but not `reverse` support then any attempt at reverse
  pagination will be met with an error.
- `reverse` - you support reverse pagination alongside `cursor`. Requires
  `cursor` support.
- `offset` - you support skipping over a number of rows (relative to `after` if
  `cursor` support is indicated)

At a bare minimum, `limit` support is required if you indicate
`paginationFeatures` at all.

If you have `paginationFeatures` but do not implement `cursor` support, then we
will use limit/offset pagination where the cursor is the index from the start.
and thus will forbid queries such as `last: 3` that have no accompanying
`before` cursor (otherwise a full fetch of the collection would be required to
determine cursors).

TODO: the documentation for this is terrible. Sorry.
