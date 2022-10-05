---
layout: page
path: /postgraphile/connections/
title: Connections
---

When a GraphQL field is expected to return a large list of database records, we
typically implement a connection adhering to the
[Relay Cursor Connections Specification](https://facebook.github.io/relay/graphql/connections.htm)
(with a few enhancements). This connection allows you to perform cursor-based
pagination with ease, and is seen as a GraphQL best practice.

The enhancements that we apply on top of Relay's connection spec include:

- `totalCount` - the total number of records matching the query (excluding
  cursor/limit/offset constraints)
- `nodes` - just the nodes (no `edge` wrapper) useful if you don't need the
  cursor for every entry and want a simple data structure
- `PageInfo.startCursor` and `PageInfo.endCursor` - useful for pagination if you
  use `nodes { ... }` rather than `edges { cursor, node { ... } }`

Many connections (specifically those coming from tables, views and relations)
support [filtering](./filtering/) the return results with a conditon.

### Advice

If you prefer a simpler list interface over GraphQL connections then you can
enable that either along-side our connections (`both`) or exclusively (`only`)
using our [`--simple-collections [omit|both|only]` option](./usage-cli/).
