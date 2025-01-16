---
title: makeProcessSchemaPlugin
---

# makeProcessSchemaPlugin (graphile-utils)

**This documentation applies to PostGraphile v4.1.0+**

This plugin enables a way of processing the schema after it's built.

Use cases include:

- Printing the schema SDL to a file
- Uploading the schema SDL to a network service
- Checking the schema against your persisted queries
- Validating the schema against your custom logic
- Replacing the schema with a mocked version or a derivative version (e.g.
  stitching it with another schema)
- Integrating with third-party libraries

The plugin accepts one argument: a schema processing function which will be
called with the generated schema and must either return the same schema (e.g. if
you're doing a read-only operation, or mutating the schema directly) or return
an alternative schema (e.g. a derivative).

:::note
Some third party tooling mutates the existing GraphQL schema
which is likely to cause issues. Please use only tools that treat GraphQL
schemas as immutable; if you cannot then try building a sacrificial schema that
delegates to the PostGraphile schema but can be mutated.
:::

### Example

```js
const { makeProcessSchemaPlugin } = require("graphile-utils");

module.exports = makeProcessSchemaPlugin((schema) => {
  return addThirdPartyEnhancementsToSchema(schema);
});
```

You can also use `makeProcessSchemaPlugin` to replace the current schema with a
stitched schema and run it from within the PostGraphile server:

```js
const { makeProcessSchemaPlugin } = require("graphile-utils");

module.exports = makeProcessSchemaPlugin((schema) => {
  return stitchOtherSchemasInto(schema);
});
```
