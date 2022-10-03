---
title: "makeExtendSchemaPlugin"
---

# New makeExtendSchemaPlugin

The move from PostGraphile V4 to V5 sees the transition from the hacky and
chaotic lookahead system to our new clean and performant Gra*fast* planning and
execution engine. This means that many of the workarounds of the past are no
longer needed, including:

- Directives: `@requires`, `@pgField`, `@pgQuery`
- Helper functions: `selectGraphQLResultFromTable`, `embed`
- Savepoints
- `context.pgClient.query`
- QueryBuilder "named children"
- QueryBuilder itself
- `build.getTypeAndIdentifiersFromNodeId`

TODO: find an alternative to the `@scope` directive.

The other major change, and the reason for the above changes, is that instead of
using resolvers, Version 5 uses plans. _Technically_ you can continue to use
resolvers when dealing with external systems, but you will need to use plans to
replace the above directive behavior so you might as well adopt plans, right?
:wink:

## `@requires`

In V4 we had `@requires(columns: [...])` which would ensure the parent object
passed into your resolver had the given columns (though they might have
different capitalisation :grimacing:).

In a V5 plan you can simply `.get(...)` each of the columns from the parent
plan.

Here's an example from the V4 documentation converted to V5. It uses a
[lambda step](https://grafast.org/grafast/step-library/standard-steps/lambda) to
convert the `price_in_us_cents` to AUD via the `convertUsdToAud` function.

```diff title="V4 -> V5 conversion"
 const { makeExtendSchemaPlugin, gql } = require("graphile-utils");
 const { convertUsdToAud } = require("ficticious-npm-library");
+const { lambda } = require('grafast');

 const MyForeignExchangePlugin = makeExtendSchemaPlugin((build) => {
   return {
     typeDefs: gql`
       extend type Product {
-        priceInAuCents: Int! @requires(columns: ["price_in_us_cents"])
+        priceInAuCents: Int!
       }
     `,
-    resolvers: {
+    plans: {
       Product: {
-        priceInAuCents: async (product) => {
-          // Note that the columns are converted to fields, so the case changes
-          // from `price_in_us_cents` to `priceInUsCents`
-          const { priceInUsCents } = product;
-          return await convertUsdToAud(priceInUsCents);
-        },
+        priceInAuCents($product) {
+          const $cents = $product.get('price_in_us_cents');
+          return lambda($cents, cents => convertUsdToAud(cents));
+        },
       },
     },
   };
 });
```

:::tip

We've used `lambda` because the `convertUsdToAud` function converts one value at
a time; however if we had a function capable of bulk converting many currency
values at the same time it would be more efficient to call that function (once)
via [`loadOne`](https://grafast.org/grafast/step-library/standard-steps/loadOne)
rather than once-per-value as with `lambda`.

:::

## `@pgField`

This directive was always a workaround and is no longer meaningful in V5 - just
make sure you add the right plans to the right fields and everything should work
how you desire, and in a much more efficient and straightforward way than many
patterns (particularly around mutation payloads) in V4.

## `@pgQuery`

In V4, `@pgQuery` existed to inline SQL into your GraphQL operation, often as a
performance optimization to work around computed column functions or similar
that were not being inlined by PostgreSQL.

In V5, this concern should be handled via a plan. You have a number of choices
what plan you need, depending on what you're trying to achieve.

For leaf fields, if you need to do the calculation in the database rather than
in JS, you might use the `pgClassExpression` step.

```diff
 module.exports = makeExtendSchemaPlugin(build => {
   const { pgSql: sql } = build;
   return {
     typeDefs: gql`
       extend type User {
-        nameWithSuffix(suffix: String!): String! @pgQuery(
-          fragment: ${embed(
-            (queryBuilder, args) =>
-              sql.fragment`(${queryBuilder.getTableAlias()}.name || ' ' || ${sql.value(
-                args.suffix
-              )}::text)`
-          )}
-        )
+        nameWithSuffix(suffix: String!): String!
       }
     `,
+    plans: {
+      User: {
+        nameWithSuffix($user, fieldArgs) {
+          const $name = $user.get('name');
+          const $suffix = fieldArgs.get('suffix');
+          return pgClassExpression(
+            $user,
+            TYPES.text,
+          )`${$name} || ' ' || ${$suffix}::text`;
+        }
+      }
+    }
   };
 });
```

:::note

The above is _not_ an example of an SQL injection attack, the
`pgClassExpression` helper creates a tagged template literal function which
ensures that all parameters are correctly escaped in the generated SQL query.

:::

:::tip

A more performant (and simpler) solution to this would have been:

```diff
+    plans: {
+      User: {
+        nameWithSuffix($user, fieldArgs) {
+          return lambda(
+            [$user.get("name"), fieldArgs.get("suffix")],
+            ([name, suffix]) => `${name} ${suffix}`,
+          );
+        },
+      },
+    },
```

:::

TODO: once `@dataplan/pg` documentation is written, add links to it here.

## `selectGraphQLResultFromTable`

In version 4, this method was needed to kick off a "look-ahead" enhanced data
fetch from a GraphQL resolver, but was always at risk of introducing the N+1
problem.

In Version 5 there is no need for this helper any more - every plan step is
opted into the planning system without any ceremony, and the N+1 problem is
automatically solved by Gra*fast*.

Here's an example of porting an example from the Version 4 documentation to
Version 5. First we find the `pgSource` that represents the `match_user`
function then we add a plan for the `Query.matchingUser` field that executes the
function, passing through the `searchText` argument.

```diff
 module.exports = makeExtendSchemaPlugin((build) => {
+  const matchUser = build.input.pgSources.find((s) => s.name === "match_user");
   return {
     typeDefs: /* GraphQL */ `
       type Query {
         matchingUser(searchText: String!): User
       }
     `,
-    resolvers: {
-      Query: {
-        matchingUser: async (parent, args, context, resolveInfo) => {
-          const [row] = await resolveInfo.graphile.selectGraphQLResultFromTable(
-            sql.fragment`(select * from match_user(${sql.value(
-              args.searchText,
-            )}))`,
-            () => {}, // no-op
-          );
-          return row;
-        },
-      },
-    },
+    plans: {
+      Query: {
+        matchingUser($parent, fieldArgs) {
+          return matchUser.execute({
+            step: fieldArgs.get("searchText"),
+          });
+        },
+      },
+    },
   };
 });
```

## `embed`

There is currently no replacement for `embed`; hopefully you don't need it any
more.

## Savepoints

In PostGraphile V4 every GraphQL request was wrapped in a transaction. In order
to be compliant with the GraphQL specification every mutation needed to be
wrapped in a `SAVEPOINT` to ensure that if a single mutation failed, all the
other mutations would not be rolled back (so called "partial success").

In PostGraphile V5, transactions are created on demand, so the use of savepoints
is no longer necessary. That's quite good if you're
[concerned about SAVEPOINT impact on performance](https://about.gitlab.com/blog/2021/09/29/why-we-spent-the-last-month-eliminating-postgresql-subtransactions/).

## `context.pgClient.query`

In V4 we provision a Postgres client at the beginning of every GraphQL request
and place it in a transaction, even if it isn't needed. This client was added to
the GraphQL context as `pgClient`, and you could use it in your mutations.

In V5, Postgres clients are provisioned on demand, so you can either use a built
in mutation step, or for more complex mutations you can use `withPgClient` to
run arbitrary (asynchronous) code with access to a pgClient which you may put
into a transaction if you like. Note that this pgClient is a generic adaptor, so
if you want to deal with your Postgres client of choice here you can do so!

```js
const { withPgClientTransaction } = require("grafast");
const plans = {
  Mutation: {
    myCustomMutation(_$root, fieldArgs) {
      const $transactionResult = withPgClientTransaction(
        // Get the 'executor' that tells us which database we're talking to.
        // You can get this from any source via `pgSource.executor`.
        executor,

        // Use this step to pass any existing data into your callback, e.g.
        // args, other steps, etc. The result will be passed as the second
        // argument to your callback
        object({
          a: fieldArgs.get(["input", "a"]),
        }),

        // Callback will be called with a client that's in a transaction,
        // whatever it returns (plain data) will be the result of the
        // `withPgClientTransaction` step; if it throws an error then the
        // transaction will roll back and the error will be the result of the
        // step.
        async (client, data) => {
          // The data from the `object` step above
          const { a } = data;

          // Run some SQL
          const { rows } = await client.query(
            sql.compile(
              sql`select * from generate_series(1, ${sql.value(a ?? 1)}) as i`,
            ),
          );

          // Do some asynchronous work (e.g. talk to Stripe or whatever)
          await sleep(2);

          // Maybe run some more SQL as part of the transaction
          await client.query(sql.compile(sql`select 1`));

          // Return whatever data you'll need later
          return rows2.map((row) => row.i);
        },
      );
      return $transactionResult;
    },
  },
};
```

## QueryBuilder "named children"

This concept is no longer useful or needed, and can be ported to much more
direct Gra*fast* steps.

## QueryBuilder itself

QueryBuilder no longer exists, instead you'll mostly be using the helpers on
`pgSelect` and similar steps.

## `build.getTypeAndIdentifiersFromNodeId`

This helper has been replaced with `specFromNodeId`. Each GraphQL type that
implements Node registers a "node ID handler"; if you know the `typeName` you're
expecting you can get this via `build.getNodeIdHandler(typeName)`. From this,
you can determine the "codec" that was used to encode the NodeID, and passing
these two things to `specFromNodeId` along with the node ID itself should return
a specification of your node, typically something like `{id: 27}` (but can vary
significantly depending on the node type).

Here's an example:

```js
const typeName = "User";
const handler = build.getNodeIdHandler(typeName);
const codec = build.getNodeIdCodec(handler.codecName);

const plans = {
  Mutation: {
    updateUser(parent, fieldArgs) {
      const $nodeId = fieldArgs.get("id");
      const spec = specFromNodeId(codec, handler, $nodeId);
      const plan = object({ result: pgUpdate(userSource, spec) });
      fieldArgs.apply(plan);
      return plan;
    },
  },
};
```
