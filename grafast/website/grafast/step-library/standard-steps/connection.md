# connection

`connection()` wraps a collection fetch to provide the utilities for working
with GraphQL cursor connections.

The underlying collection step may yield:

- an array,
- an object with an `items` array (`{ items: any[] }`), or
- support the `.items()` method.

```ts
export function connection<...>(
  step: StepRepresentingList<...>,
  params?: ConnectionParams,
): ConnectionStep<...>

interface ConnectionParams {
  fieldArgs?: FieldArgs;
  edgeDataPlan?: ($item: Step<any>) => Step;
}
```

:::warning Wrapping a step in `connection()` may mutate the step!

If your step implements `paginationSupport` and `applyPagination`, then
`connection(step)` will call `step.applyPagination(...)`. If you reuse the same
step elsewhere, the pagination limits may leak across.

Create fresh steps for connections. Steps without `paginationSupport` are
unaffected.

:::

## Pagination support

If your underlying step can handle pagination directly, it should expose its
capabilities via a `paginationSupport` object.

If `paginationSupport` is
present, support for `limit` is assumed. Support for other features is indicated
via the flags:

- `offset?: boolean`
  The step supports numeric offsets - specifically a count of the records to
  skip over before returning results.

- `cursor?: boolean`
  The step supports cursor pagination (`after`). If you support `cursor` but not
  `reverse`, then reverse queries (`last`, `before`) will result in an error, so
  do not expose these via the GraphQL schema. (If combined with `offset`, offset
  applies after the cursor. If you can’t support that combination, we recommend
  that you keep `cursor: true` and set `offset: false`.)

- `reverse?: boolean`
  The step support reverse pagination with cursors. **Requires `cursor`**.
  Reverse means apply `limit`, `offset`, and `after` working backwards from the
  end. One way to achieve this is to reverse the sort order, apply the parameters
  as usual, then restore the original order. Do **not** return the final list in
  reverse order.

- `full?: boolean`
  **ADVANCED**. The step implements the complete `ConnectionHandlingStep`
  interface. Instead of us slicing, you receive the raw GraphQL params directly
  and must yield an object with `{ items, hasNextPage, hasPreviousPage }`.

### Cursor support

If you don’t support `cursor`, then we’ll fall back to numeric cursors (the item
index). In that mode, queries like `last: 3` without a `before` would require
fetching the entire collection to determine cursors - we recommend you forbid
these.

## Performance

If you don’t indicate any `paginationSupport`, `connection()` will do all the
pagination in memory. This requires fetching the full dataset, which is often
expensive.

Adding `paginationSupport` lets you push a selection of supported pagination
concerns to your data source for efficiency.

## Other notes

- If `reverse` is not supported, it’s recommended not to expose `before`/`last`
  args in your schema, since we would otherwise need to fetch the entire
  collection to emulate them.
- If `cursor` is supported, the step **must** also implement
  `cursorForItem($item: Step<TItem>): Step<string>` to return stable cursors.
- `nodeForItem`, `edgeForItem`, and `listItem` give finer control over how nodes
  and edges are represented.
- `connectionClone()` can be used to make an unpaginated copy of the step, e.g.
  for `totalCount` and other aggregates.
