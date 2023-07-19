---
layout: page
path: /postgraphile/usage-schema/
title: Usage - Schema Only
---

# PostGraphile schema-only usage

The PostGraphile library mode gives you a lot of excellent features for running
your own GraphQL server. However, if you want to execute a PostGraphile query in
Node.js without having to go through HTTP you can use some other exported
functions that PostGraphile provides.

**If you're looking for Apollo Client SSR support for PostGraphile without a
network roundtrip, check out
[GraphileApolloLink in Graphile Starter](https://github.com/graphile/starter/blob/516cf0cf35f1d9e0904f74e68d3a2dc51a59225d/%40app/lib/src/GraphileApolloLink.ts).**

## Getting the schema

The first function you will need is `makeSchema` (or `watchSchema` if you want
to get a new schema each time the database is updated) which creates your
PostGraphile GraphQL schema by introspecting your database.

The `makeSchema` function accepts a [configuration preset](./config.md) and
returns a promise to a SchemaResult, which is an object containing:

- `schema` - the GraphQL schema
- `resolvedPreset` - the resolved preset

```js
import { makeSchema } from "postgraphile";
import preset from "./graphile.config.js";

const { schema, resolvedPreset } = await makeSchema(preset);
```

:::tip

If you already have a PostGraphile instance (`pgl`), you can instead get the
GraphQL schema and `resolvedPreset` via:

```js
const { schema, resolvedPreset } = await pgl.getSchemaResult();
```

:::

## Easy execution: `grafast()`

Now that you have `schema` and `resolvedPreset`, you can execute a GraphQL
query via:

```js
import { grafast } from "grafast";

const { data, errors } = await grafast({
  schema,
  resolvedPreset,
  requestContext: {
    // This is the "request context" - it is **NOT** the GraphQL context
  },
  source: /* GraphQL */ `
    query MyQuery {
      __typename
    }
  `,
  variableValues: {},
});
```

`grafast()` is equivalent to `graphql()` except it also accepts two additional
optional entries in the `args` object: the `resolvedPreset` and the _request
context_ `requestContext`. If you pass these parameters then `grafast` will
take care of building the _GraphQL context_ for you based on what is in your
preset.

:::caution

Do not confuse `requestContext` with the GraphQL context; `requestContext` is
the parameter passed to your `preset.grafast.context(requestContext)` callback
(and any plugins that need it) containing details of where the request came
from. In a node HTTP web server it would typically be something like
`requestContext = { node: { req, res } }` and would be used to extract things
like the `Authorization` header to determine who is making the request.
Different servers and situations may add alternative or additional information.

:::

## Execution with `hookArgs()`

If you do not (or can not) pass these parameters to `grafast()` then you will
need to call `hookArgs()` yourself to build the GraphQL context that PostGraphile
will need in order to communicate with the database. This also means that
you're taking care of parsing and validating the GraphQL request yourself.

:::tip

If you're doing this inside a server framework, they will often give you a way
to hook the args before they're dispatched to execute - that is where you would
call `hookArgs()`.

:::

Here's a full example:

```ts
import { makeSchema } from "postgraphile";
import { parse, validate } from "postgraphile/graphql";
import { hookArgs, execute } from "postgraphile/grafast";

import preset from "./graphile.config.js";

// Trigger schema building outside of `executeQuery` so we only do it once:
const schemaResultPromise = makeSchema(preset);

/**
 * Given a request context `requestContext`, GraphQL query text `source` and
 * optionally variable values and operation name, execute the given GraphQL
 * operation against our schema and return the result.
 */
export async function executeQuery(
  requestContext: Grafast.RequestContext,
  source: string,
  variableValues?: Record<string, unknown> | null,
  operationName?: string,
) {
  // Finish loading the schema:
  const { schema, resolvedPreset } = await schemaResultPromise;

  // Parse the GraphQL query text:
  const document = parse(source);

  // Validate the GraphQL document against the schema:
  const errors = validate(schema, document);
  if (errors.length > 0) {
    throw new Error(`Validation error(s) occurred`, { cause: errors });
  }

  // Prepare the execution arguments:
  const args = await hookArgs(
    {
      schema,
      document,
      variableValues,
      operationName,
    },
    resolvedPreset,
    requestContext,
  );

  // Execute the request using Grafast:
  return await execute(args, resolvedPreset);
}
```
