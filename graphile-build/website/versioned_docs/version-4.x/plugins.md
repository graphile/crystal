---
title: Plugins
---

<p class="intro">
Almost everything in Graphile Engine is accomplished through plugins. You can
add plugins, remove plugins, even replace the entire stack if you so desire.
</p>

## Loading Plugins

Plugins are loaded when you call
[`buildSchema(plugins, options)`](./graphile-build#buildschemaplugins-options)
or
[`getBuilder(plugins, options)`](./graphile-build#getbuilderplugins-options).
They may be asynchronous thus these functions return a promise; Graphile Engine
will wait for each plugin to finish loading before attempting to load the next
plugin - so the order in which you specify the plugins may be important.

Here's how you might load the default plugins:

```js
const { buildSchema, defaultPlugins } = require("graphile-build");
const { printSchema } = require("graphql/utilities");

const plugins = [
  ...defaultPlugins,
  // Add more plugins here!
];

buildSchema(plugins).then((schema) => {
  console.log(printSchema(schema));
});
```

## Writing Plugins

Graphile Engine plugins are simple functions that interact with
[the `SchemaBuilder`](./schema-builder), most commonly by
registering hooks. When you perform
[`buildSchema(plugins)`](./graphile-build) we create a new
`SchemaBuilder` instance and then load each of the plugins against it.

If a plugin returns a `Promise` (e.g. an asynchronous plugin) then we will wait
for that promise to resolve before continuing to load the next plugin, otherwise
we will assume the plugin is synchronous. This asynchronous period should be
used for performing tasks such as introspecting a data store or fetching a file
from the internet; the hooks themselves run synchronously and thus must not
perform any asynchronous work.

An example of a plugin that does nothing is this no-op plugin:

```js
function NoopPlugin(builder) {
  console.log("I don't do anything");
}
```

which you can load into your schema like so:

```js
const { buildSchema, defaultPlugins } = require("graphile-build");
const { printSchema } = require("graphql/utilities");

buildSchema([...defaultPlugins, NoopPlugin]).then((schema) => {
  console.log(printSchema(schema));
});
```

<details>
<summary>View output</summary>

```graphql
I don't do anything
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

</details>

### Plugin actions

Whilst a plugin is being executed it can perform actions on the
[`builder` object](./schema-builder), its first argument.

The most common actions for a plugin are:

- Register a [**Hook**](./hooks) callback to perform
  transformations at a specific step in the build, using
  `builder.hook(hookName, hookFunction)`. Through the use of hooks, a plugin
  might provide functionality for other plugins, overwrite functionality that
  was exposed by other plugins, or add things to specific parts of the schema.
- Add watch-mode event listeners, using
  [`builder.registerWatcher(watcher, unwatcher)`](./schema-builder#registerwatcherwatcher-unwatcher)

### An example plugin

This plugin will add a field `random(sides: Int)` to every GraphQLObjectType
that is generated with hooks:

```js
// No imports required!

module.exports = function MyRandomFieldPlugin(
  builder,
  { myDefaultMin = 1, myDefaultMax = 100 },
) {
  builder.hook(
    "GraphQLObjectType:fields",
    (
      fields, // input object
      { extend, graphql: { GraphQLInt } }, // Build
      context, // Context
    ) => {
      return extend(fields, {
        random: {
          type: GraphQLInt,
          args: {
            sides: {
              type: GraphQLInt,
            },
          },
          resolve(_, { sides = myDefaultMax }) {
            return (
              Math.floor(Math.random() * (sides - myDefaultMin + 1)) +
              myDefaultMin
            );
          },
        },
      });
    },
  );
};
```

First it registers a hook on `GraphQLObjectType:fields` which will be called for
the `fields` property of every `GraphQLObjectType` that is constructed.

The callback to this [hook](./hooks) is passed the three standard
options:

- input object, `fields`, which is basically a
  [`GraphQLFieldConfigMap` from graphql-js](http://graphql.org/graphql-js/type/#graphqlobjecttype)
- [`Build` object](./build-object) (from which we're using
  `extend` and `graphql.GraphQLInt`)
- [`Context` object](./context-object) which it is ignoring; but
  if we wanted to filter which objects get the `random` field added this would
  be what we'd use

Finally we're returning a derivative of the `fields` that were input by adding
an additional property `field` which is a standard GraphQL field config
`GraphQLFieldConfig` - see the
[GraphQL-js documentation](http://graphql.org/graphql-js/type/#graphqlobjecttype).

### Plugin arguments

Plugins are called with just two arguments:

- `builder` - the instance of [`SchemaBuilder`](./graphile-build)
  the plugin is being loaded against
- `options` - [the options](./plugin-options) that were passed to
  `buildSchema(plugins, options)` (or `getBuilder(plugins, options)`)
