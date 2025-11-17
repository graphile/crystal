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
`connection(step)` will call `step.applyPagination(...)` (steps without
`paginationSupport` are unaffected). If you reuse the same step elsewhere, the
pagination limits may leak across.

Create fresh steps for connections, rely instead on deduplication for
efficiency.

:::

## `step.paginationSupport`

If your underlying step can handle pagination directly, it should expose its
capabilities via a `paginationSupport` object. When present and `full` is not
set, `step.applyPagination($params)` will be called, passing through the
relevant params based on the connection field arguments and indicated pagination
support.

If `paginationSupport` is present, support for `limit` is assumed. Support for
other features is indicated via the flags:

- `offset?: boolean`
  The step supports numeric offsets — i.e. skipping a fixed number of records
  before returning results. If combined with `cursor`, the offset is applied
  _after_ the cursor.

- `cursor?: boolean`
  The step supports cursor-based pagination (`after`).
  If you support `cursor` but not `reverse`, then reverse queries (`last`,
  `before`) will result in an error, so do not expose those arguments in your
  GraphQL schema.
  If you cannot handle `cursor + offset` together, set `cursor: true` and
  `offset: false` (since cursor is more impactful than offset).

- `reverse?: boolean`
  Indicates support for reverse pagination (requires `cursor`).
  In reverse mode, the step must apply `limit`, `offset`, and `after` starting
  from the end of the collection and working backwards.
  A typical strategy is: invert the sort order in your data source, apply the
  arguments as usual, then restore the original order.
  **Do not** return the final list reversed.

- `full?: boolean`
  **Advanced.** The step implements the full `ConnectionHandlingStep` contract.
  In this case, the step itself receives the raw GraphQL pagination parameters
  (`first`, `last`, `before`, `after`, `offset`, etc) via setters such as
  `.setFirst(...)` and must yield an object of the form:

  ```ts
  {
    items: ReadonlyArray<TItem> | AsyncIterable<TItem>,
    hasNextPage: boolean,
    hasPreviousPage: boolean
  }
  ```

## `step.applyPagination($params)`

When `step.paginationSupport` is present (but does not contain `full: true`),
`connection()` will call `step.applyPagination($params)` with a step that yields
a `PaginationParams` object containing:

- `limit: number | null` — maximum rows to fetch, where `null` means no limit
- `reverse: boolean` — whether to paginate backwards (always `false` if
  unsupported)
- `offset: number | null` — rows to skip (applied after `after` if `cursor` is
  set); `null` (and `0`) means no offset
- `after: string | null` — exclusive lower bound cursor (or upper bound in
  reverse mode); `null` if no cursor was provided, or if you didn’t indicate
  support for `cursor`
- `stream: ExecutionDetailsStream | null` — streaming hints (e.g.
  `stream?.initialCount`)

There are other properties in this object starting with `__` — these **must** be
ignored, and may change over time. They're used internally by `connection()`.

Your step must honour the subset of fields corresponding to the features you
declared in `paginationSupport`.

## `step.cursorForItem($item)`

If the step indicates `cursor: true` in `paginationSupport`, the step must
implement a `cursorForItem($item: Step<TItem>): Step<string>` method. This is
called for each item in the collection to produce its stable, opaque cursor
string.

Cursors must be consistent across forward and reverse pagination; the same item
must always map to the same cursor value.

If you don’t indicate support for `cursor`, `connection()` will automatically
fall back to numeric cursors (based on the item’s index).

## Performance

Without `paginationSupport`, `connection()` handles everything in memory. That
means fetching the entire dataset, which is usually inefficient.

Adding `paginationSupport` pushes supported concerns (`limit`, `offset`,
`cursor`, `reverse`) down into your data source for efficiency.

## Other notes

- If `reverse` is not supported, don’t expose `before`/`last` args in your schema,
  or we may be forced to fetch the whole collection.
- If `cursor` is supported, the step **must** also implement
  `cursorForItem($item: Step<TItem>): Step<string>` to provide stable cursors.
- Optional hooks `nodeForItem`, `edgeForItem`, and `listItem` give finer control
  over how nodes and edges are represented.
- `connectionClone()` can produce an unpaginated copy of the step, e.g. for
  `totalCount` or aggregates.
