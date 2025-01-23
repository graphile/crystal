---
title: Direct Schema Usage
---

# PostGraphile Schema-Only Usage

The PostGraphile library mode gives you a lot of excellent features for running
your own GraphQL server. However, if you want to execute a PostGraphile query in
Node.js without having to go through HTTP you can use some other exported
functions that PostGraphile provides.

**If you're looking for Apollo Client SSR support for PostGraphile without a
network roundtrip, check out
[GraphileApolloLink in Graphile Starter](https://github.com/graphile/starter/blob/516cf0cf35f1d9e0904f74e68d3a2dc51a59225d/%40app/lib/src/GraphileApolloLink.ts).**

## Getting the schema

First you will need a PostGraphile instance, typically called `pgl`. If you're
already using PostGraphile somewhere, you can likely import it from there;
but if not you can create it yourself:

```js title="pgl.js"
import { postgraphile } from "postgraphile";
import preset from "./graphile.config.js";

export const pgl = postgraphile(preset);
```

You can then get the schema result from this instance; this is an object
consisting of:

- `schema` - the GraphQL schema
- `resolvedPreset` - the resolved preset

```js
import { pgl } from "./pgl.js";

const { schema, resolvedPreset } = await pgl.getSchemaResult();
```

You should call the above function whenever you need the schema, rather than
caching the result - the reason is that in "watch" mode the schema (and preset)
may change over time, so this is a safe way to get the latest schema.

:::info

If you want to get a schema with minimal overhead and are not concerned
about supporting "watch" mode, you can instead call `makeSchema` directly:

```js
import { makeSchema } from "postgraphile";
import preset from "./graphile.config.js";

const { schema, resolvedPreset } = await makeSchema(preset);
```

:::

## Easy execution: `grafast()`

Now that you have `schema` and `resolvedPreset`, you can execute a GraphQL
query via:

```js
import { grafast } from "postgraphile/grafast";

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

### Full example

Here's a full example:

```ts
import { postgraphile } from "postgraphile";
import { grafast } from "postgraphile/grafast";
import preset from "./graphile.config.js";

// Make a new PostGraphile instance:
const pgl = postgraphile(preset);
// Or import a shared instance:
//   import { pgl } from "./pgl.js"

/**
 * Given a request context `requestContext`, GraphQL query text `source` and
 * optionally variable values and operation name, execute the given GraphQL
 * operation against our schema and return the result.
 */
export async function executeQuery(
  requestContext: Partial<Grafast.RequestContext>,
  source: string,
  variableValues?: Record<string, unknown> | null,
  operationName?: string,
) {
  const { schema, resolvedPreset } = await pgl.getSchemaResult();
  return await grafast({
    schema,
    source,
    variableValues,
    operationName,
    resolvedPreset,
    requestContext,
  });
}
```

## Execution with `hookArgs()`

If you do not (or can not) pass the `requestContext` and `resolvedPreset`
parameters to `grafast()`, or you want to deal with raw GraphQL documents
rather than source strings, then you will need to call `hookArgs()` yourself to
build the GraphQL context that PostGraphile will need in order to communicate
with the database. This also means that you're taking care of parsing and
validating the GraphQL request yourself.

:::tip

If you're doing this inside a server framework, they will often give you a way
to hook the args before they're dispatched to execute - that is where you would
call `hookArgs()`.

:::

### Basic `hookArgs` example

Here's an example using hookArgs:

```ts
import { postgraphile } from "postgraphile";
import { parse, validate } from "postgraphile/graphql";
import { execute, hookArgs } from "postgraphile/grafast";
import preset from "./graphile.config.js";

// Build a `pgl` instance, with helpers and schema based on our preset.
const pgl = postgraphile(preset);

/**
 * Given a request context `requestContext`, GraphQL query text `source` and
 * optionally variable values and operation name, execute the given GraphQL
 * operation against our schema and return the result.
 */
export async function executeQuery(
  requestContext: Partial<Grafast.RequestContext>,
  source: string,
  variableValues?: Record<string, unknown> | null,
  operationName?: string,
) {
  // We might get a newer schema in "watch" mode
  const { schema, resolvedPreset } = await pgl.getSchemaResult();

  // Parse the GraphQL query text:
  const document = parse(source);

  // Validate the GraphQL document against the schema:
  const errors = validate(schema, document);
  if (errors.length > 0) {
    return { errors };
  }

  // Prepare the execution arguments:
  const args = await hookArgs({
    schema,
    document,
    variableValues,
    operationName,
    resolvedPreset,
    requestContext,
  });

  // Execute the request using Grafast:
  return await execute(args);
}
```

### Example using `TypedDocumentNode`

You can use GraphQL Code Generator with the client-preset to make your GraphQL
execution function type safe. In this case, rather than passing in a raw
`source` string, we pass in a `TypedDocumentNode` which is generated by the
`gql` tagged template literal, and this means the result we return will
automatically reflect the correct types thanks to graphql-codegen:

```ts
import type { DocumentNode, ExecutionResult } from "postgraphile/graphql";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { postgraphile } from "postgraphile";
import { execute, hookArgs } from "postgraphile/grafast";
import { validate } from "postgraphile/graphql";
import preset from "./graphile.config.js";

const pgl = postgraphile(preset);

export async function executeDocument<TData = any, TVariables = any>(
  requestContext: Partial<Grafast.RequestContext>,
  document: DocumentNode | TypedDocumentNode<TData, TVariables>,
  variableValues?: Record<string, unknown> | null,
  operationName?: string,
): Promise<ExecutionResult<TData, TVariables>> {
  const { schema, resolvedPreset } = await pgl.getSchemaResult();

  // Validate the GraphQL document against the schema:
  const errors = validate(schema, document);
  if (errors.length > 0) {
    return { errors };
  }

  // Prepare the execution arguments:
  const args = await hookArgs({
    schema,
    document,
    variableValues,
    operationName,
    resolvedPreset,
    requestContext,
  });

  // Execute the request using Grafast:
  const result = await execute(args);

  // Cast the result to the types implied by the TypedDocumentNode:
  return result as ExecutionResult<TData, TVariables>;
}
```
