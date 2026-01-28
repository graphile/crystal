---
sidebar_position: 3
---

# Usage

Grafserv supports many different servers, and because each server is different,
each has their own entrypoint, e.g. `grafserv/node` for the Node.js HTTP server
or `grafserv/express/v4` for Express v4.

## Creating `serv` instance

Generally you import the `grafserv` function from the relevant entrypoint for
your server of choice and then create an instance, called `serv`, by passing
the preset and the GraphQL schema to use:

```ts
import { grafserv } from "grafserv/path/to/adaptor";
import preset from "./graphile.config";
import schema from "./schema";

// highlight-next-line
const serv = grafserv({ preset, schema });
```

The `serv` instance will have a number of methods on it, including
methods specific to integrating it with your framework of choice. The methods
available will differ for each server, but common methods are [documented
below](#common-methods).

### Preset

The preset is your configuration object, see [Configuration](./config.md). To
use the defaults, it can be a simple empty object (`{}`).

### Schema

The schema can be any valid GraphQL.js schema, but for maximal benefit it should
be a Gra*fast*-capable schema. For details on creating a Gra*fast* schema, see
[Gra*fast*](/grafast).

If a schema is not available then passing either `null` or a promise is
acceptable.

## Integrating with your server

Please see the documentation for your specific server adaptor, but for servers
that operate on a middleware basis this is typically `serv.addTo(app)` (which
allows registering multiple route handlers); e.g. for Express:

```ts
import express from "express";
import { createServer } from "node:http";

const app = express();
const server = createServer(app);

// highlight-next-line
await serv.addTo(app, server);

server.listen(preset.grafserv?.port ?? 5678);
```

Other servers such as Lambda and
Next.js may use
different APIs, such as `serv.createGraphQLHandler()`.

:::tip[Use middleware to implement common concerns]

There is little value in Grafserv reimplementing every non-GraphQL concern
your server may have, so instead it leans on the ecosystem of your chosen server
to handle things like compression, rate limits, sessions, cookies, etc. For
example, to compress your responses you'd need to use a module like
[`compression`](https://expressjs.com/en/resources/middleware/compression.html)
for Express, [`koa-compress`](https://www.npmjs.com/package/koa-compress) for
Koa, or [`@fastify/compress`](https://www.npmjs.com/package/@fastify/compress)
for Fastify.

:::

## Common methods

### serv.release()

Releases any resources created by the instance; no further requests should be
handled (though currently active requests will be allowed to complete).

For long-lived transports (such as subscriptions), close the transport when
releasing the server so new events are not delivered.

### serv.onRelease(cb)

Adds `cb` to the list of callbacks to be called when the server is released;
useful for releasing resources you created only for the server. Callbacks will
be called in reverse order that they were added.

### serv.setSchema(newSchema)

Replaces the schema to use for future requests (currently active requests are
unaffected) - this is primarily used for "watch" mode.

### serv.setPreset(newPreset)

Replaces the config to use for future requests (currently active requests are
unaffected) - this is primarily used for "watch" mode. Note that certain
configuration changes might not be reflected by certain servers until a restart.

### serv.getSchema()

Returns either the GraphQL schema that is currently in use, or a promise to the
same.

### serv.getPreset()

Returns the resolved `graphile-config` preset that is currently in use.

<!--

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

[connect]: https://www.npmjs.com/connect
[express]: https://www.npmjs.com/express
[graphql/express-graphql#82]: https://github.com/graphql/express-graphql/pull/82
[`pg`]: https://www.npmjs.com/pg
[`pg.pool`]: https://node-postgres.com/api/pool
[morgan]: https://www.npmjs.com/morgan
[grafserv]: https://grafast.org/grafserv/

-->
