---
layout: page
path: /postgraphile/make-add-pg-table-condition-plugin/
title: makeAddPgTableConditionPlugin (graphile-utils v4.4.5+)
---

**WARNING**: _this plugin generator doesn't currently have any tests, so it's
status is **experimental**. If you can spare the time to write some tests (or
sponsor me to do so) then we can promote it to stable._

PostGraphile adds `condition` arguments to various of the table collection
fields it builds so that you can filter the result set down to just the records
you're interested in. By default we add the table's columns (or, if
`--no-ignore-indexes` is enabled, only the columns _that are indexed_) to the
condition input, where you can specify their value, or `null` if you only want
the records where that column `IS NULL`.

Many GraphQL experts would opine that GraphQL filters should not be overly
complicated, and should not reveal too much of the underlying data store. This
is why we don't have advanced filtering built in by default; however, should you
desire that, please check out the filter plugin
[documented on our Filtering page](./filtering).

Here's an example of filtering forums to those created by a particular user:

```graphql
query ForumsCreatedByUser1 {
  allForums(condition: { creator_id: 1 }) {
    nodes {
      id
      name
    }
  }
}
```

Sometimes, however, you want to filter by something a little more complex than
the fields on that table; maybe you want to filter by a field on a related
table, or by a computation, or something else.

This plugin generator helps you build new `condition` values so that you can
filter more flexibly. Let's make this clearer with an example:

## Example 1

To return a list of forums which match a list of primary keys:

```js
/* TODO: test this plugin works! */
module.exports = makeAddPgTableConditionPlugin(
  "app_public",
  "forums",
  "idIn",
  (build) => {
    const { GraphQLList, GraphQLNonNull, GraphQLInt } = build.graphql;
    return {
      description: "Filters to records matching one of these ids",
      // This is graphql-js for `[Int!]`; assumes you're using
      // an integer primary key.
      type: new GraphQLList(new GraphQLNonNull(GraphQLInt)),
    };
  },
  (value, helpers, build) => {
    const { sql, sqlTableAlias } = helpers;

    // Note sqlTableAlias represents our table (app_public.forums),
    // but because it might be requested more than once in the
    // generated query we need to match this specific instance, so
    // we use an alias.

    // This SQL fragment will be merged into the `WHERE` clause, so
    // it must be valid in that context.
    return sql.fragment`${sqlTableAlias}.id = ANY (${sql.value(value)}::int[])`;
  },
);
```

## Example 2

To filter a list of forums (stored in the table `app_public.forums`) to just
those where a particular user has posted in (posts are stored in
`app_public.posts`) you might create a plugin like this:

````js
/* TODO: test this plugin works! */
module.exports = makeAddPgTableConditionPlugin(
  "app_public",
  "forums",
  "containsPostsByUserId",
  (build) => ({
    description:
      "Filters the list of forums to only those which " +
      "contain posts written by the specified user.",
    type: build.graphql.GraphQLInt,
  }),
  (value, helpers, build) => {
    const { sql, sqlTableAlias } = helpers;
    const sqlIdentifier = sql.identifier(Symbol("postsByUser"));

    // This is merged into the `WHERE` clause, so we end up with
    // something like:
    //
    // ```sql
    // SELECT ...
    // FROM app_public.forums AS <sqlTableAlias>
    // WHERE ...
    // AND (
    //   -- This is our returned fragment:
    //   exists (select 1 from ...)
    // )
    // ```
    return sql.fragment`exists(
      select 1
      from app_public.posts as ${sqlIdentifier}
      where ${sqlIdentifier}.forum_id = ${sqlTableAlias}.id
      and ${sqlIdentifier}.user_id = ${sql.value(value)}
    )`;
  },
);
````

The above plugin adds the `containsPostsByUserId` condition to collection fields
for the `app_public.forums` table. You might use it like this:

```graphql
query ForumsContainingPostsByUser1 {
  allForums(condition: { containsPostsByUserId: 1 }) {
    nodes {
      id
      name
    }
  }
}
```

NOTE: `sqlTableAlias` represents the `app_public.forums` table in the example
above (i.e. the schemaName.tableName table); if you don't use it in your
implementation then there's a good chance your plugin is incorrect.

NOTE: for more complex values, you may need to invoke
`build.gql2pg(value, databaseType)` instead of `sql.value(value)` in order to
convert the GraphQL value to the equivalent SQL value. If you should need this,
reach out on [our Discord chat](https://discord.gg/graphile) for advice.

## Example with ordering

It's also possible for condition plugins to change the order of results by using
[QueryBuilder](./make-extend-schema-plugin/#querybuilder)'s `orderBy` method.
The following example both limits the list of quizzes returned to only those
with a certain number of entries, _and_ orders the results such that the quizzes
with the most entries are listed first.

This example if quite contrived, but this functionality can be useful for a
number of purposes: filtering and ordering by full text search results,
filtering and ordering by proximity, etc.

Note: prior to `graphile-utils` v4.9.1 (unreleased at time of writing), a plugin
like this should be loaded via `--prepend-plugins` (or `prependPlugins` in the
library mode) because otherwise the default ordering plugin dominates the order.

```js
const { makeAddPgTableConditionPlugin } = require("graphile-utils");

module.exports = makeAddPgTableConditionPlugin(
  "app_public",
  "quiz",
  "entryCountMin",
  (build) => ({
    type: build.graphql.GraphQLInt,
  }),
  (value, { queryBuilder, sql, sqlTableAlias }) => {
    if (value == null) {
      return;
    }

    // Order the result set by the number of entries the quiz has
    queryBuilder.orderBy(
      sql.fragment`(select count(*) from app_public.quiz_entry where quiz_entry.quiz_id = ${sqlTableAlias}.id)`,
      false,
      false,
    );

    // Filter to only quizzes that have at least `value` entries.
    return sql.fragment`(select count(*) from app_public.quiz_entry where quiz_entry.quiz_id = ${sqlTableAlias}.id) >= ${sql.value(
      value,
    )}`;
  },
);
```

## Function signature

### `makeAddPgTableConditionPlugin`

The signature of the `makeAddPgTableConditionPlugin` function is:

```ts
export default function makeAddPgTableConditionPlugin(
  schemaName: string,
  tableName: string,
  conditionFieldName: string,
  conditionFieldSpecGenerator: (build: Build) => GraphQLInputFieldConfig,
  conditionGenerator: (
    value: unknown,
    helpers: {
      queryBuilder: QueryBuilder;
      sql: typeof pgsql2 /* the 'pg-sql2' module */;
      sqlTableAlias: SQL;
    },
    build: Build,
  ) => SQL | null | void,
): Plugin;
```

The table to match is the table named `tableName` in the schema named
`schemaName`.

A new condition is added, named `conditionFieldName`, whose GraphQL
representation is specified by the result of `conditionFieldSpecGenerator`.

When the field named in `conditionFieldName` is used in a query, the
`conditionGenerator` is called with the value passed, and the result of that
function is used as an additional `WHERE` clause on the generated SQL (combined
using `AND`). If `null` or `undefined` are returned then no condition is added.
