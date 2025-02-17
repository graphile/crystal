---
title: Multiple GraphQL schemas
---

# Multiple GraphQL schemas with PostGraphile

Each PostGraphile instance only creates a single GraphQL schema ─ you don't get
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
middleware to switch between them. The key thing is to not to build more
PostGraphile instances then the number of services you have - do not build a
PostGraphile instance per request! (This is because every time you create a
PostGraphile instance, it will perform a fresh introspection of your database
schema and generate the GraphQL API from that - this would cause considerable
lag, and unnecessary load on your database!)

### Multiple endpoints

Here's an example of mounting multiple PostGraphiles at different endpoints:

```ts
import { createServer } from "node:http";
import express from "express";
import postgraphile from "postgraphile";
import { grafserv } from "postgraphile/grafserv/express/v4";
import userPreset from "./graphile.config.mjs";

// Create an express app
const app = express();
// (Add any Express middleware you want here.)

// Create a Node HTTP server, mounting Express into it
const server = createServer(app);
server.on("error", (e) => {
  console.error(e);
});

// Definitions of the PostgreSQL service we wish to expose via separate
// GraphQL APIs:
const services = {
  admin: "postgres:///admin",
  user: "postgres:///user",
};

// Loop over the services, and add them to our Express app
for (const [service, connectionString] of Object.entries(services)) {
  // Build a preset specifically for this service
  const preset = {
    extends: [userPreset],
    pgServices: [makePgService({ connectionString })],
    grafserv: {
      graphqlPath: `/${service}/graphql`,
      graphiqlPath: `/${service}`,
    },
  };
  // Build a PostGraphile instance for this service
  export const pgl = postgraphile(preset);
  // Create the Grafserv instance for this PostGraphile instance using the Express adaptor
  const serv = pgl.createServ(grafserv);
  // Add the Grafserv instance's route handlers to the Express app, and register
  // websockets if desired
  await serv.addTo(app, server);
  // TODO: check that enabling websockets on multiple grafservs via the same server doesn't cause any issues
}

// Start the Express server
server.listen(userPreset.grafserv?.port ?? 5678);
```

### Single endpoint, multiple GraphQL schemas

It's also possible to switch which PostGraphile instance to use for a single
endpoint based on some information provided in the HTTP request, but how you
would do this is dependent on what webserver framework you're using.

If you're using something simple like Node, Express or Connect then you can
build middleware for each instance and then write a custom middleware to call
the right one:

```ts
// TODO: this is untested!
import { createServer } from "node:http";
import express from "express";
import postgraphile from "postgraphile";
import { grafserv } from "postgraphile/grafserv/express/v4";
import userPreset from "./graphile.config.mjs";

// Create an express app
const app = express();
// (Add any Express middleware you want here.)

// Create a Node HTTP server, mounting Express into it
const server = createServer(app);
server.on("error", (e) => {
  console.error(e);
});

// A preset shared between our services which disables websockets and
// subscriptions since they are not supported
const commonPreset = {
  extends: [userPreset],
  grafserv: { websockets: false },
  disablePlugins: ["SubscriptionPlugin"],
};

// The services we wish to switch between
const services = {
  admin: {
    handler: express(),
    pgl: postgraphile({
      extends: [commonPreset],
      pgServices: [makePgService({ connectionString: "postgres:///admin" })],
    }),
  },
  user: {
    handler: express(),
    pgl: postgraphile({
      extends: [commonPreset],
      pgServices: [makePgService({ connectionString: "postgres:///user" })],
    }),
  },
};

// Mount the PostGraphile instances into the handlers
for (const { handler, pgl } of Object.values(services)) {
  const serv = pgl.createServ(grafserv);
  serv.addTo(handler);
}

// Add a custom middleware to switch between these handlers
app.use((req, res, next) => {
  const isAdmin = req.user?.isAdmin;
  if (isAdmin) {
    services.admin.handler(req, res, next);
  } else {
    services.user.handler(req, res, next);
  }
});

// Start the Express server
server.listen(userPreset.grafserv?.port ?? 5678);
```
