---
sidebar_position: 1
---

# Graphile Export

Graphile Export enables you to export a GraphQL schema (or other code) as
executable JavaScript code. It is primarily intended to be used with GraphQL
schemas (or code) that have been automatically generated in memory via some
kind of framework.

Graphile Export can be used with any JavaScript-based GraphQL schema that has
been written in a way so as to be compatible (see
[exportable/importable](./exportable.md)) &mdash; it is **not** specific to
GraphQL schemas generated via Graphile-produced software such as PostGraphile,
Graphile Build or Gra*fast*.

:::tip PostGraphile users

The Graphile Export documentation is written in a tooling-agnostic way. Users
of PostGraphile should also refer to the PostGraphile ["Exporting your
schema"](https://postgraphile.org/postgraphile/next/exporting-schema) article
for PostGraphile specific instructions, tips, and warnings.

:::

The key reason to export your schema as executable code is to move intensive
schema build processes such as introspection, looping, computation,
transformation, and so on from startup time to build time; then at run time you
just need to run the final code without any of the underlying computations that
shaped it. This has many benefits:

- Faster startup time (build the schema directly without any computation)
- Reduced thundering herd in the event of mass server restarts (no need to consult external data sources on startup)
- Lower CPU/memory usage (code only required to compute the schema does not need to be loaded into memory or executed in production)
- Fewer runtime dependencies (build systems can be omitted from the bundle)
- Much faster cold starts for serverless environments such as AWS Lambda
- And probably more

:::warning Graphile Export is experimental

This feature is in the early stages and is to be adopted with care and caution.
It is being used in production by a handful of PostGraphile V5 users but has
yet to be solidly battle-tested. If you're using Graphile Export, please
file an issue telling us how you're getting on &mdash; good or bad!

Please read this documentation and consult [the Graphile
Discord](https://discord.gg/graphile) for questions, help and suggestions.

:::

Next up, [find out how Graphile Export works](./how-it-works.md)!
