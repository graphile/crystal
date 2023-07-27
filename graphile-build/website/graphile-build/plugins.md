---
layout: page
path: /graphile-build/plugins/
title: Plugins
sidebar_position: 2
---

The plugin system Graphile Build uses is provided by the `graphile-config`
module. This module isn't specific to any project (it's used by Graphile Build,
PostGraphile, Gra*fast*, Grafserv, and more), and it handles the common
requirements of a plugin and preset system (composing plugins, ordering them,
handling dependencies, disabling plugins, etc) without worrying about the
details specific to any one use case. The specifics are handled by named
"scopes", which are root-level keys in the plugin object.

Graphile Build plugins are `graphile-config` plugins that have one or more of
the following scopes:

- `inflection`
- `gather`
- `schema`

:::info

Plugins with none of the scopes listed above can still be included in a
Graphile Build preset, they will just have no effect. This allows users
to share a single configuration across many different projects.

:::

## Presets

`graphile-config` also provides the preset system used by Graphile Build. A
preset is simply a collection of other presets, plugins, and configuration
options to use. Presets can "extend from" other presets, and it's very common
to start your preset off by extending Graphile Build's `defaultPreset`:

```js title="graphile.config.mjs"
import { defaultPreset } from "graphile-build";

export default {
  extends: [defaultPreset],
};
```

Once you have a preset, you can feed it into the relevant Graphile Build methods, such as `buildSchema`:

```js {3, 5}
import { buildSchema } from "graphile-build";
import { printSchema } from "graphql";
import preset from "./graphile.config.mjs";

const schema = await buildSchema(preset);
console.log(printSchema(schema));
```

## Writing Plugins

A Graphile Build plugin is a simple object with a `name`, `description`,
`version` and entries for any of the scopes it wishes to implement.

Here's a plugin that does nothing:

```js
const NoopPlugin = {
  name: "NoopPlugin",
  version: "0.0.0",
  description: "Does nothing",
};
```

The scopes that a plugin might implement relate to the phases of schema
building. Schema building starts with the `inflection` phase, where the various
inflectors which control the naming of things are registered and customized.
Next comes the `gather` phase, where data is collected (for example by
performing introspection against your database). Finally we have the `schema`
phase where the behaviors of all the entities from the gather phase are
determined and then the schema is generated.

### `inflection` scope

If a plugin wants to name things, or change how things are named, it would
implement the `inflection` scope.

This plugin replaces the `builtin` inflector so that the root types `Query`,
`Mutation` and `Subscription` are renamed to `RootQuery`, `RootMutation` and
`RootSubscription`:

```js
const RootNamingPlugin = {
  name: "RootNamingPlugin",
  version: "0.0.0",
  description: "Prefixes 'Root' to the root operation types",

  inflection: {
    replace: {
      builtin(previous, options, text) {
        if (["Query", "Mutation", "Subscription"].includes(text)) {
          return `Root${text}`;
        } else {
          return previous.call(this, text);
        }
      },
    },
  },
};
```

### `gather` scope

If a plugin needs to do something asynchronous, such as gather data from a
remote source, or read it from a file, then that work should be done via the
`gather` scope.

### `schema` scope

Most commonly, Graphile Build plugins will want to implement the `schema` scope
in order to affect the GraphQL schema that is being built. The GraphQL schema
is built by hooking the various configuration objects that are passed to the
constructors in GraphQL.js (such as `GraphQLObjectType`,
`GraphQLInputObjectType`, `GraphQLUnionType`, etc) and some of their
configuration fields (such as `GraphQLObjectType`'s `fields` or `interfaces`
configuration fields), and sometimes even the fields within that, or deeper
still. The deepest hook is `GraphQLObjectType_fields_field_args_arg` which is
used to manipulate a specific argument from the list of arguments from a
specific field from a list of fields on a specific GraphQL object type.

Every hook is passed three parameters, the first parameter is the entity
configuration being manipulated, the second is the [build object](./build-object)
which is common to all hooks, and the third is the [context object](./context-object)
specific to that hook, which gives a description (via the `scope`) of what is
actually being hooked.

#### Example 1

For example this plugin adds a field to the root
query type by hooking `GraphQLObjectType_fields`, and looking at the
`context.scope.isRootQuery` to determine if this is the object that we want to
modify:

```js
import { constant } from "grafast";

const RootQueryFieldPlugin = {
  name: "RootQueryFieldPlugin",
  version: "0.0.0",
  description: "Adds a field to the root Query type",

  schema: {
    hooks: {
      GraphQLObjectType_fields(fields, build, context) {
        // Only add the field to the root query type
        if (!context.scope.isRootQuery) return fields;

        // Add a field called `meaningOfLife`
        fields.meaningOfLife = {
          // It's an integer
          type: build.graphql.GraphQLInt,

          // When you call the field, you should always return the number '42'
          plan() {
            return constant(42);
          },
        };

        return fields;
      },
    },
  },
};
```

#### Example 2

This plugin will add a field `random(sides: Int)` to every GraphQLObjectType
that is generated:

```js
// No imports required!

const MyRandomFieldPlugin = {
  name: "MyRandomFieldPlugin",
  version: "0.0.0",

  schema: {
    GraphQLObjectType_fields(fields, build, context) {
      const {
        extend,
        graphql: { GraphQLInt },
        options: { myDefaultMin = 1, myDefaultMax = 100 },
      } = build;
      return extend(fields, {
        random: {
          type: GraphQLInt,
          args: {
            sides: {
              type: GraphQLInt,
            },
          },
          plan(_, fieldArgs) {
            const $sides = fieldArgs.get("sides");
            return lambda(
              $sides,
              (sides) =>
                Math.floor(
                  Math.random() * ((sides ?? myDefaultMax) - myDefaultMin + 1),
                ) + myDefaultMin,
            );
          },
        },
      });
    },
  },
};
```

First it registers a hook on `GraphQLObjectType_fields` which will be called for
the `fields` property of every `GraphQLObjectType` that is constructed.

The callback to this [hook](./hooks) is passed the three standard
options:

- input object, `fields`, which is basically a
  [`GraphQLFieldConfigMap` from graphql-js](http://graphql.org/graphql-js/type/#graphqlobjecttype).
- [`Build` object](/graphile-build/build-object/) (from which we're using
  `extend` and `graphql.GraphQLInt`
- [`Context` object](/graphile-build/context-object/) which it is ignoring; but
  if we wanted to filter which objects get the `random` field added this would
  be what we'd use

Finally we're returning a derivative of the `fields` that were input by adding
an additonal property `field` which is a GraphQL field config
`GraphQLFieldConfig` (see the [GraphQL-js
documentation](http://graphql.org/graphql-js/type/#graphqlobjecttype)) but with
Gra*fast* features mixed in - most notably the `plan` (rather than a `resolve`
method).

[Read more about hooks](./hooks).
