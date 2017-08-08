GraphQL-Build
=============

Build a high-performance easily-extensible GraphQL schema by combining plugins.

This repository is a monorepo (managed by [lerna][]) which comprises the following packages:

**[graphile-build][]**: The core package: a simple plugin system that enables you to build a GraphQL schema out of plugins

**[graphile-build-pg][]**: A selection of plugins related to PostgreSQL: schema
  introspection, generation of fields and types for all tables, computed columns,
  query procedures, etc - if there's certain features you don't want, simply
  don't use that plugin! (Surfacing plugin dependencies has not been built yet,
  so be careful when you disable a plugin.)

**[postgraphile-core][]**: Intended to be used by [PostGraphQL][] in
  order to provide its schema functionality (excluding HTTP handling, etc)

**[graphql-parse-resolve-info][]**: Parses a GraphQLResolveInfo object into a
  tree of the fields that are being requested to enable optimisations to your
  GraphQL schema (e.g. we use it to determine which fields are required from the
  SQL database)

Status
------

- [graphile-build][] - working (but needs tests, more documentation, refactoring,
  and probably needs to support more hooks)

- [graphile-build-pg][] / [postgraphile-core][] - working - passes the PostGraphQL
  integration tests for queries and mutations, no descriptions are added to
  fields yet

- [graphql-parse-resolve-info][] - complete (but needs dedicated tests because
  it's currently only tested by virtue of the postgraphile-core tests depending
  on it)

Running on Node less than v8
----------------------------

We actually bundle two copies of each module - one compiled for Node v8+ and
one for Node v4+. This is accomplished using [Babel's env
preset](https://babeljs.io/docs/plugins/preset-env/). You can see the
switching code in, e.g.,
[packages/graphile-build/index.js](packages/graphile-build/index.js). This has a
couple consequences:

- We'll run a lot faster on Node v8 because most of the code is passed through
  verbatim - for example we can use Node v8+'s built in `async/await` rather
  than emulating with generators/promises/etc
- When we're developing we only compile the Node v8+ version so we can minimize
  latency, so if you wish to contribute keep your Node up to date!

You're highly encouraged to upgrade to Node v8, not just for the fancy new
features but also the performance improvements!

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
lerna run test
```

If the above succeeds, you're good to go! If not, please reach out on twitter:
[@benjie](https://twitter.com/benjie).

### GraphQL conflict

If you get an error like the below:

`GraphQL conflict for 'GraphQLObjectType' detected! Multiple versions of graphql exist in your node_modules?`

it means the `peerDependencies` have been installed locally in each package
which is not what we want (we want them installed in the root `node_modules`.

To solve this, we need to re-bootstrap:

```
rm -Rf packages/*/node_modules
yarn
lerna bootstrap
```

[PostGraphQL]: https://github.com/postgraphql/postgraphql
[Caleb Meredith]: https://github.com/calebmer
[lerna]: https://github.com/lerna/lerna
[postgraphql-sql]: https://github.com/postgraphql/postgraphql/blob/9c36d7e9b9ad74e665de18964fd2554f9f639903/src/postgres/utils/sql.ts
[graphile-build]: packages/graphile-build/
[graphile-build-pg]: packages/graphile-build-pg/
[postgraphile-core]: packages/postgraphile-core/
[graphql-parse-resolve-info]: packages/graphql-parse-resolve-info/
