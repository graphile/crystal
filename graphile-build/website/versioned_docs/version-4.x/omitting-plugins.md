---
layout: page
path: /graphile-build/omitting-plugins/
title: Omitting Plugins
---

<p class="intro">
Whilst `graphile-build` and `graphile-build-pg` come with a lot of useful
plugins enabled by default, you might not want all of them. It's easy to
remove one though - simply omit it from the list of plugins you pass to
`buildSchema`. Here's some examples:
</p>

### Building the basic Schema without the Node interface

It's possible to build an even more minimal schema without Relay `Node`
specification support by omitting the
[`NodePlugin`](/graphile-build/default-plugins/#NodePlugin) plugin:

<!-- source: examples/emptier-schema.js -->

```js
const { buildSchema, defaultPlugins, NodePlugin } = require("graphile-build");
const { printSchema } = require("graphql/utilities");

buildSchema(defaultPlugins.filter(plugin => plugin !== NodePlugin)).then(
  schema => {
    console.log(printSchema(schema));
  }
);
```

which generates this much simpler schema:

```graphql
# The root query type which gives access points into the data universe.
type Query {
  # Exposes the root query type nested one level down. This is helpful for Relay 1
  # which can only query top level fields if they are in a particular form.
  query: Query!
}
```
