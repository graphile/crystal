# Graphile Build pg

`graphile-build-pg` is a collection of [graphile-build](/graphile-build) plugins that extend
your GraphQL schema with types and fields based on the tables, views, functions
and other resources in your PostgreSQL database.

This is achieved by introspecting your database with [pg-introspection](https://star.graphile.org/pg-introspection/) and
then building a [@dataplan/pg](https://grafast.org/grafast/step-library/dataplan-pg/) registry (composed of codecs, resources and
relations) for these entities. Then our plugins inspect this registry and
creates the relevant GraphQL types, fields, and [Gra*fast*](https://grafast.org) plan resolver
functions. The result is a high-performance, powerful, auto-generated but highly
flexible GraphQL schema.

If you don't want to use your database introspection results to generate the
schema, you can instead build the registry yourself giving you full control over
what goes into your GraphQL API whilst still saving you significant effort
versus writing the schema without auto-generation.

`graphile-build-pg` is a core component of [PostGraphile](https://postgraphile.org), a library that
helps you craft your ideal, incredibly performant, best practices GraphQL API
backed primarily by a PostgreSQL database with minimal developer effort.

# About

Thanks to Gra*fast*&lsquo;s query planning capabilities, the plugins in this package do not exhibit the N+1 query problem common in many database-based GraphQL APIs; for all but the flattest GraphQL queries these plugins typically significantly outperform `DataLoader`-based solutions &mdash; and the more complex your GraphQL query becomes the greater the benefit.
