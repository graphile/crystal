---
layout: page
path: /graphile-build/getting-started/
title: Getting Started
---

### Installation

graphile-build uses your local version of `graphql` to avoid conflicts, so you
need to install both:

```bash
npm install --save graphile-build graphql
```

### Building your Schema

The [`buildSchema`](/graphile-build/schema-builder/#buildSchema) method will
(asynchronously) build a GraphQL schema from a list of plugins. We ship a number
of [default plugins](/graphile-build/default-plugins/) that are sufficient to
create a simple schema, like so:

<!-- source: examples/empty-schema.js -->

```js
const { buildSchema, defaultPlugins } = require("graphile-build");
const { printSchema } = require("graphql/utilities");

buildSchema(defaultPlugins).then(schema => {
  console.log(printSchema(schema));
});
// ES2017: const schema = await buildSchema(defaultPlugins);
```

This will generate a basic schema which supports the
[Relay `Node` interface](https://relay.dev/docs/en/graphql-server-specification).

```graphql
# An object with a globally unique `ID`.
interface Node {
  # A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  id: ID!
}

# The root query type which gives access points into the data universe.
type Query implements Node {
  # Exposes the root query type nested one level down. This is helpful for Relay 1
  # which can only query top level fields if they are in a particular form.
  query: Query!

  # The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`.
  id: ID!

  # Fetches an object given its globally unique `ID`.
  node(
    # The globally unique `ID`.
    id: ID!
  ): Node
}
```

(See [Omitting Plugins](/graphile-build/omitting-plugins/) for how to make this
schema even simpler by omitting the Node interface, and
[Options](/graphile-build/plugin-options/) for how to pass options to plugins.)
