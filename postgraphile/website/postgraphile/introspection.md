---
title: Introspection?
---

PostgreSQL has a powerful introspection API which allows us to ask it all about
a database — what schemas, tables, columns, constraints, indexes, functions,
comments, etc it has — and we use this information to construct the GraphQL
schema automatically.

We’ve built a library to do this that deeply integrates the PostgreSQL
documentation; should you wish to use this with your own projects (or just want
to see how it works), check out
[pg-introspection](https://star.graphile.org/pg-introspection).
