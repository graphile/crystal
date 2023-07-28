---
layout: page
path: /postgraphile/plugins/
title: Server Plugins
---

_NOTE: This page relates to changing how the PostGraphile HTTP server
(Grafserv) and other non-schema concerns work. If you're instead looking to
change the generated GraphQL schema (e.g. to add fields or types), see [Schema
Plugins](./extending/)._

In addition to the [Graphile Build plugin system](./extending/) which builds
the GraphQL schema in PostGraphile, PostGraphile also has a plugin system for
the CLI and web layer. Thanks to `graphile-config`, this now uses the same
plugin system, just different scopes.

Currently these scopes are undocumented, so here's some examples

## Customizing Ruru's title:

```ts
function makeRuruTitlePlugin(title: string): GraphileConfig.Plugin {
  return {
    name: "RuruTitlePlugin",
    version: "0.0.0",

    grafserv: {
      hooks: {
        ruruHTMLParts(_info, parts, extra) {
          parts.titleTag = `<title>${escapeHTML(
            title + " | " + extra.request.getHeader("host"),
          )}</title>`;
        },
      },
    },
  };
}
```

## Manipulating the request body

For example you might want to implement a plugin where you pass only the
operation name (not the full document) and have the server populate the
document by looking up the operation name.

:::tip

This is purely for demonstration of the plugin API, you should not use this
plugin! Instead, consider the `@grafserv/persisted` module (which uses the same
hook).

:::

```ts
import { SafeError } from "grafast";

const documents = Object.assign(Object.create(null), {
  QueryName: `query QueryName { __typename }`,
  WhoAmI: `query WhoAmI { currentUser { name } }`,
  CreatePost: `mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) { post { id title } } }`,
});

export const QueryByNamePlugin: GraphileConfig.Plugin = {
  name: "QueryByNamePlugin",
  description: "Only specify the query name and the query will be populated",
  version,

  grafserv: {
    hooks: {
      processGraphQLRequestBody(info, event) {
        const { body } = event;
        const document = documents[body.id];
        if (!document) {
          throw new SafeError(
            `QueryByNamePlugin couldn't find query '${body.id}'`,
            { statusCode: 400 },
          );
        } else {
          body.query = document;
        }
      },
    },
  },
};
```

<!-- TODO: port!

### First-party open-source plugins

We have some first-party open source plugins that can enhance your PostGraphile
experience, or act as a template for writing your own plugins:

- `@graphile/operation-hooks` - enables you to add callbacks to certain
  operations, useful for validation, pre-flight checks, authorization, error
  handling, notifying users of semi-related information, etc.
- `@graphile/pg-pubsub` - provides realtime capabilities to schema plugins
  powered by PostgreSQL's LISTEN/NOTIFY.

### First-party premium plugins

There are also a couple of first-party plugins that may be purchased on the
[Graphile Store](https://store.graphile.com):

- ~~`@graphile/supporter`~~ - all features now OSS via `@graphile/pg-pubsub`
  plugin
- `@graphile/pro` [PRO] - includes protections that can be mounted in front of
  PostGraphile to protect it from malicious actors

To use these premium plugins you will need a `GRAPHILE_LICENSE` environmental
variable to be present, as in these examples:

```bash
# GNU/Linux and macOS bash:
export GRAPHILE_LICENSE="license_key_from_graphile_store"
postgraphile -c postgres://...

# Heroku
heroku config:set GRAPHILE_LICENSE="license_key_from_graphile_store" -a my_heroku_app

# Windows Console
set GRAPHILE_LICENSE="license_key_from_graphile_store" & postgraphile -c postgres://...

# Windows PowerShell
$env:GRAPHILE_LICENSE="license_key_from_graphile_store"; postgraphile -c postgres://...
```

**IMPORTANT**: these plugins do not "phone home" so you'll need to update your
license at least once every 9 months. You can check the expiry date of your
current license
[in the Graphile Store validator](https://store.graphile.com/validate) and log
in to generate a new license code.

For more information, see the FAQ at the bottom of the [Go Pro!](/pricing/)
page.

### Installing

You can install plugins with `yarn add` or `npm install`, e.g.

```bash
yarn add @graphile/operation-hooks
```

### Enabling via CLI flag

PostGraphile plugins can be specified with the `--plugins` CLI flag; however
this flag **must be the first flag passed** to PostGraphile as plugins can
register additional CLI flags. Multiple plugins can be specified with comma
separation:

```
postgraphile --plugins \
  @graphile/operation-hooks,@graphile/pg-pubsub,@graphile/pro \
  -c postgres:///my_db
```

### Enabling via `.postgraphilerc.js`

If you're using the CLI version, plugins can also be enabled via
`.postgraphilerc.js` file; for example:

```js
module.exports = {
  options: {
    plugins: [
      "@graphile/operation-hooks",
      "@graphile/pg-pubsub",
      "@graphile/pro",
    ],
    connection: "postgres:///my_db",
    schema: ["app_public"],
    // ...
  },
};
```

### Enabling via middleware options

This will likely get easier in future, but for now enabling via the middleware
is a slightly more involved process:

To include the dependencies using CommonJS (Node 8):

```js
const { postgraphile, makePluginHook } = require("postgraphile");
const { default: OperationHooks } = require("@graphile/operation-hooks");
const { default: PgPubsub } = require("@graphile/pg-pubsub");
const { default: GraphilePro } = require("@graphile/pro");
```

If you're using ES2015 Modules (ESM) then this syntax may be more to your taste:

```js
import { postgraphile, makePluginHook } from "postgraphile";
import OperationHooks from "@graphile/operation-hooks";
import PgPubsub from "@graphile/pg-pubsub";
import GraphilePro from "@graphile/pro";
```

To enable the plugins, use `makePluginHook` to create a `pluginHook` function to
pass via the PostGraphile options:

```js
// Only include as many plugins as you need. An empty array is also valid.
const pluginHook = makePluginHook([OperationHooks, PgPubsub, GraphilePro]);

const postGraphileMiddleware = postgraphile(databaseUrl, "app_public", {
  pluginHook,
  // ...
});

app.use(postGraphileMiddleware);
```

### Writing your own plugins

**IMPORTANT**: here be dragons. This interface is experimental, and
documentation on it is far from complete. To use this interface you are expected
to have deep knowledge of the PostGraphile internals, since that is what you
will be augmenting/overriding. Note that **many things you might think you need
a server plugin for are better served with standard HTTP middleware**, e.g. by
using Express/Koa/Fastify/etc middleware you can implement CORS, sessions,
custom authentication flows, rate limiting, logging, routing,
liveness/readiness/health endpoints, statistics collection and much more - you
probably do not need to write PostGraphile server plugins for this kind of
functionality.

The hook methods available can be viewed
[in pluginHook.ts](https://github.com/graphile/postgraphile/blob/v4/src/postgraphile/pluginHook.ts).
Note that these may change in **semver minor** releases of PostGraphile as this
is not an officially stable API yet.

Each hook method is passed two parameters:

- subject: the thing being hooked
- context: an object containing some relevant helpers

The hooks are expected to return either the thing being hooked (subject), or a
derivative of it. Multiple plugins may register for the same hooks, in these
cases the output of one hook function will be fed as input to the next. Hooks
are _synchronous_.

Your plugin will export a single object which defines the hook methods; e.g.:

```js
const MyPlugin = {
  ["cli:greeting"](messages, { chalk }) {
    return [...messages, `Hello ${chalk.blue("world")}!`];
  },
};

module.exports = MyPlugin;
// or, for ES6 modules:
// export default MyPlugin;
```

An example of an open source PostGraphile server plugin is
[@graphile/operation-hooks](https://github.com/graphile/operation-hooks/blob/master/src/index.ts):

- uses `cli:flags:add:schema` to add `--operation-messages` and
  `--operation-messages-preflight` CLI options
- uses `cli:library:options` to convert these CLI options to library options
- uses `postgraphile:options` to a) convert the library options into
  graphileBuildOptions (Graphile Engine plugin options), and b) load the
  OperationHooksPlugin

Other examples you may wish to check out include
[@graphile/persisted-operations](https://github.com/graphile/persisted-operations)
and
[postgraphile-log-consola](https://github.com/graphile/postgraphile-log-consola).

### Inline tweaks via pluginHook

If you are using postgraphile as a library (i.e. middleware) and you want to
make a quick tweak to something using the server plugin hooks, you can do so in
your main server.js file:

```js
/**
 * This plugin override changes the branding piece of graphiql.
 * /
const graphiqlBrandingTweak = {
  ["postgraphile:graphiql:html"](html) {
    console.log("Applying GraphiQL Branding Tweak...");
    return html.replace(
      "</head>",
      '<style type="text/css">div.topBar > div.title > div { visibility: hidden; display: none !important; } div.topBar > div.title::after { content: "GraphiQL for MyCompany" }</style></head>',
    );
  },
};
const pluginHook = makePluginHook([graphiqlBrandingTweak]);

const postGraphileMiddleware = postgraphile(databaseUrl, "app_public", {
  pluginHook,
  // ...
});
```

### Examples

#### Origin specific CORS

You can enable _generous_ CORS by
[adding the `-o,--cors` flag to the CLI](./usage-cli/#cli-options) or by
[adding a `enableCors: true` option when using PostGraphile as a library](./usage-library/#api-postgraphilepgservice-schemaname-options).

However, by being _generous_, you allow **any** origin to communicate with you
PostGraphile instance. If you want to allow just one specific origin, and using
a `cors` middleware before PostGraphile (which is by far the preferred route!)
is not an option, then you can make a server plugin such as this one:

```js
/**
 * This server plugin injects CORS headers to allow requests only from a specific origin.
 * /

function makeAllowedOriginTweak(origin) {
  return {
    ["postgraphile:http:handler"](req, { res }) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Methods", "HEAD, GET, POST");
      res.setHeader(
        "Access-Control-Allow-Headers",
        [
          "Origin",
          "X-Requested-With",
          // Used by `express-graphql` to determine whether to expose the GraphiQL
          // interface (`text/html`) or not.
          "Accept",
          // Used by PostGraphile for auth purposes.
          "Authorization",
          // Used by GraphQL Playground and other Apollo-enabled servers
          "X-Apollo-Tracing",
          // The `Content-*` headers are used when making requests with a body,
          // like in a POST request.
          "Content-Type",
          "Content-Length",
          // For our 'Explain' feature
          "X-PostGraphile-Explain",
        ].join(", "),
      );
      res.setHeader(
        "Access-Control-Expose-Headers",
        ["X-GraphQL-Event-Stream"].join(", "),
      );
      return req;
    },
  };
}
```

Using the plugin would look like this:

```js
const pluginHook = makePluginHook([
  makeAllowedOriginTweak("https://graphql.rocks"),
]);

const postGraphileMiddleware = postgraphile(databaseUrl, "app_public", {
  pluginHook,
  // ...
});
```


-->

If you need help writing your own PostGraphile server plugins,
[ask in #help-and-support in our Discord chat](http://discord.gg/graphile).
