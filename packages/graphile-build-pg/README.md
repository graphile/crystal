# graphile-build-pg

<span class="badge-patreon"><a href="https://patreon.com/benjie" title="Support Graphile development on Patreon"><img src="https://img.shields.io/badge/donate-via%20Patreon-orange.svg" alt="Patreon donate button" /></a></span>
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Package on npm](https://img.shields.io/npm/v/graphile-build-pg.svg?style=flat)](https://www.npmjs.com/package/graphile-build-pg)
![MIT license](https://img.shields.io/npm/l/graphile-build-pg.svg)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

`graphile-build-pg` is a collection of Graphile Engine plugins that allow you
to extend your GraphQL schema with high-performance types and fields based on
resources found in your PostgreSQL database schema.

Thanks to Graphile Engine's advanced [query
look-ahead](https://www.graphile.org/graphile-build/look-ahead/) features,
the plugins in this package do not exhibit the N+1 query problem common in
many database-based GraphQL APIs. For all but the flattest GraphQL queries
these plugins typically outperform `DataLoader`-based solutions.

An example of an application built on `graphile-build-pg` is
[PostGraphile](https://github.com/graphile/postgraphile) which with one
command connects to your PostgreSQL database and provides a full highly
performant standards-compliant GraphQL API.

**It is recommended that you use PostGraphile directly unless you really want
to get low level access to this library.**

If you prefer to use the plugins yourself it's advised that you use the
`defaultPlugins` export from `graphile-build-pg` and then create a new array
based on that into which you may insert or remove specific plugins. This is
because it is ordered in a way to ensure the plugins work correctly (and we
may still split up or restructure the plugins).

### Export: `defaultPlugins`

An array of graphql-build plugins in the correct order to generate a
well-thought-out GraphQL object tree based on your PostgreSQL schema. This is
the array that `postgraphile-core` uses.

### Manual usage

```js
import { defaultPlugins, getBuilder } from "graphile-build";
import { defaultPlugins as pgDefaultPlugins } from "graphile-build-pg";

async function getSchema(
  pgConfig = process.env.DATABASE_URL,
  pgSchemas = ["public"],
  additionalPlugins = []
) {
  return getBuilder(
    [...defaultPlugins, ...pgDefaultPlugins, ...additionalPlugins],
    {
      pgConfig,
      pgSchemas,
      pgExtendedTypes: true,
    }
  );
}
```
