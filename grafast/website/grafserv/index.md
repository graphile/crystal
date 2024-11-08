---
sidebar_position: 1
---

# Grafserv Introduction

Grafserv - an incredibly fast GraphQL server for Node.js powered by
[Gra*fast*](/grafast).

## Usage

Grafserv supports many different servers, and because each server is different
each has their own entrypoint, e.g. `grafserv/node` for the Node.js HTTP server
or `grafserv/express/v4` for Express v4. Generally you import the `grafserv`
function from the relevant entrypoint for your server of choice and then create
an instance:

```js
const serv = grafserv({ schema, preset });
```

`grafserv` is passed the GraphQL schema to use (if it's available, otherwise
passing either null or a promise is also acceptable) and a `graphile-config`
preset - i.e. your configuration. The preset can be an empty object, but here's
a bigger (but not exhaustive) example:

```js
const preset = {
  grafserv: {
    port: 5678,
    host: "0.0.0.0",
    dangerouslyAllowAllCORSRequests: false,
    graphqlPath: "/graphql",
    eventStreamPath: "/graphql/stream",
    graphqlOverGET: true,
    graphiql: true,
    graphiqlPath: "/",
    websockets: true,
    maxRequestLength: 100000,
  },
};
```

Calling `grafserv` will return an instance; this instance will have a number of
helpers on it, including helpers specific to integrating it with your framework
of choice. For servers that operate on a middleware basis this is typically
`serv.addTo(app)` (which allows registering multiple route handlers), though
different servers may have different APIs, such as `serv.createGraphQLHandler()`
for Lambda and Next.js.

Note: There is little value in Grafserv reimplementing every non-GraphQL concern
your server may have, so instead it leans on the ecosystem of your chosen server
to handle things like compression, rate limits, sessions, cookies, etc. For
example, to compress your responses you'd need to use a module like
[`compression`](https://expressjs.com/en/resources/middleware/compression.html)
for Express, [`koa-compress`](https://www.npmjs.com/package/koa-compress) for
Koa, or [`@fastify/compress`](https://www.npmjs.com/package/@fastify/compress)
for Fastify.

### serv.release()

Releases any resources created by the instance; no further requests should be
handled (though currently active requests will be allowed to complete).

// TODO: consider terminating subscriptions or other long-lived things.

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
[grafserv]: https://grafast.org/grafserv/

-->
