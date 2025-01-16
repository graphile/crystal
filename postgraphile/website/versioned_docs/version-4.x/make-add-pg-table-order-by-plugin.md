---
title: makeAddPgTableOrderByPlugin
---

# makeAddPgTableOrderByPlugin (graphile-utils v4.4.5+)

:::warning warning
This plugin generator doesn't currently have any tests, so it's
status is **experimental**. If you can spare the time to write some tests (or
[sponsor me to do so](https://graphile.org/sponsor)) then we can promote it to stable.
:::

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

```js
/* TODO: test this plugin works! */
module.exports = makeAddPgTableOrderByPlugin(
  "app_public",
  "forums",
  ({ pgSql: sql }) => {
    const sqlIdentifier = sql.identifier(Symbol("lastPostInForum"));
    return orderByAscDesc(
      "LAST_POST_CREATED_AT",
      ({ queryBuilder }) => sql.fragment`(
        select ${sqlIdentifier}.created_at
        from app_public.posts as ${sqlIdentifier}
        where ${sqlIdentifier}.forum_id = ${queryBuilder.getTableAlias()}.id
        order by ${sqlIdentifier}.created_at desc
        limit 1
      )`,
    );
  },
);
```

:::note
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
  schemaName: string,
  tableName: string,
  ordersGenerator: (build: Build) => MakeAddPgTableOrderByPluginOrders,
  hint = `Adding orders with makeAddPgTableOrderByPlugin to "${schemaName}"."${tableName}"`,
): Plugin;

interface MakeAddPgTableOrderByPluginOrders {
  [orderByEnumValue: string]: {
    value: {
      alias?: string;
      specs: Array<OrderSpec>;
      unique: boolean;
    };
  };
}

type OrderSpec = [string | SQL, boolean] | [string | SQL, boolean, boolean];
```

The `OrderSpec` here is a 2- or 3-tuple, with the following entries:

1. the first entry (`string | SQL`) is the value to order by; if a string then
   it's assumed to be a column from the table, otherwise it must be an SQL
   fragment from `pg-sql2`.
2. whether the order should be ascending (`true`) or descending (`false`).
3. whether nulls appear before or after non-null values in the sort ordering.
   Pass true for nulls first, false for nulls last, and nothing/null for default
   behaviour.

The unique key specifies whether the order is unique (true) or not (false) ─ if
in doubt, pass false and PostGraphile will make it unique by adding the primary
key as the last sort field invisibly.

`MakeAddPgTableOrderByPluginOrders` is a hash (POJO ─ plain old JavaScript
object) which maps from the name of the enum value to
[a `GraphQLEnumValueConfig` spec](https://graphql.org/graphql-js/type/#graphqlenumtype).
We have a defined format for the value of an orderBy enum as shown above. In
addition to the `value` entry detailed above, you could also provide a
`description` or `deprecationReason` (both strings).

### `orderByAscDesc`

We also expose the `orderByAscDesc` helper which makes it easier to build the
`_ASC` and `_DESC` orders which are typically identical except for name and
reversed sort:

```ts
export function orderByAscDesc(
  baseName: string,
  columnOrSqlFragment: string | SQL,
  uniqueOrOptions: boolean | OrderByAscDescOptions = false,
): MakeAddPgTableOrderByPluginOrders;
```

The `baseName` will have `_ASC` and `_DESC` appended for the two enum values
this function creates.

`columnOrSqlFragment` is where the order value is specified, it becomes the
first entry in the `OrderSpec` tuple defined above.

`uniqueOrOptions` define 1) whether the sort order is unique, and 2) how to sort
null values when sorting by ascending and descending order. Only set
`uniqueOrOptions` (or `unique`) to `true` if you can guarantee that the sort
order is unique.

As of v4.12, you can also customize how nulls are sorted:

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
  (helpers) => {
    const { queryBuilder } = helpers;

    const orderByFrag = sql.fragment`(
      select avg(${sqlIdentifier}.rating)
      from app_public.movie_reviews as ${sqlIdentifier}
      where ${sqlIdentifier}.movie_id = ${queryBuilder.getTableAlias()}.id
    )`;

    return orderByFrag;
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
