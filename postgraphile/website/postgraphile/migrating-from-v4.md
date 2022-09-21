# Migrating from V4

:::warning

This guide assumes you're using a pre-release of PostGraphile V5. This release
is not yet production ready, and things are liable to change before the final
release.

:::

One of the main aims for PostGraphile V5 was to replace the "lookahead engine"
with something better. This ended up with us writing our own GraphQL runtime,
called [Gra*fast*][grafast], which has a carefully constructed planning phase.
By happy coincidence this also allowed us to generate much more efficient SQL
queries, and to execute requests much faster than in V4.

However, Grafast was completely different (not similar in the slightest) to V4's
lookahead engine, and that lookahead engine was the beating heart of V4.
Replacing it required us to rebuild the entire stack back up on top of these new
foundations.

Since we had to rebuild everything anyway, we decided to fix a large number of
issues that had been bugging us for a while now... So the plugin system has been
transformed, the configuration system has been consolidated and transformed, the
smart tags have been replaced with behaviors, all the plugins have been
rewritten or replaced, ... but I'm getting ahead of myself.

If you're reading this, you probably want to know how to take your PostGraphile
V4 project and run it in PostGraphile V5 instead with the minimal of fuss, so
let's get started.

## Basic configuration

PostGraphile V5 requires a "preset" to be specified; this allows us to change
the defaults for new users over time without breaking the APIs of users on older
presets. We should no longer need a "recommended options" section in the docs -
just a recommended preset!

To achieve this, we've introduced a new module: `graphile-config`. This module
takes care of the common concerns relating to configuration, in particular:
presets, plugins and options. You store your config into a `graphile.config.js`
file and this can then be used from the command line, library mode, or even
schema-only mode - they all share the same config.

We've built a `makeV4Preset` preset factory for you that converts a number of
the options that you are familiar with into their V5 equivalents. To use it,
feed your options into its first argument, and combine it with
`postgraphile/presets/amber` (our first preset) to get a completed config:

```ts
/* eslint-disable import/no-unresolved */
import "graphile-config";

import postgraphilePresetAmber from "postgraphile/presets/amber";
import { makeV4Preset } from "postgraphile/presets/v4";

/** @type {GraphileConfig.Preset} */
const preset = {
  extends: [
    postgraphilePresetAmber,
    makeV4Preset({
      /* PUT YOUR V4 OPTIONS HERE */
      simpleCollections: "both",
      jwtPgTypeIdentifier: '"b"."jwt_token"',
    }),
  ],
};

export default preset;
```

Note that the `appendPlugins` and `pluginHook` config options are either ignored
or require V5-capable plugins.

:::info

Right now, not many of the V4 plugins have been ported to V5, but with your help
hopefully we can fix that!

:::

### Breaking changes

We've done our best to maintain as much compatibility with a V4 GraphQL schema
as possible, but some breaking changes persist (we'd argue they're for the
better!). Of course if any of these are critical issues to you they can all be
solved by writing a plugin to shape the GraphQL API how you need, but we suggest
that if possible you accept these new changes.

- The long deprecated "legacy relations" are no longer generated.
- Node IDs for bigint columns have changed (specifically numbers under
  `MAX_SAFE_INT` now have quote marks inside the encoding too)
- The `@foreignKey` smart tag must reference a unique constraint or primary key
- In alignment with the
  [Cursor connections specification](https://relay.dev/graphql/connections.htm),
  connection edges are nullable and cursors are not. It seems we implemented
  this the wrong way around in V4.
- For `fooEdge` fields on mutation payloads, the `orderBy` argument is now
  non-nullable. It still has a default, so this will only affect you if you were
  explicitly passing null (why would you do that?!)
- The `fooEdge` fields on mutation payloads now only exist if the table has a
  primary key.

Other changes:

- The values generated for `cursor` differ. This is not deemed to be a breaking
  change, as these may change from one release to the next.

## Running

You can run V5 with the `postgraphile` command. Now that it automatically reads
the `graphile.config.js` file it does not need to support as many command line
options. Currently the main options are:

- `-c postgres://...` - your connection string (same as in V4)
- `-s app_public` - your list of PostgreSQL schemas (same as in V4)
- `-e` - enable "explain" - this allows GraphiQL (now called Ruru) to render the
  operation plan and SQL queries that were executed

## Server

PostGraphile's HTTP server has been replaced with [Grafserv][], our new
ultra-fast general purpose GraphQL server. Currently this doesn't support the
same hooks that V4's server did, but we can certainly extend the hooks support
over time.

## Plugins

The plugin architecture has changed, whereas plugins previously were functions,
they are now declarative objects. For example a plugin that adds the
`Query.four` field might have looked like this in V4:

```js
module.exports = (builder) => {
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    const {
      graphql: { GraphQLInt },
    } = build;
    const { Self } = context;
    if (Self.name !== "Query") return fields;
    return build.extend(
      fields,
      {
        four: {
          type: GraphQLInt,
          resolve() {
            return 4;
          },
        },
      },
      "Adding Query.four",
    );
  });
};
```

In V5 the equivalent would be:

```js
const { constant } = require("grafast");

module.exports = {
  name: "AddQueryFourFieldPlugin",
  version: "0.0.0",
  schema: {
    hooks: {
      GraphQLObjectType_fields(fields, build, context) {
        const {
          graphql: { GraphQLInt },
        } = build;
        const { Self } = context;
        if (Self.name !== "Query") return fields;
        return build.extend(
          fields,
          {
            four: {
              type: GraphQLInt,
              plan() {
                return constant(4);
              },
            },
          },
          "Adding Query.four",
        );
      },
    },
  },
};
```

This new structure allows the system to learn more about the plugin before
actually running it, and can improve the debugging messages when things go
wrong. The actual body of the hooks themselves is very similar, however you must
keep in mind that we no longer have the lookahead system (so
`addArgDataGenerator` and its ilk no longer exist), instead we use [Grafast plan
resolvers][].

[grafast]: https://grafast.org
[grafast plan resolvers]: https://grafast.org/grafast/plan-resolvers
[grafserv]: https://grafast.org/grafserv
