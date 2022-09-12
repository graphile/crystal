# List Transforms

`listTransform` enables you to transform the results of a plan that returns a
list (array); there's quite a few reasons you might want to do this:

- mapping
- aggregation
- partitioning
- grouping
- filtering
- sorting
- prepend/append
- combinations of the above

For some of these operations you can perform the transform in a streaming way
(for example, 'filter' can simply not pass through records from the stream that
don't match the predicate), but others cannot (for example ordering a list
requires you to have everything in the list before you can apply the order). For
now, we do not support stream processing, but we may add it to select transforms
in future.

Originally the idea for this came from trying to support a PostgreSQL function
`random_user_array_set()` that `returns setof users[]`. In this, we're
effectively returning a doubly nested array (technically a PostgreSQL "set" of
PostgreSQL "arrays", but we see PostgreSQL sets and arrays as the same thing).
We still want to do column selection (and potentially subqueries in our
selection set), so we need to do something like the following:

```
# select array_idx, b.id, b.username
  from random_user_array_set() with ordinality as a (arr, array_idx)
  cross join lateral unnest(arr) as b;
┌───────────┬──────────────────────────────────────┬──────────┐
│ array_idx │                  id                  │ username │
├───────────┼──────────────────────────────────────┼──────────┤
│         1 │ b0b00000-0000-0000-0000-000000000b0b │ Bob      │
│         2 │ a11ce000-0000-0000-0000-0000000a11ce │ Alice    │
│         2 │ cec111a0-0000-0000-0000-00000cec111a │ Cecilia  │
└───────────┴──────────────────────────────────────┴──────────┘
```

This gives us all the information we need to reconstitute the "array of arrays"
that we want - the `array_idx` indicates into which child array the row should
be inserted - however it's only a single list when returned from PostgreSQL.

So now we have the issue that we have three rows, but we want to return this as
`[[Bob], [Alice, Cecilia]]`.

Effectively we need to turn a 1-dimensional array into a 2-dimensional array. We
determined that the desired generic API for this would be:

```js
return partitionByIndex($select, ($row) => $row.select(sql`array_idx`));
```

The problem here comes in implementing `partitionByIndex` - if we were to just
rely on `execute` then we need to return two items from `execute`, but we have
an array with three items and we don't _yet_ know how to group because we only
get the result of the item plan after executing the list items inside of
`executeLayers`. It's kind of a catch-22.

To solve this we introduced the concept of "list transforms". List transforms
are not executed directly, instead they have custom handling inside of Crystal
(much in the same way that `__ItemPlan`s do) which effectively runs the old plan
to get the list items, then feeds that into your callbacks to give you a chance
to manipulate the results.

Because we decided earlier in the design of Crystal that `__ItemPlan` should not
incorporate indexes this works out really well - we can manipulate the list
(filter it, or transform it to multiple layers) and yet none of the children
even know we've done this because they still see their original object.

Even though we only designed this to "partition" a 1-D array into a 2-D array,
because we built it around the concept of "reduce" we can use it for a wide
array of transforms.

---

## History

This section is just historical context. Don't read it, it's here just because
Benjie doesn't like throwing code out :wink:

<details>

<summary>Click here to expand some of the code we scratched out before we got started _actually_ building the feature.</summary>

**THIS CODE IS NOT EXAMPLE CODE, DO NOT USE IT. It's only here for historical
context.**

```ts
type ReduceCallback<TItemPlanData, TResult> = (
  memo: TResult,
  entireItemValue: unknown,
  itemPlanData: TItemPlanData,
) => TResult;

// groupBy
const groupByPlan = groupBy($select, ($row) => $row.select(sql`array_idx`));
const groupByReduceInitialValue = [];
const groupByReduceCallback: ReduceCallback<TItemPlanData, Row[][]> = (
  memo,
  entireItemValue,
  idx,
) => {
  if (!memo[idx]) {
    memo[idx] = [];
  }
  memo[idx].push(entireItemValue);
  return memo;
};

// filter
const filterPlan = filter($select, ($row) =>
  lambda($row.get("archived_at"), (archivedAt) => !archivedAt),
);
const filterInitialValue = [];
const filterReduceCallback: ReduceCallback<TItemPlanData, Row[]> = (
  memo,
  entireItemValue,
  include,
) => {
  if (include) {
    memo.push(entireItemValue);
  }
  return memo;
};

// aggregation
const aggregatePlan = aggregate(
  // List plan
  $select,
  // Item plan
  ($row) => list($row.get("amount"), $row.get("year")),
  // Reduce
  (memo, [amount, year]) => {
    memo.totalCount += 1;
    memo.totalAmount += amount;
    if (!memo.latestYear || year > memo.latestYear) {
      memo.latestYear = year;
    }
    return memo;
  },
  // Finalize
  (memo) => {
    memo.averageAmount = memo.totalAmount / memo.totalCount;
    return memo;
  },
);
const aggregationInitialValue = {
  totalCount: 0,
  totalAmount: 0,
  averageAmount: 0,
  latestYear: null,
};
const aggregationReduceCallback: ReduceCallback<TItemPlanData, Row[]> = (
  memo,
  entireItemValue,
  deps,
) => {
  return aggregatePlan.reduce(memo, deps);
};
```

**THIS CODE IS NOT EXAMPLE CODE, DO NOT USE IT. It's only here for historical
context.**

</details>
