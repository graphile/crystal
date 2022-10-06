# Usage

PostGraphile is formed of three layers, each building on top of the layer below.

## CLI

At the very top is the [**PostGraphile CLI**](./usage-cli.mdx). This layer is the
most user-friendly but also the most limited: it accepts a few command line
options, will load your [config file][], and spins up a Node `http` server (or
cluster thereof) to host the Grafserv instance from the PostGraphile library
(see next).

**Most users should start with this layer, and many users use it successfully in
production.**

## Library

The [**PostGraphile library**](./usage-library.md) builds your GraphQL schema (see
next), possibly in watch mode, and lets you access it or retrieve a [Grafserv][]
instance. You can mount the grafserv instance in Node's `http` server, or as a
middleware in any of a number of Node.js web servers, such as Connect, Express,
Koa, Fastify, Restify, etc.

Grafserv is responsible for receiving, deciphering and validating the GraphQL
HTTP request from the user according to the options supplied; building the
GraphQL `context` (which includes things such as authentication details); and
then sending the query along with the GraphQL schema (see next) to [Grafast][]
to be executed.

**About 70% of PostGraphile users end up using this layer in their
applications**. Using PostGraphile as a middleware like this is the recommended
setup for most folks - it allows you to combine your PostGraphile GraphQL server
with anything else your Node server needs to provide (e.g. authentication,
session management, logging, rate limiting, other endpoints, etc) and leverage
the full power of the Node.js ecosystem.

## Schema

Deepest down is the
[**PostGraphile GraphQL schema** ("schema-only")](./usage-schema.md) itself which
contains all the types, fields and plans (Gra*fast*'s replacement for
resolvers). The plans inside the schema take care of configuring a PG client
with the relevant settings when needed, so the schema can be used without
lifecycle management (though you will need to be sure to pass a suitable
context). Thanks to PostGraphile's
[exportable schema support](./exporting-schema.md) you can even write this
GraphQL schema to disk as an executable JavaScript file - this file will not
depend on `postgraphile`, `graphile-build`, `graphile-build-pg`,
`graphile-utils` or other "build time" schema concerns - it will only contain
references to what is necessary for it to execute in production, such as
`graphql`, `grafast`, `@dataplan/pg` and `jsonwebtoken`.

**Most users will never use this level.**

## Use the config, Luke!

By storing most of your configuration into a `graphile.config.js` file, you will
be able to run PostGraphile in any of these three modes and still leverage a
similar setup in each. This file also saves us from having to offer tens of CLI
options as we have in previous releases, instead only offering the most
essential options.

## Which one should I use?

We recommend that you start with the PostGraphile CLI and then quickly move to
the PostGraphile middleware if you need deeper integration with Node.js.

Which layer would you like to read more about?

- [**CLI**](./usage-cli.mdx)
- [**Middleware** ("library")](./usage-library.md)
- [**GraphQL schema** ("schema-only")](./usage-schema.md)
- [Configuration](./config.md)

[config file]: ./config.md
[grafserv]: https://grafast.org/grafserv
[grafast]: https://grafast.org/grafast
