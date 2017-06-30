GraphQL-Build
=============

Build a high-performance easily-extensible GraphQL schema by combining plugins.

This repository is a monorepo (managed by [lerna][]) which comprises the following packages:

**[graphql-build][]**: The core package: a simple plugin system that enables you to build a GraphQL schema out of plugins

**[graphql-build-pg][]**: A selection of plugins related to PostgreSQL: schema
  introspection, generation of fields and types for all tables, computed columns,
  query procedures, etc - if there's certain features you don't want, simply
  don't use that plugin! (Surfacing plugin dependencies has not been built yet,
  so be careful when you disable a plugin.)

**[postgraphql-build][]**: Intended to be used by [PostGraphQL][] in
  order to provide its schema functionality (excluding HTTP handling, etc)

**[graphql-parse-resolve-info][]**: Parses a GraphQLResolveInfo object into a
  tree of the fields that are being requested to enable optimisations to your
  GraphQL schema (e.g. we use it to determine which fields are required from the
  SQL database)

**[pg-sql2][]**: A port of Caleb's [pg-sql][] and the
  [similar functionality in PostGraphQL][postgraphql-sql] with enhancements for
  developer happiness and greater expressiveness.

Status
------

graphql-build - complete (but needs tests, documentation, refactoring)

graphql-build-pg - read-only plugins are functional, mutations not yet supported, no descriptions are added to fields yet

postgraphql-build - see graphql-build-pg

graphql-parse-resolve-info - complete (but needs tests, documentation, refactoring)

pg-sql2 - complete (but needs tests, documentation, refactoring)

This won't run on Node less than v8
-----------------------------------

This is a temporary situation; I want to run the native code on Node directly
if possible but I'll be using Babel to compile the code so it can support
earlier versions of node. In the mean time, why not try Node v8?
`async`/`await` is built in!

History
-------

This system grew out of a need for more efficient SQL queries, easier
extensibility and customisation in [PostGraphQL][]. I'm extremely grateful to
[Caleb Meredith][] for the stellar work he put into PostGraphQL, and to the
community who helped me come up with this idea.

Development
-----------

```
npm install -g lerna yarn
yarn
lerna bootstrap
```

GraphQL conflict
----------------

If you get an error like the below:

`GraphQL conflict for 'GraphQLObjectType' detected! Multiple versions of graphql exist in your node_modules?`

it means the peerDependencies have been installed locally in each package which is not what we want (we want them installed in the root `node_modules`.

To solve this, we need to re-bootstrap:

```
rm -Rf packages/*/node_modules
yarn
lerna bootstrap
```

[PostGraphQL]: https://github.com/postgraphql/postgraphql
[Caleb Meredith]: https://github.com/calebmer
[lerna]: https://github.com/lerna/lerna
[pg-sql]: https://github.com/calebmer/pg-sql
[postgraphql-sql]: https://github.com/postgraphql/postgraphql/blob/9c36d7e9b9ad74e665de18964fd2554f9f639903/src/postgres/utils/sql.ts
[graphql-build]: packages/graphql-build/
[graphql-build-pg]: packages/graphql-build-pg/
[postgraphql-build]: packages/postgraphql-build/
[graphql-parse-resolve-info]: packages/graphql-parse-resolve-info/
[pg-sql2]: packages/pg-sql2/
