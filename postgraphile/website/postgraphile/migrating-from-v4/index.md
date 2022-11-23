# Migrating from V4

One of the main aims for PostGraphile V5 was to replace the "lookahead engine"
with something better: easier to reason about, easier to maintain and extend,
easier for users to interact with, and more capable of handling GraphQL's
present and future feature set (V4's lookahead doesn't even support interfaces
and unions, let alone `@stream`, `@defer`, client controlled nullability, and
everything else that's coming down the GraphQL pipeline).

We didn't set out to do so, but ultimately this ended up with us writing our own
GraphQL runtime, called [Gra*fast*][grafast]. This runtime is built around a
carefully engineered planning phase followed by an highly optimized execution
phase. By happy coincidence this also allowed us to generate much more efficient
SQL queries, and to execute requests much faster than in V4.

However, Grafast was completely different (not similar in the slightest) to V4's
lookahead engine, and that lookahead engine was the beating heart of V4.
Replacing it required us to rebuild the entire stack from scratch on top of
these new foundations.

Since we had to rebuild everything anyway, we decided to fix a large number of
issues that had been bugging us for a while now... The plugin system has been
transformed, the configuration system has been consolidated and transformed, the
smart tags have been replaced with behaviors, all the plugins have been
rewritten or replaced, ... but I'm getting ahead of myself.

If you're reading this, you probably want to know how to take your PostGraphile
V4 project and run it in PostGraphile V5 instead with the minimal of fuss, so
let's get started. Note that there are subpages dedicated to particular
plugin/plugin generators that need their own V5 migration strategy.

## Basic configuration

PostGraphile V5 requires a "preset" to be specified; this allows users to start
with the best settings for their intended use case without having to read pages
of documentation first. It also allows us to evolve the defaults over time
without breaking existing users schemas - ultimately meaning we no longer need a
"recommended options" section in the docs.

To achieve this, we've introduced a new module: `graphile-config`. This module
takes care of the common concerns relating to configuration, in particular:
presets, plugins and options. You store your config into a `graphile.config.js`
file and this can then be used from the command line, library mode, or even
schema-only mode - they all share the same config.

To make the transition to this new system easier, we've built a `makeV4Preset`
preset factory for you that converts a number of the options that you are
familiar with from V4 into their V5 equivalents. To use it, feed your options
into its first argument, and combine it with `postgraphile/presets/amber` (our
initial preset) to get a completed config:

```ts title="graphile.config.js"
import "graphile-config";

import { makePgSources } from "postgraphile";
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

  plugins: [
    // Add V5 equivalents of your
    // appendPlugins/prependPlugins/skipPlugins/pluginHook plugins here.
  ],

  // If you're using the CLI you can skip this and use the `-c` and `-s`
  // options instead, but we advise configuring it here so all the modes of
  // running PostGraphile can share it.
  pgSources: makePgSources(
    // Database connection string:
    process.env.DATABASE_URL,
    // List of schemas to expose:
    ["app_public"],
  ),
};

export default preset;
```

Note that the `appendPlugins`/`prependPlugins`/`skipPlugins` options require
V5-compatible plugins, and `pluginHook` is no longer supported - please use the
`plugins` configuration key instead.

:::info

Right now, not many of the V4 plugins have been ported to V5, but with your help
hopefully we can fix that!

:::

### additionalGraphQLContextFromRequest

This has been replaced with the 'grafast.context' option; please see
[configuration - context](../config.md#grafast-options).

### pgSettings

This is now a regular entry inside the GraphQL context returned from your
'grafast.context' configuration, for more details see
[configuration - context](../config.md#grafast-options).

## Breaking changes

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
  explicitly passing `null` (why would you do that?!)
- The `fooEdge` fields on mutation payloads now only exist if the table has a
  primary key.

Other changes:

- The values generated for `cursor` differ. This is not deemed to be a breaking
  change, as these may change from one release to the next (even patch versions)

## Running

### CLI

You can run V5 with the `postgraphile` command. Now that it automatically reads
the `graphile.config.js` file you should use that for advanced configuration of
the PostGraphile CLI. Currently the main options are:

- `-P` - the preset to use, e.g. `-P postgraphile/presets/amber`
- `-p` - the port to listen on; if not set then it will try and use `5678` but
  _will fallback to a system-assigned port_ so be sure to set this in
  production!
- `-n` - the host to listen on; defaults to 'localhost' (you may want to change
  to '0.0.0.0' in Docker or similar environments)
- `-c postgres://...` - your connection string (same as in V4)
- `-s app_public` - your list of PostgreSQL schemas (same as in V4)
- `-e` - enable "explain" - this allows GraphiQL (now called Ruru) to render the
  operation plan and SQL queries that were executed
- `-C` - the config file to load; if not set we'll try and load
  `graphile.config.js` but won't raise an error if it doesn't exist

Example:

```bash
postgraphile -P postgraphile/presets/amber -c postgres:///my_db_name -s public -e
```

### Library mode

Load your config from your `graphile.config.js` file and feed it into the
`postgraphile` function. This function used to return a middleware, but now it
returns an object that contains the middleware under the `handler` key. Here's a
simple example:

```ts title="server.js"
import config from "./graphile.config.js";
import { postgraphile } from "postgraphile";
import { createServer } from "node:http";

const instance = postgraphile(config);

const server = createServer(instance.handler);
server.on("error", (e) => console.error(e));
server.listen(port);
```

### Schema only mode

No need for `withPostGraphileContext` any more; the context no longer has a
lifecycle that needs to be carefully managed - just run the query through
`grafast` as you normally would through `graphql`.

```ts title="schema-only.js"
import { grafast, hookArgs } from "grafast";
import { makeSchema } from "postgraphile";
import config from "./graphile.config.js";

async function main() {
  const { schema, resolvedPreset } = await makeSchema(config);

  const args = {
    schema,
    source: /* GraphQL */ `
      query MyQuery {
        __typename
      }
    `,
  };

  // Merge in the context and anything else plugins/presets want to add
  await hookArgs(
    args,
    {
      /* optional details for your context callback(s) to use */
    },
    resolvedPreset,
  );

  const result = await grafast(args);

  console.dir(result);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

## Server

PostGraphile's HTTP server has been replaced with [Grafserv][], our new
ultra-fast general purpose Grafast-powered GraphQL server. Currently this
doesn't support the same hooks that V4's server did, but we can certainly extend
the hooks support over time. If there's a particular hook you need, please reach
out.

## GraphiQL

Our beloved PostGraphiQL has been transformed into a more modern general purpose
GraphiQL called [Ruru][]. This still integrates into the server, but you can
also run it directly from the command line now too! It doesn't have a plugin
system yet, but it will :grin:

## Plugins

The plugin architecture has been transformed: whereas plugins previously were
functions, they are now declarative objects. For example a plugin that adds the
`Query.four` field might have looked like this in V4:

```js title="V4AddQueryFourFieldPlugin.js"
// Version 4 example; will not work with V5!
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

```js title="V5AddQueryFourFieldPlugin.js"
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

The callback itself is very similar, the hook name has been renamed to use
underscores instead of colons (`GraphQLObjectType:fields` ->
`GraphQLObjectType_fields`), and rather than explicitly calling a `hook`
function to register it, it's implicitly registered by being part of the plugin
object.

This new structure allows the system to learn more about the plugin before
actually running it, and can improve the debugging messages when things go
wrong.

Keep in mind that we no longer have the lookahead system (so
`addArgDataGenerator` and its ilk no longer exist), instead we use [Grafast plan
resolvers][].

## Plans, not resolvers

The new system uses [Gra*fast*][grafast] which has a plan based system, so
rather than writing traditional GraphQL resolvers for each field, you will write
[Grafast plan resolvers][]. This lends a lot more power to the system, and is a
lot more intuitive than our lookahead system once you've spent a little time
learning it. It also completely removes the need for old awkward-to-use
directives such as `@pgQuery` and `@requires`! (See
[makeExtendSchemaPlugin migration](./make-extend-schema-plugin) for details on
migrating these directives.)

## Introspection

`build.pgIntrospectionResultsByKind` is no more; instead we have a new library
[pg-introspection][] that takes care of introspection and has parts of the
PostgreSQL documentation built in via TypeScript hints.

The schema build process has been split into two phases:

- `gather`: looks at the introspection results and uses them to generate
  sources, codecs, relations and behaviors (the 4 building blocks)
- `schema`: looks at these sources, codecs, relations and behaviors and
  generates a GraphQL schema from them

Generally introspection data is not available during the `schema` phase; which
also means that you can manually write your own
sources/codecs/relations/behaviors and have a GraphQL schema autogenerated by
them independent of what your PostgreSQL schema actually is!

## Introspection cache

There is no introspection cache any more, so no `--read-cache`, `--write-cache`,
`readCache` or `writeCache`. Instead you can build the GraphQL schema and then
export it as executable code to a file using
[graphile-export][exporting schema]. In production you simply run this exported
code - there's no need for database introspection, schema building plugins,
etc - and you instantly get your schema without the complexities of building it
dynamically.

## Smart tags

Smart tags are still a thing, and they mostly behave the same, except we've
replaced the `@omit` and `@simpleCollections` smart tags and a few others with a
[behavior system](../behavior). This system gives much finer grained control
over which things should/should not be exposed in the schema, and how. If you
use the V4 preset then we'll automatically translate the old smart tags into
their behavior equivalents, so you shouldn't need to worry too much about this
right now. We do advise that you migrate to the behavior system though, it's
much more powerful.

## `buildSchema`

`buildSchema` is now synchronous - you need to run the asynchronous gather phase
first. The arguments have also changed: first is the preset (this encompasses
the list of plugins which was previously the first argument, and any settings
which were previously the second argument), second comes the result of gather
and finally comes the shared object which contains inflection.

```js
const preset = require("./graphile.config.js");

const config = resolvePresets([preset]);
const shared = { inflection: buildInflection(config) };
const input = await gather(config, shared);
const schema = buildSchema(config, input, shared);
```

## `postgraphile-core`

`postgraphile-core` is no more (look ma, I'm a poet!); here's how to replace a
few of the methods there.

### `createPostGraphileSchema`

Before:

```js
import { createPostGraphileSchema } from "postgraphile-core";

// ...

const gqlSchema = await createPostGraphileSchema(DATABASE_URL, "public", {
  // options
});
```

```js
import { makeSchema } from "postgraphile";
import config from "./graphile.config.js";

const { schema, contextCallback } = await makeSchema(config);
```

[grafast]: https://grafast.org
[ruru]: https://grafast.org/ruru
[grafast plan resolvers]: https://grafast.org/grafast/plan-resolvers
[grafserv]: https://grafast.org/grafserv
[pg-introspection]: https://npmjs.com/package/pg-introspection
[exporting schema]: ../exporting-schema
