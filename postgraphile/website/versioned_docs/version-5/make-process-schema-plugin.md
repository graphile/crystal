---
title: makeProcessSchemaPlugin
---

This plugin enables a way of processing the schema after it’s built.

Use cases include:

- Printing the schema SDL to a file
- Uploading the schema SDL to a network service
- Checking the schema against your persisted queries
- Validating the schema against your custom logic
- Exporting the executable schema (in JavaScript) to a file
- Replacing the schema with a mocked version or a derivative version (e.g.
  stitching it with another schema)
- Integrating with third-party libraries

## Signature

```ts
function makeProcessSchemaPlugin(
  process: (schema: GraphQLSchema) => GraphQLSchema,
): GraphileConfig.Plugin;
```

The plugin accepts one argument: a schema processing function which will be
called with the generated schema and must either return the same schema (e.g. if
you’re doing a read-only operation, or mutating the schema directly) or return
an alternative schema (typically a derivative).

:::info How to do this asynchronously

The callback to this plugin operates synchronously. If you need to do
asynchronous work then be sure to handle any errors that may occur, and note
that the result of the asynchronous work will not affect the return result of
this plugin (and thus the schema being used by your server).

:::

:::warning Compatibility with third parties

Because PostGraphile schemas use Gra*fast* plan resolvers, third party tooling
that manipulate traditional resolvers are likely to break the schema, and not
achieve the goals set out. For example, `graphql-shield` is currently not
compatible with Gra*fast* plans.

:::

## Example: exporting the schema as exportable code

```ts
import { makeProcessSchemaPlugin } from "postgraphile/utils";
import { exportSchema } from "graphile-export";

const ExportSchemaPlugin = makeProcessSchemaPlugin((schema) => {
  exportSchema(schema, `${process.cwd()}/exported-schema.mjs`, {
    mode: "typeDefs",
  }).catch((e) => {
    console.error(e);
  });
  return schema;
});
```
