---
layout: page
path: /postgraphile/usage-schema/
title: Direct schema usage
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

The `makeSchema` function accepts a [configuration preset](./config.mdx) and
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
import { getPreset } from "src/graphile.config.js";
import { postgraphile } from "postgraphile";
import { DocumentNode, ExecutionResult, validate } from "postgraphile/graphql";
import { execute, hookArgs } from "postgraphile/grafast";
// Optionally, if you're using GraphQL Code Generator with client-preset,
// you have use TypedDocumentNode to make the gqlQuery function type-safe.
import { TypedDocumentNode } from "@graphql-typed-document-node/core";

const preset = getPreset();

const pgl = postgraphile(preset);
// Or if you don't have `pgl`, you can also use makeSchema:
/**
 * import { makeSchema } from 'postgraphile';
 * const { schema, resolvedPreset } = await makeSchema(preset);
 */

/**
 * Given a request context `requestContext`, GraphQL query text `source` and
 * optionally variable values and operation name, execute the given GraphQL
 * operation against our schema and return the result.
 */
export async function gqlQuery<TData = any, TVariables = any>(
  requestContext: Partial<Grafast.RequestContext>,
  document: DocumentNode | TypedDocumentNode<TData, TVariables>,
  variableValues?: Record<string, unknown> | null,
  operationName?: string,
): Promise<ExecutionResult<TData, TVariables>> {
  // Finish loading the schema:
  const schema = await pgl.getSchema();
  const resolvedPreset = await pgl.getResolvedPreset();

  // Validate the GraphQL document against the schema:
  const errors = validate(schema, document);
  if (errors.length > 0) {
    throw new Error(`Validation error(s) occurred`, { cause: errors });
  }

  // Execute the request using Grafast:
  const args = await hookArgs({
    schema,
    document,
    variableValues,
    operationName,
    resolvedPreset,
    requestContext,
  });

  return (await execute(args)) as ExecutionResult<TData, TVariables>;
}
```
