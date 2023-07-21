# Usage

There's three main ways of using PostGraphile: a **CLI** that you can run with
minimal effort, the **library mode** that we expect most users will ultimately
want to use, and **schema-only mode** which gives you the most control (but
also the most responsibilities). Each of these layers builds on top of the
layer below it, so it's fairly easy to move between them. We've also made sure
that they are each configured via the same [preset system](./config.mdx) so you
can move from one to another with minimal effort.

## CLI

[**PostGraphile CLI**](./usage-cli.mdx) is the most user-friendly way to try
PostGraphile, but also the most limited: it accepts a few command line options,
will load your [config file][], and spins up a Node `http` server (or cluster
thereof) to host the Grafserv instance from the PostGraphile library (see
next). The CLI does not integrate with existing Node.js servers, so if you need
that you'll want to use library mode.

:::tip

**Most users should start with this layer**, and many users use it successfully
in production. If you don't need to leverage much of the Node.js ecosystem in
your API then you may find it's sufficient for your needs.

:::

## Library

The [**PostGraphile library**](./usage-library.md) builds your GraphQL schema (see
next), possibly in watch mode, and lets you access it or retrieve a [Grafserv][]
instance. You can mount the Grafserv instance in Node's `http` server, or as a
middleware in any of a number of Node.js web servers, such as Connect, Express,
Koa, Fastify, Restify, etc.

Grafserv is responsible for receiving, deciphering, and validating the GraphQL
HTTP request from the user according to the options supplied; building the
GraphQL `context` (which includes things such as authentication details); and
then sending the query along with the GraphQL schema (see next) to [Gra*fast*][]
to be executed.

:::tip

**About 70% of PostGraphile users end up using this layer in their
applications**. Using PostGraphile as a middleware like this is the recommended
setup for most folks - it allows you to combine your PostGraphile GraphQL server
with anything else your Node server needs to provide (e.g. authentication,
session management, logging, rate limiting, other endpoints, etc) and leverage
the full power of the Node.js ecosystem.

:::

## Schema

[**PostGraphile schema-only mode** ("schema-only")](./usage-schema.md) focusses
on building the GraphQL schema containing all your types, fields and plans
(Gra*fast*'s replacement for resolvers). The plans inside the schema take care
of configuring a PG client with the relevant settings when needed, so the
schema can be used without lifecycle management (though you will need to be
sure to pass a suitable context).

Thanks to PostGraphile's [exportable schema support](./exporting-schema.md) you
can even write an executable version of this GraphQL schema to disk as JavaScript -
this file will not depend on `postgraphile`, `graphile-build`,
`graphile-build-pg`, `graphile-utils` or other "build time" schema concerns -
it will only contain references to what is necessary for it to execute in
production, such as `graphql`, `grafast`, `@dataplan/pg` and `jsonwebtoken`.

:::tip

**Few users need this**, but it is helpful for server-side GraphQL resolution
without the overhead of a network layer.

:::

## Use the config, Luke!

By storing most of your configuration into a `graphile.config.js` (or similar)
file, you will be able to run PostGraphile in any of these three modes and
still leverage a similar setup in each. This file also saves us from having to
offer tens of CLI options as we have in previous releases, instead only
offering the most essential options.

## Which one should I use?

We recommend that you start with the PostGraphile CLI and then quickly move to
the PostGraphile middleware if you need deeper integration with Node.js.

Which layer would you like to read more about?

- [**CLI**](./usage-cli.mdx)
- [**Middleware** ("library")](./usage-library.md)
- [**GraphQL schema** ("schema-only")](./usage-schema.md)
- [Configuration](./config.mdx)

[config file]: ./config.mdx
[grafserv]: https://grafast.org/grafserv
[grafast]: https://grafast.org/grafast
[gra*fast*]: https://grafast.org/grafast
