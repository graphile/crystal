---
title: CLI Usage
---

import Pro from "@site/src/components/Pro";
import Spon from "@site/src/components/Spon";

# Command Line Interface

The easiest way to get up and running with PostGraphile is to use the Command
Line Interface.

Install PostGraphile globally via npm:

```bash
npm install -g postgraphile
```

This will make the `postgraphile` command available. You can then run:

```bash
postgraphile -c postgres:///mydb -s public -a -j
```

where `-c` is the connection string (defaults to `postgres:///`), `-s` is the
schema name (defaults to "public"), `-a` enables Relay support and `-j` enables
dynamic JSON.

**macOS users**: you should also use the `--port` option to bind to a different
port, the default port 5000 now conflicts with macOS Monterey's new AirPlay
service.

PostGraphile also reads options from a `.postgraphilerc.js` file from the
current working directory.

### Recommended options

As PostGraphile evolves, we add more features; however we can't always enable
these features by default as they may be breaking changes. There are also
options that may have security repercussions. For this reason, many features are
behind flags. We understand this page is very long, so we've included some
default option sets you might like to use:

We recommend you install the `@graphile-contrib/pg-simplify-inflector` plugin.

#### For Development

```bash
postgraphile \
  --subscriptions \
  --watch \
  --dynamic-json \
  --no-setof-functions-contain-nulls \
  --no-ignore-rbac \
  --show-error-stack=json \
  --extended-errors hint,detail,errcode \
  --append-plugins @graphile-contrib/pg-simplify-inflector \
  --export-schema-graphql schema.graphql \
  --graphiql "/" \
  --enhance-graphiql \
  --allow-explain \
  --enable-query-batching \
  --legacy-relations omit \
  --connection $DATABASE_URL \
  --schema app_public
```

#### For Production

```bash
postgraphile \
  --subscriptions \
  --retry-on-init-fail \
  --dynamic-json \
  --no-setof-functions-contain-nulls \
  --no-ignore-rbac \
  --extended-errors errcode \
  --append-plugins @graphile-contrib/pg-simplify-inflector \
  --disable-graphiql \
  --enable-query-batching \
  --disable-query-log \ # our default logging has performance issues, but do make sure you have a logging system in place!
  --legacy-relations omit \
  --connection $DATABASE_URL \
  --schema app_public
```

### CLI options

There are more CLI options available to customise the GraphQL server (these are
from <tt>postgraphile@<span></span>4.12.3</tt>):

- `-V`, `--version`  
  output the version number
- `--plugins <string>`  
  a list of PostGraphile server plugins (not Graphile Engine schema plugins) to
  load; if present, must be the _first_ option
- `-c`, `--connection <string>`  
  the PostgreSQL database name or connection string. If omitted, inferred from
  environmental variables (see
  https://www.postgresql.org/docs/current/static/libpq-envars.html). Examples:
  'db', 'postgres:///db', 'postgres://user:password@domain:port/db?ssl=true'
- `-C`, `--owner-connection <string>`  
  as `--connection`, but for a privileged user (e.g. for setting up watch
  fixtures, logical decoding, etc); defaults to the value from `--connection`
- `-s`, `--schema <string>`  
  a Postgres schema to be introspected. Use commas to define multiple schemas
- `-S`, `--subscriptions`  
  Enable GraphQL support for subscriptions (you still need a subscriptions
  plugin currently)
- `--websockets <string>`  
  Choose which websocket transport libraries to use. Use commas to define
  multiple. Defaults to 'v0,v1' if `--subscriptions` or `--live` were passed,
  '[]' otherwise
- `--websocket-operations <operations>`  
  Toggle which GraphQL websocket transport operations are supported:
  'subscriptions' or 'all'. Defaults to 'subscriptions'
- `-L`, `--live`  
  [EXPERIMENTAL] Enables live-query support via GraphQL subscriptions (sends
  updated payload any time nested collections/records change). Implies
  --subscriptions
- `-w`, `--watch`  
  automatically updates your GraphQL schema when your database schema changes
  (NOTE: requires DB superuser to install `postgraphile_watch` schema)
- `-n`, `--host <string>`  
  the hostname to be used. Defaults to `localhost`
- `-p`, `--port <number>`  
  the port to be used. Defaults to 5000
- `-m`, `--max-pool-size <number>`  
  the maximum number of clients to keep in the Postgres pool. defaults to 10
- `-r`, `--default-role <string>`  
  the default Postgres role to use when a request is made. supercedes the role
  used to connect to the database
- `--retry-on-init-fail`  
  if an error occurs building the initial schema, this flag will cause
  PostGraphile to keep trying to build the schema with exponential backoff
  rather than exiting
- `-j`, `--dynamic-json`  
  [RECOMMENDED] enable dynamic JSON in GraphQL inputs and outputs. PostGraphile
  uses stringified JSON by default
- `-N`, `--no-setof-functions-contain-nulls`  
  [RECOMMENDED] if none of your `RETURNS SETOF compound_type` functions mix
  NULLs with the results then you may enable this to reduce the nullables in the
  GraphQL schema
- `-a`, `--classic-ids`  
  use classic global id field name. required to support Relay 1
- `-M`, `--disable-default-mutations`  
  disable default mutations, mutation will only be possible through Postgres
  functions
- `--simple-collections <omit|both|only>`  
  "omit" (default) - relay connections only, "only" - simple collections only
  (no Relay connections), "both" - both
- `--no-ignore-rbac`  
  [RECOMMENDED] set this to exclude fields, queries and mutations that are not
  available to any possible user (determined from the user in connection string
  and any role they can become); this will be enabled by default in v5
- `--no-ignore-indexes`  
  [RECOMMENDED] set this to exclude filters, orderBy, and relations that would
  be expensive to access due to missing indexes
- `--include-extension-resources`  
  by default, tables and functions that come from extensions are excluded; use
  this flag to include them (not recommended)
- `--show-error-stack [json|string]`  
  show JavaScript error stacks in the GraphQL result errors (recommended in
  development)
- `--extended-errors <string>`  
  a comma separated list of extended Postgres error fields to display in the
  GraphQL result. Recommended in development: 'hint,detail,errcode'. Default:
  none
- `--append-plugins <string>`  
  a comma-separated list of plugins to append to the list of Graphile Engine
  schema plugins
- `--prepend-plugins <string>`  
  a comma-separated list of plugins to prepend to the list of Graphile Engine
  schema plugins
- `--skip-plugins <string>`  
  a comma-separated list of Graphile Engine schema plugins to skip
- `--read-cache <path>`  
  [experimental] reads cached values from local cache file to improve startup
  time (you may want to do this in production)
- `--write-cache <path>`  
  [experimental] writes computed values to local cache file so startup can be
  faster (do this during the build phase)
- `--export-schema-json <path>`  
  enables exporting the detected schema, in JSON format, to the given location.
  The directories must exist already, if the file exists it will be overwritten.
- `--export-schema-graphql <path>`  
  enables exporting the detected schema, in GraphQL schema format, to the given
  location. The directories must exist already, if the file exists it will be
  overwritten.
- `--sort-export`  
  lexicographically (alphabetically) sort exported schema for more stable
  diffing.
- `-X`, `--no-server`  
  [experimental] for when you just want to use --write-cache or
  --export-schema-\* and not actually run a server (e.g. CI)
- `-q`, `--graphql <path>`  
  the route to mount the GraphQL server on. defaults to `/graphql`
- `-i`, `--graphiql <path>`  
  the route to mount the GraphiQL interface on. defaults to `/graphiql`
- `--enhance-graphiql`  
  [DEVELOPMENT] opt in to additional GraphiQL functionality (this may change
  over time - only intended for use in development; automatically enables with
  `subscriptions` and `live`)
- `-b`, `--disable-graphiql`  
  disables the GraphiQL interface. overrides the GraphiQL route option
- `-o`, `--cors`  
  enable generous CORS settings; disabled by default, if possible use a proxy
  instead
- `-l`, `--body-size-limit <string>`  
  set the maximum size of the HTTP request body that can be parsed (default
  100kB). The size can be given as a human-readable string, such as '200kB' or
  '5MB' (case insensitive).
- `--timeout <number>`  
  set the timeout value in milliseconds for sockets
- `--cluster-workers <count>`  
  [experimental] spawn `<count>` workers to increase throughput
- `--enable-query-batching`  
  [experimental] enable the server to process multiple GraphQL queries in one
  request
- `--disable-query-log`  
  disable logging queries to console (recommended in production)
- `--allow-explain`  
  [EXPERIMENTAL] allows users to use the Explain button in GraphiQL to view the
  plan for the SQL that is executed (DO NOT USE IN PRODUCTION)
- `-e`, `--jwt-secret <string>`  
  the secret to be used when creating and verifying JWTs. if none is provided
  auth will be disabled
- `--jwt-verify-algorithms <string>`  
  a comma separated list of the names of the allowed jwt token algorithms
- `-A`, `--jwt-verify-audience <string>`  
  a comma separated list of JWT audiences that will be accepted; defaults to
  'postgraphile'. To disable audience verification, set to ''.
- `--jwt-verify-clock-tolerance <number>`  
  number of seconds to tolerate when checking the nbf and exp claims, to deal
  with small clock differences among different servers
- `--jwt-verify-id <string>`  
  the name of the allowed jwt token id
- `--jwt-verify-ignore-expiration`  
  if `true` do not validate the expiration of the token defaults to `false`
- `--jwt-verify-ignore-not-before`  
  if `true` do not validate the notBefore of the token defaults to `false`
- `--jwt-verify-issuer <string>`  
  a comma separated list of the names of the allowed jwt token issuer
- `--jwt-verify-subject <string>`  
  the name of the allowed jwt token subject
- `--jwt-role <string>`  
  a comma seperated list of strings that create a path in the jwt from which to
  extract the postgres role. if none is provided it will use the key `role` on
  the root of the jwt.
- `-t`, `--jwt-token-identifier <identifier>`  
  the Postgres identifier for a composite type that will be used to create JWT
  tokens
- `--token <identifier>`  
  [DEPRECATED] Use --jwt-token-identifier instead. This option will be removed
  in v5.
- `--secret <string>`  
  [DEPRECATED] Use --jwt-secret instead. This option will be removed in v5.
- `--jwt-audiences <string>`  
  [DEPRECATED] Use --jwt-verify-audience instead. This option will be removed in
  v5.
- `--legacy-functions-only`  
  [DEPRECATED] PostGraphile 4.1.0 introduced support for PostgreSQL functions
  than declare parameters with IN/OUT/INOUT or declare RETURNS TABLE(...);
  enable this flag to ignore these types of functions. This option will be
  removed in v5.
- `--legacy-relations <omit|deprecated|only>`  
  some one-to-one relations were previously detected as one-to-many - should we
  export 'only' the old relation shapes, both new and old but mark the old ones
  as 'deprecated', or 'omit' the old relation shapes entirely
- `--legacy-json-uuid`  
  ONLY use this option if you require the v3 typenames 'Json' and 'Uuid' over
  'JSON' and 'UUID'
- `-h`, `--help`  
  output usage information

The following options are not part of PostGraphile core, but are available from
the `@graphile/pg-pubsub` [subscriptions plugin](./subscriptions) (formerly the
paid "supporter" plugin, but now fully free and open source - please consider
[sponsoring us](https://graphile.org/sponsor/)!):

- `-S`, `--simple-subscriptions` add simple subscription support
- `--subscription-authorization-function [fn]` PG function to call to check user
  is allowed to subscribe.

The following features and not part of PostGraphile core, but are available from
the Pro plugin - see [Go Pro!](/pricing) for more information.

- `--read-only-connection <string>` <Pro /> <Spon /> ⚡️[experimental] a PostgreSQL
  connection string to use for read-only queries (i.e. not mutations)
- `--default-pagination-cap [int]` <Pro /> <Spon /> ⚡️[experimental] Ensures all
  connections have first/last specified and are no large than this value
  (default: 50), set to -1 to disable; override via smart comment
  `@paginationCap 50`
- `--graphql-depth-limit [int]` <Pro /> <Spon /> ⚡️[experimental] Validates GraphQL
  queries cannot be deeper than the specified int (default: 16), set to -1 to
  disable
- `--graphql-cost-limit [int]` <Pro /> <Spon /> ⚡️[experimental] Only allows queries with
  a computed cost below the specified int (default: 1000), set to -1 to disable

### RC file options

The CLI options can also be specified in a `.postgraphilerc.js` file in the
current working directory. Any command line comma separated options (eg.
`schema`) must be entered as Javascript arrays.

```javascript
module.exports = {
  options: {
    connection: "postgres://api_user:api_password@localhost/api_development",
    schema: ["myApp", "myAppPrivate"],
    jwtSecret: "myJwtSecret",
    defaultRole: "myapp_anonymous",
    jwtTokenIdentifier: "myApp.jwt_token",
    watch: true,
  },
};
```

Here is the list of keys and their default values, or types, supported in the
`options` object returned by `.postgraphilerc.js`.

```
  appendPlugins: <string>
  bodySizeLimit: <string>
  classicIds = false
  clusterWorkers: <integer>
  connection: <string>
  cors= false
  defaultRole: <string>
  disableDefaultMutations = false
  disableGraphiql = false
  disableQueryLog: true/false
  dynamicJson = false
  enableQueryBatching: true/false
  exportSchemaGraphql: <path string>
  exportSchemaJson: <path string>
  extendedErrors = []
  graphiql = '/graphiql'
  graphql = '/graphql'
  host = 'localhost'
  includeExtensionResources = false
  jwtAudiences: <string>
  jwtRole = ['role']
  jwtSecret: <string>
  jwtSignOptions: {}
  jwtTokenIdentifier
  jwtVerifyAlgorithms: <string>
  jwtVerifyAudience: <string>
  jwtVerifyClockTolerance: <number>
  jwtVerifyId: <string>
  jwtVerifyIgnoreExpiration: true/false
  jwtVerifyIgnoreNotBefore: true/false
  jwtVerifyIssuer: <string>
  jwtVerifySubject: <string>
  legacyJsonUuid: true/false
  maxPoolSize: <number>
  plugins: <string>
  port = 5000
  prependPlugins: <string>
  readCache: <path string>
  schema: <string>
  secret: <string>
  showErrorStack: true/false
  simpleCollections: [omit|both|only]
  skipPlugins: <string>
  timeout: <number>
  token: : <string>
  watch: true/false
  writeCache: <path string>
```

Please note that this interface is deprecated and will be removed in v5 (but its
replacement hasn't been built yet...). You're encouraged to use PostGraphile as
a library rather than using a `.postgraphilerc.js`.
