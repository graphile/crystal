---
layout: page
path: /postgraphile/usage/
title: Usage
---

PostGraphile is formed of three layers.

- At the very top is the [**PostGraphile CLI**](./usage-cli). This layer is the
  most user-friendly and is responsible for three things: accepting common
  options from the command line; spinning up a HTTP server (or a cluster of
  them, or none at all depending on what options you're using); and mounting the
  PostGraphile middleware (see next). **Most users should start with this layer,
  many users use it successfully in production, and it's where we recommend you
  start.**
- The PostGraphile CLI wraps the
  [**PostGraphile library's** middleware](./usage-library). This middleware is
  suitable for mounting in Node.js HTTP, **Connect**, **Express** or **Koa**
  applications (the library also exports "route handlers" that are suitable for
  use in other frameworks such as **Fastify** and **Restify**). This layer is
  responsible for receiving, deciphering and validating the GraphQL HTTP request
  from the user according to the options supplied; configuring a PG client with
  the relevant settings; and then sending the query on to the GraphQL schema
  (see next) to be resolved. **About 70% of PostGraphile users end up using this
  layer in their applications**; reasons to use this over the CLI include the
  ability to add Express middleware before PostGraphile (e.g. to perform rate
  limiting, sessions, custom logging, custom authentication and other concerns)
  and the ability to take greater control over the PostGraphile system.
- Deepest down is the
  [**PostGraphile GraphQL schema** ("schema-only")](./usage-schema) itself
  which contains all the types, fields and resolvers. (The schema is constructed
  dynamically, so cannot be written to disk.) **Most users will never use this
  level.**

The deeper you go in the stack, the more complex your setup code will be, but
the more powerful your integration can be. We're always trying to expose as much
power as is reasonable through the CLI, but it's not sensible to make every
possible thing a CLI option - if you need that level of customisation then you
should opt for the middleware.

We recommend that you start with the PostGraphile CLI and then move to the
PostGraphile middleware if you need deeper integration with Node.js.

Which layer would you like to read more about?

- [**CLI**](./usage-cli)
- [**Middleware** ("library")](./usage-library)
- [**GraphQL schema** ("schema-only")](./usage-schema)
