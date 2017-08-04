graphile-build-pg
=================

`graphile-build-pg` is a collection of plugins for `graphile-build` that allow
you to extend your GraphQL schema with high-performance types and fields based
on resources found in your PostgreSQL database schema.

The plugins here-in do not exhibit the N+1 query problem common in many
database-based GraphQL APIs thanks to graphile-build's advanced
[look-ahead](https://www.graphile.org/graphile-build/look-ahead/) features,
they're more efficient, even, than `DataLoader`-based solutions.

An example of an application built on `graphile-build-pg` is [PostGraphQL
v4+](https://github.com/postgraphql/postgraphql) which allows you to run just
one command to instantly get a fully working and secure GraphQL API up and
running based on your PostgreSQL database schema.

**For in-depth documentation about `graphile-build-pg`, please see [the
graphile documentation website](https://www.graphile.org/).**
