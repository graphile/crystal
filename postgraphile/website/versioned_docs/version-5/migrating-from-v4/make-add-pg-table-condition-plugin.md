---
title: makeAddPgTableConditionPlugin
---

# makeAddPgTableConditionPlugin

The (simplified) signature for `makeAddPgTableConditionPlugin` in V4 was:

```ts
// V4 signature
function makeAddPgTableConditionPlugin(
  schemaName: string,
  tableName: string,
  conditionFieldName: string,
  fieldSpecGenerator: (build: Build) => GraphQLInputFieldConfig,
  conditionGenerator: (
    value: unknown,
    helpers: { queryBuilder: QueryBuilder; sql: PgSQL; sqlTableAlias: SQL },
    build: Build,
  ) => SQL,
): Plugin;
```

In V5, the signature has changed a little.

The first change is trivial: we've combined the first two arguments into a
"match" object which also optionally accepts the `serviceName`.

The second change, however, is much more significant - condition generation now
operates based on the Gra*fast* plan system (which operates based on "steps"
which represent all possible values) rather than V4's lookahead engine (which
deals in concrete runtime values).

The (simplified) new signature is:

```ts
// V5 signature
function makeAddPgTableConditionPlugin(
  match: { serviceName?: string; schemaName: string; tableName: string },
  conditionFieldName: string,
  fieldSpecGenerator: (build: GraphileBuild.Build) => GraphileInputFieldConfig,

  // OPTIONAL:
  conditionGenerator?: (
    value: FieldArgs,
    helpers: {
      $condition: PgConditionStep<PgSelectStep>;
      sql: typeof sql;
      sqlTableAlias: SQL;
      build: GraphileBuild.Build;
    },
  ) => SQL | null | undefined,
): GraphileConfig.Plugin;
```

Note that the `conditionGenerator` is now optional because you can choose to
instead include an `applyPlan` entry in the result of `fieldSpecGenerator` -
these input field and argument plans are now inherent to the schema rather than
floating in some unknowable space as they did in V4.

Here's an example:

## Example 1

V4:

```js
import { makeAddPgTableConditionPlugin } from "graphile-utils";

const PetsCountPlugin = makeAddPgTableConditionPlugin(
  "graphile_utils",
  "users",
  "petCountAtLeast",
  (build) => ({
    description: "Filters users to those that have at least this many pets",
    type: build.graphql.GraphQLInt,
  }),
  (value, helpers, build) => {
    const { sqlTableAlias, sql } = helpers;
    return sql.fragment`(select count(*) from graphile_utils.pets where pets.user_id = ${sqlTableAlias}.id) >= ${sql.value(
      value,
    )}`;
  },
);
```

Whereas in V5 the condition callback is called on every single GraphQL request,
in V5 it is only called each time a new operation is planned - operations that
reuse the plan do not call the condition callback again. `value.get()` gives us
a step (`$val`) that represents all potential values for that input; we then
feed this into the SQL statement via a placeholder (since it is not a concrete
value) that will be substituted with the concrete runtime value each time a
request executes. We also need to declare the type of the data so that it can
be cast correctly for the database.

```ts
import { makeAddPgTableConditionPlugin } from "postgraphile/utils";
import { TYPES } from "postgraphile/@dataplan/pg";

const PetsCountPlugin = makeAddPgTableConditionPlugin(
  { schemaName: "graphile_utils", tableName: "users" },
  "petCountAtLeast",
  (build) => ({
    description: "Filters users to those that have at least this many pets",
    type: build.graphql.GraphQLInt,
  }),
  (value, helpers) => {
    const { sqlTableAlias, sql, $condition } = helpers;
    const $val = value.get();
    return sql.fragment`(select count(*) from graphile_utils.pets where pets.user_id = ${sqlTableAlias}.id) >= ${$condition.placeholder(
      $val,
      TYPES.int,
    )}`;
  },
);
```
