---
layout: page
path: /postgraphile/usage-library/
title: PostGraphile as a Library
fullTitle: Using PostGraphile as a Library
---

import styles from "@site/src/css/common.module.css";

Library mode is the most popular way of running PostGraphile; it gives more
power than using the CLI (see [CLI usage](./usage-cli/)), but is much easier to
setup and more fully featured than [Schema-only Usage](./usage-schema/).

Details of
[the configuration options can be found below](#api-postgraphilepgconfig-schemaname-options).

PostGraphile supports usage in library mode within various Node server
frameworks. There are two ways of using the PostGraphile library mode inside a
server framework: very concisely as middleware, or via the more verbose
individual route handlers introduced in PostGraphile v4.10.0. The below table
summarises the support of these modes by each of the frameworks we support, and
the following documentation sections detail how to use them.

| Framework                                        | &nbsp;&nbsp;&nbsp;&nbsp;[Middleware](#http-middleware)&nbsp;&nbsp; | &nbsp;&nbsp;[Route handlers](#route-handlers)&nbsp;&nbsp;&nbsp;&nbsp; | Example                                                                                                                                                                                                        |
| :----------------------------------------------- | :----------------------------------------------------------------: | :-------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Node HTTP](https://nodejs.org/api/http.html)    |                                Yes                                 |                                   -                                   | [simple](https://github.com/graphile/postgraphile/blob/v4/examples/servers/node/index.ts)                                                                                                                      |
| [Koa](http://koajs.com)                          |                             >=v4.10.0                              |                                  Yes                                  | [vanilla](https://github.com/graphile/postgraphile/blob/v4/examples/servers/koa/vanilla.ts) \| [flavourful](https://github.com/graphile/postgraphile/blob/v4/examples/servers/koa/rum-and-raisin.ts)           |
| [Express](https://www.npmjs.com/package/express) |                                Yes                                 |                                  Yes                                  | [vanilla](https://github.com/graphile/postgraphile/blob/v4/examples/servers/express/vanilla.ts) \| [flavourful](https://github.com/graphile/postgraphile/blob/v4/examples/servers/express/rum-and-raisin.ts)   |
| [Connect](http://npmjs.com/connect)              |                                Yes                                 |                                  Yes                                  | Similar to Express                                                                                                                                                                                             |
| [Fastify](https://www.fastify.io/) v2            |                             >=v4.10.0                              |                                  Yes                                  | Similar to Express                                                                                                                                                                                             |
| [Fastify](https://www.fastify.io/) v3            |                                 -                                  |                                  Yes                                  | [vanilla](https://github.com/graphile/postgraphile/blob/v4/examples/servers/fastify3/vanilla.ts) \| [flavourful](https://github.com/graphile/postgraphile/blob/v4/examples/servers/fastify3/rum-and-raisin.ts) |
| [Restify](http://restify.com/)                   |                                 -                                  |                                  Yes                                  | [vanilla](https://github.com/graphile/postgraphile/blob/v4/examples/servers/restify/vanilla.ts) \| [flavourful](https://github.com/graphile/postgraphile/blob/v4/examples/servers/restify/rum-and-raisin.ts)   |

### HTTP Middleware

To mount a PostGraphile instance on your own web server there is an export
`postgraphile` from the `postgraphile` package that can be used as HTTP
middleware for Node's HTTP server, Express, Connect, Koa and Fastify v2 (but not
Fastify v3). Usage is generally of the form `app.use(postgraphile(...))`.

Additional frameworks such as [Restify](http://restify.com/) and
[Fastify](https://www.fastify.io/) are also supported since PostGraphile v4.10.0
via the [route handlers](#route-handlers) method detailed below.

To use PostGraphile with `express`, for instance, a small example would be:

```js
const express = require("express");
const { postgraphile } = require("postgraphile");

const app = express();

app.use(
  postgraphile(
    process.env.DATABASE_URL || "postgres://user:pass@host:5432/dbname",
    "public",
    {
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
    },
  ),
);

app.listen(process.env.PORT || 3000);
```

Or to use it with the built-in `http` module:

```js
const http = require("http");
const { postgraphile } = require("postgraphile");

http
  .createServer(
    postgraphile(
      process.env.DATABASE_URL || "postgres://user:pass@host:5432/dbname",
      "public",
      {
        watchPg: true,
        graphiql: true,
        enhanceGraphiql: true,
      },
    ),
  )
  .listen(process.env.PORT || 3000);
```

### Route Handlers

_Introduced in PostGraphile v4.10.0._

If your server does not support the preferred middleware approach of mounting
the PostGraphile library, then you can mount PostGraphile's route handlers
individually. This looks slightly different depending on which server you're
using (see the table above for links to examples for each server), but broadly
it follows the following pattern (this example uses Fastify v3).

First we create the PostGraphile middleware:

```js
import { postgraphile } from "postgraphile";

const middleware = postgraphile(process.env.DATABASE_URL, "public", {
  /* ... options here ... */
});
```

And your server:

```js
import Fastify from "fastify";

const app = Fastify({});
```

Next we need an adaptor to convert a generic PostGraphile route handler into a
handler that's suitable for your given server framework. We provide the
following out of the box:

- `PostGraphileResponseNode` - for Node, Express, Connect, Nest, Restify, and
  Fastify v2 (NOT v3)
- `PostGraphileResponseKoa` - for Koa
- `PostGraphileResponseFastify3` - for Fastify v3

You can also make your own by sub-classing `PostGraphileResponse`, for help with
this ping @Benjie [on Discord](https://discord.gg/YM5Q2SR).

Note that some frameworks expect you to indicate failure by rejecting a promise,
others expect you to pass an error object to the `next(err)` callback.
PostGraphile's handler rejects on error, so if your framework (e.g. Express)
requires `next(err)` you should add `.catch(next)` to the handler call.

```js
import { PostGraphileResponseFastify3 } from "postgraphile";

// Converts a PostGraphile handler to a Fastify v3 handler
const convertHandler = (handler) => (request, reply) =>
  handler(new PostGraphileResponseFastify3(request, reply));

/* Other frameworks:

// Converts a PostGraphile handler to an Express handler
const convertHandler = handler => (req, res, next) =>
  handler(new PostGraphileResponseNode(req, res, next)).catch(next);

// Converts a PostGraphile handler to a Koa handler
const convertHandler = handler => (ctx, next) =>
  handler(new PostGraphileResponseKoa(ctx, next));
*/
```

Then we use the properties present on the PostGraphile middleware to mount our
route handlers. The properties available include:

- `options` - the PostGraphile options your server is using
- route strings:
  - `graphqlRoute` (e.g. `/graphql`) - the URL path the GraphQL endpoint should
    be mounted at
  - `graphiqlRoute` (e.g. `/graphiql`) - the URL path the GraphiQL (GraphQL IDE)
    endpoint should be mounted at
  - `eventStreamRoute` (e.g. `/graphql/stream`) - the URL path the EventStream
    for PostGraphile watch mode should be mounted at (relates to the
    X-GraphQL-Event-Stream header)
- request handlers
  - `graphqlRouteHandler` - handles GraphQL POST and OPTIONS requests
  - `graphiqlRouteHandler` - handles GET requests to retrieve the GraphiQL
    interface
  - `faviconRouteHandler` - serves the PostGraphile favicon
  - `eventStreamRouteHandler` - serves the PostGraphile watch-mode event stream

For Fastify, this might look something like:

```js
// OPTIONS requests, for CORS/etc
app.options(
  middleware.graphqlRoute,
  convertHandler(middleware.graphqlRouteHandler),
);

// This is the main middleware
app.post(
  middleware.graphqlRoute,
  convertHandler(middleware.graphqlRouteHandler),
);

// GraphiQL, if you need it
if (middleware.options.graphiql) {
  if (middleware.graphiqlRouteHandler) {
    app.head(
      middleware.graphiqlRoute,
      convertHandler(middleware.graphiqlRouteHandler),
    );
    app.get(
      middleware.graphiqlRoute,
      convertHandler(middleware.graphiqlRouteHandler),
    );
  }
  // Remove this if you don't want the PostGraphile logo as your favicon!
  if (middleware.faviconRouteHandler) {
    app.get("/favicon.ico", convertHandler(middleware.faviconRouteHandler));
  }
}

// If you need watch mode, this is the route served by the
// X-GraphQL-Event-Stream header; see:
// https://github.com/graphql/graphql-over-http/issues/48
if (middleware.options.watchPg) {
  if (middleware.eventStreamRouteHandler) {
    app.options(
      middleware.eventStreamRoute,
      convertHandler(middleware.eventStreamRouteHandler),
    );
    app.get(
      middleware.eventStreamRoute,
      convertHandler(middleware.eventStreamRouteHandler),
    );
  }
}
```

For Nest, this might look something like:

```js
import { Controller, Get, Post, Req, Next, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { PostGraphileResponseNode } from "postgraphile";
import { middleware } from "./postgraphile.middleware";

@Controller("/")
export class PostGraphileController {
  @Get(middleware.graphiqlRoute)
  graphiql(@Req() request: Request, @Res() response: Response, @Next() next) {
    middleware.graphiqlRouteHandler(
      new PostGraphileResponseNode(request, response, next),
    );
  }

  @Post(middleware.graphqlRoute)
  graphql(@Req() request: Request, @Res() response: Response, @Next() next) {
    middleware.graphqlRouteHandler(
      new PostGraphileResponseNode(request, response, next),
    );
  }
}
```

**IMPORTANT**: although it's tempting to add your handlers with explicitly
written paths, e.g. `app.post('/graphql', ...)`, it's better to use the relevant
middleware properties such as `middleware.graphqlRoute` to ensure that
PostGraphile is expecting the GraphQL endpoint to be in the same place that
you're expecting.

**IMPORTANT**: it's advised that you also look through the full-flavoured
"rum-and-raisin" example server for your framework; depending on what other
middleware/plugins you're using (e.g. compression) you may need to add some tiny
workarounds for common issues (most notably relating to the Event Stream from
watch mode).

### Recommended options

As PostGraphile evolves, we add more features; however we can't always enable
these features by default as they may be breaking changes. There are also
options that may have security repurcussions. For this reason, many features are
behind flags. We understand this page is very long, so we've included some
default option sets you might like to use:

We recommend you install the `@graphile-contrib/pg-simplify-inflector` plugin.

#### For Development

```js
const postgraphileOptions = {
  subscriptions: true,
  watchPg: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  showErrorStack: "json",
  extendedErrors: ["hint", "detail", "errcode"],
  appendPlugins: [require("@graphile-contrib/pg-simplify-inflector")],
  exportGqlSchemaPath: "schema.graphql",
  graphiql: true,
  enhanceGraphiql: true,
  allowExplain(req) {
    // TODO: customise condition!
    return true;
  },
  enableQueryBatching: true,
  legacyRelations: "omit",
  pgSettings(req) {
    /* TODO */
  },
};
```

#### For Production

```js
const postgraphileOptions = {
  subscriptions: true,
  retryOnInitFail: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  extendedErrors: ["errcode"],
  appendPlugins: [require("@graphile-contrib/pg-simplify-inflector")],
  graphiql: false,
  enableQueryBatching: true,
  disableQueryLog: true, // our default logging has performance issues, but do make sure you have a logging system in place!
  legacyRelations: "omit",
  pgSettings(req) {
    /* TODO */
  },
};
```

### API: `postgraphile(pgConfig, schemaName, options)`

The `postgraphile` middleware factory function takes three arguments, all of
which are optional. The below options are valid
for <tt>postgraphile@4.12.3</tt>.

- **`pgConfig`**: Specifies the PostgreSQL database you wish to connect to. You
  may pass a PostgreSQL connection string, a configuration object to pass to the
  [`pg.Pool`][] constructor, or a [`pg.Pool`][] instance. Note: `pg.Pool` has a
  default pool size of 10, to increase this you use the configuration
  object/pg.Pool instance approach and pass a different value as `max`.
- **`schemaName`**: A string, or array of strings, which specifies the
  PostgreSQL schema(s) you to expose via PostGraphile; defaults to 'public'
- **`options`**: An object containing other miscellaneous options. Options
  include:
  - `watchPg`: When true, PostGraphile will update the GraphQL API whenever your
    database schema changes. This feature requires some changes to your database
    in the form of the
    [`postgraphile_watch`](https://github.com/graphile/graphile-engine/blob/master/packages/graphile-build-pg/res/watch-fixtures.sql)
    schema; PostGraphile will try to add this itself but requires DB superuser
    privileges to do so. If PostGraphile can't install it, you can do so
    manually. PostGraphile will not drop the schema when it exits, to remove it
    you can execute: `DROP SCHEMA postgraphile_watch CASCADE;`
  - `retryOnInitFail`: When false (default), PostGraphile will exit if it fails
    to build the initial schema (for example if it cannot connect to the
    database, or if there are fatal naming conflicts in the schema). When true,
    PostGraphile will keep trying to rebuild the schema indefinitely, using an
    exponential backoff between attempts, starting at 100ms and increasing up to
    30s delay between retries. When a function, the function will be called
    passing the error and the number of attempts, and it should return true to
    retry, false to permanently abort trying.
  - `ownerConnectionString`: Connection string to use to connect to the database
    as a privileged user (e.g. for setting up watch fixtures, logical decoding,
    etc).
  - `subscriptions`: Enable GraphQL websocket transport support for
    subscriptions (you still need a subscriptions plugin currently)
  - `live`: [EXPERIMENTAL] Enables live-query support via GraphQL subscriptions
    (sends updated payload any time nested collections/records change)
  - `websockets`: Choose which websocket transport libraries to use. Use commas
    to define multiple. Defaults to `['v0', 'v1']` if `subscriptions` or `live`
    are true, `[]` otherwise
  - `websocketOperations`: Toggle which GraphQL websocket transport operations
    are supported: 'subscriptions' or 'all'. Defaults to `subscriptions`
  - `websocketMiddlewares`: [EXPERIMENTAL] If you're using websockets
    (subscriptions || live) then you may want to authenticate your users using
    sessions or similar. You can pass some simple middlewares here that will be
    executed against the websocket connection in order to perform
    authentication. We current only support Express (not Koa, Fastify, Restify,
    etc) middlewares here.
  - `pgDefaultRole`: The default Postgres role to use. If no role was provided
    in a provided JWT token, this role will be used.
  - `dynamicJson`: By default, JSON and JSONB fields are presented as strings
    (JSON encoded) from the GraphQL schema. Setting this to `true` (recommended)
    enables raw JSON input and output, saving the need to parse / stringify JSON
    manually.
  - `setofFunctionsContainNulls`: If none of your `RETURNS SETOF compound_type`
    functions mix NULLs with the results then you may set this false to reduce
    the nullables in the GraphQL schema.
  - `classicIds`: Enables classic ids for Relay support. Instead of using the
    field name `nodeId` for globally unique ids, PostGraphile will instead use
    the field name `id` for its globally unique ids. This means that table `id`
    columns will also get renamed to `rowId`.
  - `disableDefaultMutations`: Setting this to `true` will prevent the creation
    of the default mutation types & fields. Database mutation will only be
    possible through Postgres functions.
  - `ignoreRBAC`: Set false (recommended) to exclude fields, queries and
    mutations that are not available to any possible user (determined from the
    user in connection string and any role they can become); set this option
    true to skip these checks and create GraphQL fields and types for
    everything. The default is `true`, in v5 the default will change to `false`.
  - `ignoreIndexes`: Set false (recommended) to exclude filters, orderBy, and
    relations that would be expensive to access due to missing indexes. Changing
    this from true to false is a breaking change, but false to true is not, so
    we recommend you start with it set to `false`. The default is `true`, in v5
    the default may change to `false`.
  - `includeExtensionResources`: By default, tables and functions that come from
    extensions are excluded from the generated GraphQL schema as general
    applications don't need them to be exposed to the end user. You can use this
    flag to include them in the generated schema (not recommended).
  - `showErrorStack`: Enables adding a `stack` field to the error response. Can
    be either the boolean `true` (which results in a single stack string) or the
    string `json` (which causes the stack to become an array with elements for
    each line of the stack). Recommended in development, not recommended in
    production.
  - `extendedErrors`: Extends the error response with additional details from
    the Postgres error. Can be any combination of
    `['hint', 'detail', 'errcode']`. Default is `[]`.
  - `handleErrors`: Enables ability to modify errors before sending them down to
    the client. Optionally can send down custom responses. If you use this then
    `showErrorStack` and `extendedError` may have no effect.
  - `appendPlugins`: An array of
    [Graphile Engine](https://graphile.org/graphile-build/plugins/) schema
    plugins to load after the default plugins.
  - `prependPlugins`: An array of
    [Graphile Engine](https://graphile.org/graphile-build/plugins/) schema
    plugins to load before the default plugins (you probably don't want this).
  - `replaceAllPlugins`: The full array of
    [Graphile Engine](https://graphile.org/graphile-build/plugins/) schema
    plugins to use for schema generation (you almost definitely don't want
    this!).
  - `skipPlugins`: An array of
    [Graphile Engine](https://graphile.org/graphile-build/plugins/) schema
    plugins to skip.
  - `readCache`: A file path string or an object. Reads cached values to improve
    startup time (you may want to do this in production).
  - `writeCache`: A file path string. Writes computed values to local cache file
    so startup can be faster (do this during the build phase).
  - `exportJsonSchemaPath`: Enables saving the detected schema, in JSON format,
    to the given location. The directories must exist already, if the file
    exists it will be overwritten.
  - `exportGqlSchemaPath`: Enables saving the detected schema, in GraphQL schema
    format, to the given location. The directories must exist already, if the
    file exists it will be overwritten.
  - `sortExport`: If true, lexicographically (alphabetically) sort exported
    schema for more stable diffing.
  - `graphqlRoute`: The endpoint the GraphQL executer will listen on. Defaults
    to `/graphql`.
  - `eventStreamRoute`: The endpoint the watch-mode EventStream will be mounted
    on (only appropriate when watchPg is specified). Defaults to
    `${graphqlRoute}/stream`.
  - `externalGraphqlRoute`: The URL to the GraphQL endpoint for embedding into
    the GraphiQL client. We attempt to infer this (for many servers it is the
    same as `graphqlRoute`), but you may need to specify it manually if you
    mount PostGraphile behind a URL-rewriting proxy, or mount PostGraphile on a
    subpath in certain Node.js servers.
  - `externalEventStreamRoute`: As with `externalGraphqlRoute`, but for
    `eventStreamRoute` rather than `graphqlRoute`. This is also used for the
    `X-GraphQL-Event-Stream` header.
  - `graphiqlRoute`: The endpoint the GraphiQL query interface will listen on
    (**NOTE:** GraphiQL will not be enabled unless the `graphiql` option is set
    to `true`). Defaults to `/graphiql`.
  - `externalUrlBase`: DEPRECATED - use `externalGraphqlRoute` and
    `externalEventStreamRoute` instead. If you are using watch mode, or have
    enabled GraphiQL, and you either mount PostGraphile under a path, or use
    PostGraphile behind some kind of proxy that puts PostGraphile under a
    subpath (or both!) then you must specify this setting so that PostGraphile
    can figure out it's external URL. (e.g. if you do
    `app.use('/path/to', postgraphile(...))`), which is not officially
    supported, then you should pass `externalUrlBase: '/path/to'`.) This setting
    should never end in a slash (`/`). To specify that the external URL is the
    expected one, either omit this setting or set it to the empty string `''`.
  - `graphiql`: Set this to `true` to enable the GraphiQL interface.
  - `graphiqlCredentials`: Set this to change the way GraphiQL handles
    credentials. By default this is set to `same-origin`.
  - `enhanceGraphiql`: Set this to `true` to add some enhancements to GraphiQL;
    intended for development usage only (automatically enables with
    `subscriptions` and `live`).
  - `enableCors`: Enables some generous CORS settings for the GraphQL endpoint.
    There are some costs associated when enabling this, if at all possible try
    to put your API behind a reverse proxy.
  - `bodySizeLimit`: Set the maximum size of HTTP request bodies that can be
    parsed (default 100kB). The size can be given as a human-readable string,
    such as '200kB' or '5MB' (case insensitive).
  - `enableQueryBatching`: [Experimental] Enable the middleware to process
    multiple GraphQL queries in one request.
  - `jwtSecret`: The secret for your JSON web tokens. This will be used to
    verify tokens in the `Authorization` header, and signing JWT tokens you
    return in procedures.
  - `jwtPublicKey`: The public key to verify the JWT when signed with RS265 or
    ES256 algorithms.
  - `jwtVerifyOptions`: Options with which to perform JWT verification - see
    https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    If 'audience' property is unspecified, it will default to ['postgraphile'];
    to prevent audience verification set it explicitly to null.
  - `jwtSignOptions`: Options with which to perform JWT signing - see
    https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
  - `jwtRole`: An array of (strings) path components that make up the path in
    the jwt from which to extract the postgres role. By default, the role is
    extracted from `token.role`, so the default value is `['role']`. e.g.
    `{ iat: 123456789, creds: { local: { role: "my_role" } } }` the path would
    be `token.creds.local.role` i.e. `['creds', 'local', 'role']`
  - `jwtPgTypeIdentifier`: The Postgres type identifier for the compound type
    which will be signed as a JWT token if ever found as the return type of a
    procedure. Can be of the form: `my_schema.my_type`. You may use quotes as
    needed: `"my-special-schema".my_type`.
  - `jwtAudiences`: [DEPRECATED] The audience to use when verifing the JWT
    token. Deprecated, use `jwtVerifyOptions.audience` instead.
  - `legacyRelations`: Some one-to-one relations were previously detected as
    one-to-many - should we export 'only' the old relation shapes, both new and
    old but mark the old ones as 'deprecated' (default), or 'omit' (recommended)
    the old relation shapes entirely.
  - `legacyJsonUuid`: ONLY use this option if you require the v3 typenames
    'Json' and 'Uuid' over 'JSON' and 'UUID'.
  - `disableQueryLog`: Turns off GraphQL query logging. By default PostGraphile
    will log every GraphQL query it processes along with some other information.
    Set this to `true` (recommended in production) to disable that feature.
  - `pgSettings`: A plain object specifying custom config values to set in the
    PostgreSQL transaction (accessed via `current_setting('my.custom.setting')`)
    **or** an (optionally asynchronous) function which will return the same (or
    a Promise to the same) based on the incoming web request (e.g. to extract
    session data).
  - `allowExplain`: [Experimental] Determines if the 'Explain' feature in
    GraphiQL can be used to show the user the SQL statements that were executed.
    Set to a boolean to enable all users to use this, or to a function that
    filters each request to determine if the request may use Explain. DO NOT USE
    IN PRODUCTION unless you're comfortable with the security repurcussions of
    doing so.
  - `additionalGraphQLContextFromRequest`: Some Graphile Engine schema plugins
    may need additional information available on the `context` argument to the
    resolver - you can use this function to provide such information based on
    the incoming request - you can even use this to change the response
    [experimental], e.g. setting cookies.
  - `pluginHook`: [experimental] Plugin hook function, enables functionality
    within PostGraphile to be expanded with plugins. Generate with
    `makePluginHook(plugins)` passing a list of plugin objects.
  - `simpleCollections`: Should we use relay pagination, or simple collections?
    "omit" (default) - relay connections only, "only" (not recommended) - simple
    collections only (no Relay connections), "both" - both.
  - `queryCacheMaxSize`: Max query cache size in bytes (extremely approximate,
    not accurate at all). Default `50000000` (~50MB). Set to 0 to disable.

The following options are not part of PostGraphile core, but are available from
the `@graphile/pg-pubsub` [subscriptions plugin](./subscriptions/) (formerly the
paid "supporter" plugin, but now fully free and open source - please consider
[sponsoring us](https://graphile.org/sponsor/)!):

- `simpleSubscriptions`: set this to `true` to add simple subscription support
- `subscriptionAuthorizationFunction [fn]` set this to the name (excluding
  arguments/parentheses) of a PG function to call to check user is allowed to
  subscribe

The following options are not part of PostGraphile core, but are available from
the Pro plugin - see [Go Pro!](/pricing/) for more information.

- **`options`**:
  - `readOnlyConnection` <span className={styles.proTag}><span className={styles.firstLetter}>P</span>ro</span>&nbsp;<span className={styles.sponTag}><span className={styles.firstLetter}>S</span>pon</span> ⚡️[experimental] set this to a PostgreSQL
    connection string to use for read-only queries (i.e. not mutations)
  - `defaultPaginationCap` <span className={styles.proTag}><span className={styles.firstLetter}>P</span>ro</span>&nbsp;<span className={styles.sponTag}><span className={styles.firstLetter}>S</span>pon</span> ⚡️[experimental] integer, ensure all
    connections have first/last specified and are no large than this value
    (default: 50), set to -1 to disable; override via smart comment
    `@paginationCap 50`
  - `graphqlDepthLimit`<span className={styles.proTag}><span className={styles.firstLetter}>P</span>ro</span>&nbsp;<span className={styles.sponTag}><span className={styles.firstLetter}>S</span>pon</span> ⚡️[experimental] integer, validate GraphQL
    queries are no deeper than the specified int (default: 16), set to -1 to
    disable
  - `graphqlCostLimit` <span className={styles.proTag}><span className={styles.firstLetter}>P</span>ro</span>&nbsp;<span className={styles.sponTag}><span className={styles.firstLetter}>S</span>pon</span> ⚡️[experimental] integer, only allows queries with
    a computed cost below the specified int (default: 1000), set to -1 to
    disable
  - `exposeGraphQLCost` <span className={styles.proTag}><span className={styles.firstLetter}>P</span>ro</span>&nbsp;<span className={styles.sponTag}><span className={styles.firstLetter}>S</span>pon</span> boolean, if true (default) then the calculated
    query cost will be exposed on the resulting payload

### Exposing HTTP request data to PostgreSQL

#### `pgSettings` function

Using the `pgSettings` functionality mentioned above you can extend the data
made available through `current_setting(...)` within PostgreSQL. Instead of
passing an object you can pass an (optionally asynchronous) function which will
be executed for each request, and the results merged in with the other settings
PostGraphile automatically adds to the request.

For example:

```js
export postgraphile(process.env.DATABASE_URL, schemaName, {
  pgSettings: async req => ({
    'user.id': `${req.session.passport.user}`,
    'http.headers.x-something': `${req.headers['x-something']}`,
    'http.method': `${req.method}`,
    'http.url': `${req.url}`,
    //...
  }),
})
```

```sql
create function get_x_something() returns text as $$
  select current_setting('http.headers.x-something', true)::text;
$$ language sql stable;
```

Everything returned by `pgSettings` is applied to the current session with
`set_config($key, $value, true)`; note that `set_config` only supports string
values so it is best to only feed `pgSettings` string values (we'll convert
other values using the `String` constructor function, which may not have the
effect you intend.

You can use `pgSettings` to define variables that your Postgres
functions/policies depend on, or to tweak internal Postgres settings. When
adding variables for your own usage, the keys **must** contain either one or two
period (`.`) characters, and the prefix (the bit before the first period) must
not be used by any Postgres extension. Variables without periods will be
interpreted as internal Postgres settings, such as `role`, and will be applied
by Postgres. All settings are automatically reset when the transaction
completes. Here's an example of switching the user into the Postgres 'visitor'
role, and applying the application setting `jwt.claims.user_id`:

```js
export postgraphile(process.env.DATABASE_URL, schemaName, {
  pgSettings: async req => ({
    'role': 'visitor',
    'jwt.claims.user_id': `${req.user.id}`,
    //...
  }),
})
```

```sql
CREATE FUNCTION get_current_user() RETURNS TEXT AS $$
  SELECT current_user;
$$ LANGUAGE SQL STABLE;
```

```graphql
{
  getCurrentUser # returns visitor
}
```

<!-- TODO: verify the above works. -->

<!-- TODO: move this to its own article? -->

### Making HTTP data available to resolvers

#### `additionalGraphQLContextFromRequest` function

`additionalGraphQLContextFromRequest` is an optionally asynchronous function
passed the `req` and `res` request and response objects from your HTTP library.
The result returned from the function is merged into the GraphQL `context`
object which is passed as the third argument to every GraphQL resolver.

If you're using Koa then you can get back to the Koa context using
`const ctx = req._koaCtx`.

Be careful to not clash with internal context keys such as `pgClient` and
`jwtClaims`. For the absolute best future compatibility, we recommend that you
prefix your context keys with your initials or similar.

Example:

```js
const postgraphileOptions = {
  // ... other options here ...

  async additionalGraphQLContextFromRequest(req, res) {
    // You can perform asynchronous actions here if you need to; for example
    // looking up the current user in the database.

    // Return here things that your resolvers need
    return {
      // Return the current user from Passport.js or similar
      user: req.user,

      // Add a helper to get a header
      getHeader(name) {
        return req.get(name);
      },

      // Give access to the database-owner PostgreSQL pool, for example to
      // perform privileged actions
      rootPgPool,
    };
  },
};
```

It's _not_ a good idea to return direct access to the `req` or `res` objects
from `additionalGraphQLContextFromRequest(req, res)` as it binds the context too
tightly to the request lifecycle, and that's not compatible with local usage of
the schema, or with usage over other transports such as websockets for realtime.
Instead, add helpers to get/set the data you need.

### Mounting PostGraphile middleware under a subpath

This isn't officially supported; however it should work in most cases. If you're
mounting under a subpath in express then `app.use("/path/to", postgraphile())`
should work automatically without requiring any options. If you're using an
external proxy then you must supply the base URL so that PostGraphile knows
where to tell the browser the assets are located. This is all so that
PostGraphile can reference different parts of itself correctly, such as the
location for the watch stream to put in the header, or the GraphQL endpoint for
GraphiQL to connect to.

A really complex use case of this would be this example:

```js
// Assuming you combine both Express subpath AND an external
// proxy which mounts your express app at `/myproxypath`, you
// should provide options like this:
app.use(
  "/path/to",
  postgraphile(db, schemas, {
    externalUrlBase: "/myproxypath/path/to",
    graphqlRoute: "/graphql",
    graphiql: true,
    graphiqlRoute: "/graphiql",
  }),
);
// Then you can load GraphiQL at `/myproxypath/path/to/graphiql`
// and it will know to connect to GraphQL at
// `/myproxypath/path/to/graphql`
```

### Composing PostGraphile middleware with other middleware

Some use cases might require to mount other middleware before PostGraphile, for
instance if requests to the GraphQL endpoint should be subject to an additional
authorization / authentication mechanism.

With express, such a composition can be done like the following:

```js
// Example middleware, does nothing
function authMiddleware(req, res, next) {
  //...
  next();
}
// Mount middleware on the GraphQL endpoint
app.use("/graphql", authMiddleware);
// Mount PostGraphile after this middleware
app.use(postgraphile(connectionString, schema, options));
```

This example uses Express, but a similar approach is possible with other Node.js
webservers.

### handleErrors

Optionally you may specify a `handleErrors` function as part of the PostGraphile
options. This function will be passed the list of errors that occurred during
the GraphQL operation (if any occurred) and must return this same list, or a
list that will be used to replace the errors.

In [GraphQL.js](https://github.com/graphql/graphql-js), all errors are wrapped
in
[a `GraphQLError` object](https://github.com/graphql/graphql-js/blob/6bb002d74d32067540c0dc8401c977520fa1ed20/src/error/GraphQLError.js).
You can get to the original error that was thrown from a resolver via the
`originalError` property on the GraphQLError, however some errors might be
GraphQL query validation or other error types that don't have an
`originalError`. Further some errors might be provided by PostGraphile itself
rather than GraphQL, so might not be GraphQLError objects.

The original error could be thrown from any number of places (especially if
you're using plugins) but if it is thrown from PostgreSQL, then it might be a
[pg DatabaseError error](https://github.com/brianc/node-postgres/blob/95b5daadaade40ea343c0d3ad09ab230fa2ade4c/packages/pg-protocol/src/messages.ts#L97-L117).

Errors are detailed in
[the GraphQL Spec](https://spec.graphql.org/June2018/#sec-Errors), so be sure
that the errors you return from `handleErrors` conform to these rules.

You can find
[an example of `handleErrors` in Graphile Starter](https://github.com/graphile/starter/blob/d90cdc7560b01a2bc2847a72307383a36786a780/%40app/server/src/utils/handleErrors.ts).

[connect]: https://www.npmjs.com/connect
[express]: https://www.npmjs.com/express
[graphql/express-graphql#82]: https://github.com/graphql/express-graphql/pull/82
[`pg`]: https://www.npmjs.com/pg
[`pg.pool`]: https://node-postgres.com/api/pool
[morgan]: https://www.npmjs.com/morgan
