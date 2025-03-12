---
layout: page
path: /postgraphile/make-add-pg-table-order-by-plugin/
title: makeAddPgTableOrderByPlugin
---

PostGraphile adds `orderBy` arguments to various of the table collection fields
it builds so that you can control the order in which you receive the results. By
default we add the table's columns (or, if `--no-ignore-indexes` is enabled,
only the columns _that are indexed_) in both ascending and descending order. For
example, you could request the list of all forums ordered from newest to oldest:

```graphql
query ForumsNewestToOldest {
  allForums(orderBy: [CREATED_AT_DESC]) {
    nodes {
      id
      name
    }
  }
}
```

Sometimes, however, you want to order by something a little more complex than
the fields on that table; maybe you want to order by a field on a related table,
or by a computation, or something else.

This plugin generator helps you build new `orderBy` enum values so that you can
sort more flexibly (though you should keep in mind that they are enum values so
they cannot accept arguments). Let's make this clearer with an example:

## Example

To sort a list of forums (stored in the table `app_public.forums`) by the date
of their latest post (posts are stored in `app_public.posts`) you might create a
plugin like this:

```ts
import {
  makeAddPgTableOrderByPlugin,
  orderByAscDesc,
} from "postgraphile/utils";
import { TYPES } from "postgraphile/@dataplan/pg";

/* TODO: test this plugin works! */
export default makeAddPgTableOrderByPlugin(
  { schemaName: "app_public", tableName: "forums" },
  ({ sql }) => {
    const sqlIdentifier = sql.identifier(Symbol("lastPostInForum"));
    return orderByAscDesc(
      "LAST_POST_CREATED_AT",
      ($select) => {
        const orderByFrag = sql`(
          select ${sqlIdentifier}.created_at
          from app_public.posts as ${sqlIdentifier}
          where ${sqlIdentifier}.forum_id = ${$select.alias}.id
          order by ${sqlIdentifier}.created_at desc
          limit 1
        )`;
        return { fragment: orderByFrag, codec: TYPES.timestamptz };
      },
      { nulls: "last-iff-ascending" },
    );
  },
);
```

:::tip

We used the `orderByAscDesc` helper to easily create the `_ASC` and
`_DESC` variants without needing redundant code.

:::

The above plugin adds the `LAST_POST_CREATED_AT_ASC` and
`LAST_POST_CREATED_AT_DESC` enum values to the `ForumOrderBy` enum, so you can
now order forums by these values from another table, e.g.:

```graphql
query ForumsOrderedByMostRecentPost {
  allForums(orderBy: [LAST_POST_CREATED_AT_DESC]) {
    nodes {
      id
      name
    }
  }
}
```

## Function signature

### `makeAddPgTableOrderByPlugin`

The signature of the `makeAddPgTableOrderByPlugin` function is:

```ts
function makeAddPgTableOrderByPlugin(
  match: {
    serviceName?: string;
    schemaName: string;
    tableName: string;
  },
  ordersGenerator: (
    build: GraphileBuild.Build,
  ) => MakeAddPgTableOrderByPluginOrders,
  hint?: string,
): GraphileConfig.Plugin;

interface MakeAddPgTableOrderByPluginOrders {
  [orderByEnumValue: string]: {
    extensions: {
      grafast: {
        applyPlan($select: PgSelectStep): void;
      };
    };
  };
}
```

`MakeAddPgTableOrderByPluginOrders` is a hash (POJO ─ plain old JavaScript
object) which maps from the name of the enum value to [a
`GraphQLEnumValueConfig`
spec](https://graphql.org/graphql-js/type/#graphqlenumtype). Importantly, these
enum values have an associated `extensions.grafast.applyPlan` method which will
be used to apply the ordering to the parent PgSelectStep via
`$select.orderBy(...)`. The `applyPlan` can also choose to set the order as
unique via `$select.setOrderIsUnique()`, which will mean that the primary key
will not need to be added to the order by clause.

:::tip

Note that you wouldn't typically build the `MakeAddPgTableOrderByPluginOrders`
yourself, instead you would use the `orderByAscDesc` helper.

:::

### `orderByAscDesc`

The `orderByAscDesc` helper makes it easier to build the `_ASC` and `_DESC`
orders which are typically identical except for name and reversed sort:

```ts
export function orderByAscDesc(
  baseName: string,
  orderBySpec: OrderBySpecIdentity,
  uniqueOrOptions: boolean | OrderByAscDescOptions = false,
): MakeAddPgTableOrderByPluginOrders;

type OrderBySpecIdentity =
  | string // Column name
  | Omit<PgOrderSpec, "direction"> // Expression
  | (($select: PgSelectStep) => Omit<PgOrderSpec, "direction">); // Callback, allows for joins/etc
```

The `baseName` will have `_ASC` and `_DESC` appended for the two enum values
this function creates.

`orderBySpec` is where the order is specified, it either specifies a column
name (string), an order spec without the "direction", or a callback which
returns the order spec without the "direction".

`uniqueOrOptions` define 1) whether the sort order is unique, and 2) how to sort
null values when sorting by ascending and descending order. Only set
`uniqueOrOptions` (or `uniqueOrOptions.unique`) to `true` if you can guarantee
that the sort order is unique.

You can also customize how nulls are sorted:

```ts
export type NullsSortMethod =
  | "first"
  | "last"
  | "first-iff-ascending"
  | "last-iff-ascending"
  | undefined;

export interface OrderByAscDescOptions {
  unique?: boolean;
  nulls?: NullsSortMethod;
  nullable?: boolean;
}
```

The `nulls` option extends the `ORDER BY` clause of the SQL query with either
`NULLS FIRST` or `NULLS LAST` according to the following rules:

- "first": specify `NULLS FIRST` for both ascending and descending;
- "last": specify `NULLS LAST` for both ascending and descending;
- "first-iff-ascending": specify `NULLS FIRST` when ordering by ascending, and
  `NULLS LAST` when ordering by descending;
- "last-iff-ascending": specify `NULLS LAST` when ordering by ascending, and
  `NULLS FIRST` when ordering by descending;
- (default) undefined: omit both `NULLS FIRST` and `NULLS LAST` in the order by
  clause for both ascending and descending, thus using the default ordering
  behavior.

For example, you may wish to create a plugin to sort movies by either top-rated
or lowest-rated first (meaning the average of the movie's reviews):

```ts
const customOrderBy = orderByAscDesc(
  "RATING",
  ($select) => {
    const sqlIdentifier = sql.identifier(Symbol("movie_reviews"));
    return sql`(
      select avg(${sqlIdentifier}.rating)
      from app_public.movie_reviews as ${sqlIdentifier}
      where ${sqlIdentifier}.movie_id = ${$select.alias}.id
    )`;
  },
  { nulls: "last" },
);
```

To get the top-rated movies, one would then use the `RATING_DESC` option in the
GraphQL query. However, by default, `RATING_DESC` would put movies with no
reviews (and thus an average of `null`) first, followed by the sorted movies. A
movie with no ratings is not exactly what one thinks of when one hears
"top-rated"! By specifying `{ nulls: 'last' }`, however, PostGraphile knows that
this orderBy plugin should still show the movies without any reviews, but just
put them at the end of the list.

:::warning

If your column or expression is nullable, you must either specify `nullable:
true` or pass a value for `nulls`; if you don't do this then PostGraphile will
use a simpler expression for comparisons which is not null-capable, and this
will break cursor pagination when nulls occur.

:::
