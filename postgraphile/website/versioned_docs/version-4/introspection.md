---
title: Introspection?
---

# Introspection

PostgreSQL has a powerful introspection API which allows us to ask it all about
a database - what schemas, tables, columns, constraints, indexes, functions,
comments, etc it has - and we use this information to construct the GraphQL
schema automatically. You provide the list of schemas to inspect via the
`pgSchemas` setting, e.g. `pgSchemas: ["public"]`.

If you're interested to see how we do this, the introspection query can be found
[in our GitHub](https://github.com/graphile/graphile-engine/blob/master/packages/graphile-build-pg/src/plugins/introspectionQuery.ts).
