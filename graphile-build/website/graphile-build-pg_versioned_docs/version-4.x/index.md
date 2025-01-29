---
title: Overview
---

`graphile-build-pg` is a collection of [graphile-build](/graphile-build) plugins that extend
your GraphQL schema with types and fields based on the tables, views, functions
and other resources in your PostgreSQL database.

## About

Thanks to Graphile Engine's advanced [query look-ahead](../graphile-build/look-ahead) features, the plugins in this package do not exhibit the N+1 query problem common in many database-based GraphQL APIs. For all but the flattest GraphQL queries, these plugins typically outperform `DataLoader`-based solutions.

An example of an application built on `graphile-build-pg` is [PostGraphile](http://postgraphile.org) which with one command connects to your PostgreSQL database and provides a full highly performant standards-compliant GraphQL API.

**It is recommended that you use PostGraphile directly unless you really want to get low level access to this library.**

If you prefer to use the plugins yourself it's advised that you use the `defaultPlugins` export from `graphile-build-pg` and then create a new array based on that into which you may insert or remove specific plugins. This is because it is ordered in a way to ensure the plugins work correctly (and we may still split up or restructure the plugins).

### Export: defaultPlugins

An array of graphql-build plugins in the correct order to generate a well-thought-out GraphQL object tree based on your PostgreSQL schema. This is the array that postgraphile-core uses.

### Manual usage

```js
import { defaultPlugins, getBuilder } from "graphile-build";
import { defaultPlugins as pgDefaultPlugins } from "graphile-build-pg";

async function getSchema(
  pgConfig = process.env.DATABASE_URL,
  pgSchemas = ["public"],
  additionalPlugins = [],
) {
  return getBuilder(
    [...defaultPlugins, ...pgDefaultPlugins, ...additionalPlugins],
    {
      pgConfig,
      pgSchemas,
      pgExtendedTypes: true,
    },
  );
}
```
