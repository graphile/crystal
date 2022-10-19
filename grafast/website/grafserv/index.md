---
sidebar_position: 1
---

# Grafserv Introduction

Grafserv - an incredibly fast GraphQL server for Node.js powered by
[Grafast](/grafast/).

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
