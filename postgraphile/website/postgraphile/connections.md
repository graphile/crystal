---
title: Connections
---

When a GraphQL field is expected to return a large list of database records, we
typically implement a connection adhering to the
[GraphQL Cursor Connections Specification](https://facebook.github.io/relay/graphql/connections.htm)
(with a few enhancements). This connection allows you to perform cursor-based
pagination with ease, and is seen as a GraphQL best practice because it leaves
space for you to neatly expand your schema with additional functionality, for
example adding aggregation support across the connection or exposing join-table
fields via the connection edges.

The enhancements that we apply on top of Relay’s connection spec include:

- `totalCount` - the total number of records matching the query (excluding
  cursor/limit/offset constraints); note that this does `count(*)` and thus has a
  performance overhead
- `nodes` - just the nodes (no `edge` wrapper) useful if you don’t need the
  cursor for every entry and want a simple data structure
- `PageInfo.startCursor` and `PageInfo.endCursor` - useful for pagination if you
  use `nodes { ... }` rather than `edges { cursor, node { ... } }`

Many connections (specifically those coming from tables, views and relations)
support [filtering](./filtering) the return results with a condition.

### Advice

Connections are a bit more complex than lists and thus have a performance
overhead. This is generally a justified trade-off in that it gives you more
future flexibility (meaning you can stick to GraphQL’s “versionless schema”
ideal) and a feature that regular pagination cannot give you (namely cursor
pagination, which is highly effective in infinite scrolling contexts where the
underlying data is constantly being added to, such as news feeds). However, if
performance is critical to you or if you prefer simple lists over GraphQL
connections then you can use [behaviors](./behavior.md) to configure your
preferences. To enable lists and disable connections, you might add something
like this to your preset:

```js title="graphile.config.mjs"
const preset = {
  schema: {
    defaultBehavior: "-connection +list",
  },
};
```

You can also enable both with `+connection +list`. You can even configure this
on a per-entity basis with [smart tags](./smart-tags.md#behavior) if you like!

### Benchmarking

If you’re comparing the performance of two GraphQL servers be sure to make sure
the comparison is fair by using either lists on both or connections on both.
You can have PostGraphile generate lists rather than connections by using the
`defaultBehavior` setting detailed in the advice above.

If you read a research paper comparing performance of different GraphQL servers
and they don’t ensure basic equivalence by using either lists on both or
connections on both then the results of that research are questionable at best.
We advise that you don’t base any decisions on such low effort research.

Should you wish to do a fair comparison between PostGraphile and any other
software feel free to reach out for advice on how to make the PostGraphile
schema as similar as possible to the target schema. PostGraphile is highly
configurable and although it uses best practices such as connections by default
you can easily change settings to match other offerings which may have defaults
that prioritize performance or simplicity over GraphQL best practices.
