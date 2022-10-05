---
layout: page
path: /postgraphile/aggregates/
title: Aggregates
---

PostGraphile has support in its plugin system for powerful aggregates. This
system was only introduced in 4.4 and is not well documented yet; should you
need aggregates good starting points are:

- The
  [built in `PgConnectionTotalCountPlugin`](https://github.com/graphile/graphile-engine/blob/2353cf94867a88d76062ab274a30ce930a30aab7/packages/graphile-build-pg/src/plugins/PgConnectionTotalCount.js)
  which adds a `totalCount` aggregate to connections, counting all rows that
  match the criteria (ignoring pagination info)
- The [@graphile/pg-aggregates](https://github.com/graphile/pg-aggregates)
  module which adds `sum` aggregates to the schema (more to come)
- The [Discord chat](http://discord.gg/graphile) (feel free to @benjie in
  \#help-and-support)

### Aggregates ignore pagination info

Aggregates are performed over the **entire collection** - not just the data that
would be returned if you were to query the nodes. This means they ignore the
`first`, `last`, `before`, `after` and `offset` arguments. This is deliberate
(if you only need aggregates over the data that matches your pagination
information then you could calculate these on the client).

### Aggregates only work on Relay connection

If you're using `simpleCollections: "only"` you can override it on a
per-collection basis with the
[`@simpleCollections` smart comment](./smart-comments/#simple-collections).
