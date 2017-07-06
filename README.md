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

- [graphql-build][] - working (but needs tests, more documentation, refactoring,
  and probably needs to support more hooks)

- [graphql-build-pg][] / [postgraphql-build][] - working - passes the PostGraphQL
  integration tests for queries and mutations, no descriptions are added to
  fields yet

- [pg-sql2][] - complete (but needs dedicated tests because it's currently only
  tested by virtue of the postgraphql-build tests depending on it)

- [graphql-parse-resolve-info][] - complete (but needs tests for similar reasons to
  `pg-sql2`)

Running on Node less than v8
----------------------------

On Node v8 and above, we run the code in the `src` folders directly as modern
Node has basically everything you need (except [object
splatting](https://github.com/tc39/proposal-object-rest-spread), but we make
do), including async/await, so there's no need for source transpiling, source
maps, polyfills, and other such workarounds.

However before Node v8 we need various helpers, even such simple things as
`Array.prototype.includes`, and so we bundle
[`babel-polyfill`](http://babeljs.io/docs/usage/polyfill/). It's marked as a
peer-dependency, so we'll use the version you provide (to avoid it being
installed too many times!) and it is **only loaded** if you're on a Node
version before v8 - you can see the switching code in, e.g.,
[packages/graphql-build/index.js](packages/graphql-build/index.js).

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
[pg-sql]: https://github.com/calebmer/pg-sql
[postgraphql-sql]: https://github.com/postgraphql/postgraphql/blob/9c36d7e9b9ad74e665de18964fd2554f9f639903/src/postgres/utils/sql.ts
[graphql-build]: packages/graphql-build/
[graphql-build-pg]: packages/graphql-build-pg/
[postgraphql-build]: packages/postgraphql-build/
[graphql-parse-resolve-info]: packages/graphql-parse-resolve-info/
[pg-sql2]: packages/pg-sql2/
