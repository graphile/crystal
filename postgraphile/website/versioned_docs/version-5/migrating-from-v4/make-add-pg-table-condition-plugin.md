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

The second change may be more involved depending on your previous code; the
`conditionGenerator` signature has changed and rather than using the
`queryBuilder` there's a `condition` to write to. You can still use
`sql.value(value)` for embedding values as before, but it's recommended that
instead you use `sqlValueWithCodec(value, codec)` as this will take care of
casting the value via the relevant codec so it's the correct shape when it
reaches the database. This matters more with more complex types.

The (simplified) new signature is:

```ts
// V5 signature
function addPgTableCondition(
  match: { serviceName?: string; schemaName: string; tableName: string },
  conditionFieldName: string,
  fieldSpecGenerator: (build: GraphileBuild.Build) => GrafastInputFieldConfig,

  // OPTIONAL:
  conditionGenerator?: (
    value: unknown,
    helpers: {
      sql: typeof sql;
      sqlTableAlias: SQL;
      sqlValueWithCodec: typeof sqlValueWithCodec;
      build: ReturnType<typeof pruneBuild>;
      condition: PgCondition;
    },
  ) => SQL | null | undefined,
): GraphileConfig.Plugin;
```

Note that the `conditionGenerator` is now optional because you can choose to
instead include an `apply` (or `extensions.grafast.apply`) entry in the result
of `fieldSpecGenerator`.

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

V5:

```ts
import { addPgTableCondition } from "postgraphile/utils";
import { TYPES } from "postgraphile/@dataplan/pg";

const PetsCountPlugin = addPgTableCondition(
  { schemaName: "graphile_utils", tableName: "users" },
  "petCountAtLeast",
  (build) => ({
    description: "Filters users to those that have at least this many pets",
    type: build.graphql.GraphQLInt,
  }),
  (value, helpers) => {
    const { sqlTableAlias, sql, sqlValueWithCodec } = helpers;
    return sql.fragment`(select count(*) from graphile_utils.pets where pets.user_id = ${sqlTableAlias}.id) >= ${sqlValueWithCodec(
      value,
      TYPES.int,
    )}`;
  },
);
```
