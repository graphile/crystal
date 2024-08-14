---
layout: page
path: /postgraphile/make-add-pg-table-condition-plugin/
title: makeAddPgTableConditionPlugin
---

PostGraphile adds `condition` arguments to various of the table collection
fields it builds so that you can filter the result set down to just the records
you're interested in. By default we add the table's indexed columns to the
condition input, where you can specify their value, or `null` if you only want
the records where that column `IS NULL`.

Many GraphQL experts would opine that GraphQL filters should not be overly
complicated, and should not reveal too much of the underlying data store. This
is why we don't have advanced filtering built in by default; however, should you
desire that, please check out the filter plugin
[documented on our Filtering page](./filtering/).

Here's an example of filtering forums to those created by a particular user:

```graphql
query ForumsCreatedByUser1 {
  allForums(condition: { creatorId: 1 }) {
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

```ts
import { makeAddPgTableConditionPlugin } from "postgraphile/utils";
import { TYPES, listOfCodec } from "postgraphile/@dataplan/pg";

/* TODO: test this plugin works! */
export default makeAddPgTableConditionPlugin(
  { schemaName: "app_public", tableName: "forums" },
  "idIn",
  (build) => {
    const { GraphQLList, GraphQLNonNull, GraphQLInt } = build.graphql;
    return {
      description: "Filters to records matching one of these ids",
      // This is graphql-js for `[Int!]`; assumes you're using
      // an integer primary key.
      type: new GraphQLList(new GraphQLNonNull(GraphQLInt)),
      applyPlan(
        $condition /* : PgConditionStep<PgSelectStep<any>> */,
        value /* : FieldArgs */,
      ) {
        const $ids = value.get();
        $condition.where(
          sql`${$condition.alias}.id = ANY(${$condition.placeholder(
            $ids,
            listOfCodec(TYPES.int),
          )})`,
        );
      },
    };
  },
);
```

## Example 2

To filter a list of forums (stored in the table `app_public.forums`) to just
those where a particular user has posted in (posts are stored in
`app_public.posts`) you might create a plugin like this:

```ts
import { makeAddPgTableConditionPlugin } from "postgraphile/utils";
import { TYPES } from "postgraphile/@dataplan/pg";

export default makeAddPgTableConditionPlugin(
  { schemaName: "app_public", tableName: "forums" },
  "containsPostsByUserId",
  (build) => {
    const { sql } = build;
    return {
      description:
        "Filters the list of forums to only those which " +
        "contain posts written by the specified user.",
      type: build.graphql.GraphQLInt,
      applyPlan(
        $condition /* : PgConditionStep<PgSelectStep<any>> */,
        value /* : FieldArgs */,
      ) {
        const sqlIdentifier = sql.identifier(Symbol("postsByUser"));
        $condition.where(sql`exists(
          select 1
          from app_public.posts as ${sqlIdentifier}
          where ${sqlIdentifier}.forum_id = ${$condition.alias}.id
          and ${sqlIdentifier}.user_id = ${$condition.placeholder(
            value.get(),
            TYPES.int,
          )}
        )`);
      },
    };
  },
);
```

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

:::tip

`$condition.alias` represents the `app_public.forums` table in the example
above (i.e. the schemaName.tableName table); if you don't use it in your
implementation then there's a good chance your plugin is incorrect.

:::

<!-- V5 doesn't allow ordering like this?

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

-->

## Function signature

### `makeAddPgTableConditionPlugin`

The signature of the `makeAddPgTableConditionPlugin` function is:

```ts
function makeAddPgTableConditionPlugin(
  match: { serviceName?: string; schemaName: string; tableName: string },
  conditionFieldName: string,
  fieldSpecGenerator: (build: GraphileBuild.Build) => GraphileInputFieldConfig,
): GraphileConfig.Plugin;
```

The table to match is the table named `tableName` in the schema named
`schemaName`.

A new condition is added, named `conditionFieldName`, whose GraphQL
representation is specified by the result of `fieldSpecGenerator`.

Also inside `fieldSpecGenerator` should be an `applyPlan`, which indicates how
this condition should work. It is passed two arguments, the `$condition` (which
is a `PgConditionStep` wrapping the `PgSelectStep` that we're applying
conditions to) and the `value` (which is a `FieldArgs` instance representing
the value of the field). The `applyPlan` should use `$conditon.where(...)` to
apply a condition to the fetch.

When the field named in `conditionFieldName` is used in a query, the
`applyPlan` is called during planning, which results in an additional `WHERE`
clause on the generated SQL (combined using `AND`).
