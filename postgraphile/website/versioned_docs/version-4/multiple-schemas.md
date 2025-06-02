---
title: Multiple GraphQL Schemas
---

# Multiple GraphQL Schemas with PostGraphile

Each ​PostGraphile instance only creates a single GraphQL schema ─ you don't get
one schema per user based on permissions, for example. Typically, in GraphQL, a
single schema is what you want ─ it allows you to use the various GraphQL
tooling for autocomplete, linting, mapping, etc using the same shared schema.

However it sometimes makes sense to provide two or more different schemas; for
example if you have two completely independent use-cases, or if you need to
generate a special "admin" schema that only admins can access.

Typically it's a good idea to put different schemas on different URIs; it makes
it easier to point to the relevant schema, download its description, and perform
the relevant linting/etc with it. If someone is not allowed access to a schema
they simply cannot access that endpoint.

It's possible to run multiple PostGraphile schemas in a single Node.js server,
either mounting them at different endpoints or on the same URI and use a simple
middleware to switch between them. The key thing is to not call `postgraphile`
more times then the number of services you have. So if you have two services you
want to only be calling `postgraphile` _twice_ and not once for every request.
(This is because every time `postgraphile` is called, it will perform a fresh
introspection of your database schema and generate the GraphQL API from that -
this would cause considerable lag!)

### Multiple endpoints

Here's an example of mounting multiple PostGraphiles at different endpoints:

```js
const services = {
  notification: "CONNECTION_STRING_TO_NOTIFICATION_SERVICE",
  user: "CONNECTION_STRING_TO_USER_SERVICE",
};

for (const [service, connectionString] of Object.entries(services)) {
  app.use(
    postgraphile(connectionString, "public", {
      graphiql: true,
      graphqlRoute: `/${service}/graphql`,
      graphiqlRoute: `/${service}/graphiql`,
    }),
  );
}
```

### Single endpoint, multiple GraphQL schemas

Here's an example of switching which PostGraphile is used at a single endpoint
based on some information provided in the HTTP request:

```js
const services = {
  notification: postgraphile(
    "CONNECTION_STRING_TO_NOTIFICATION_SERVICE",
    "public",
    {
      graphiql: true,
    },
  ),
  user: postgraphile("CONNECTION_STRING_TO_USER_SERVICE", "public", {
    graphiql: true,
  }),
};

app.use((req, res, next) => {
  if (someCondition) {
    services.notification(req, res, next);
  } else {
    services.user(req, res, next);
  }
});
```

_Code from the example by @calebmer in this issue:
https://github.com/graphile/postgraphile/issues/427#issuecomment-293032341_
