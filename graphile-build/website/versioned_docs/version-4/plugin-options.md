---
title: Options
---

# Plugin Options

The second argument to
[`buildSchema` and `getBuilder`](./graphile-build#the-graphile-build-module)
is an **`options`** object with arbitrary properties which is made available to
every plugin as its second argument.

### Supported Options

The following options apply to the default plugins:

- `nodeIdFieldName` - defaults to `id` which might clash with your other fields.
  It is not recommended to change it, but you might consider `nodeId` instead.
  (Use of `__id` is discouraged because GraphQL wants to deprecate
  non-introspection fields that begin with `__`)

Plugins may expect further options if they wish, for example see
[those of `graphile-build-pg`](/graphile-build-pg/4/settings/). To prevent
collisions between the property names, the plugins should follow some
namespacing conventions.

### Example

The following example passes the `nodeIdFieldName` setting through, changing
from the default `id` to `flibble`:

<!-- source: examples/empty-schema-with-options.js -->

```js
const { buildSchema, defaultPlugins } = require("graphile-build");
const { printSchema } = require("graphql/utilities");

buildSchema(defaultPlugins, { nodeIdFieldName: "flibble" }).then((schema) => {
  console.log(printSchema(schema));
});
```

which modifies the Node interface thusly:

```graphql
interface Node {
  # A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  flibble: ID!
}
```
