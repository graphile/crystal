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

## Multipass introspection

_PostGraphile 5.3+_

Set `gather.pgMultipassIntrospection` to `true` to enable multipass
introspection. For backwards compatibility reasons, PostGraphile currently uses
single-pass introspection by default; we'll move to multipass by default in V6,
probably.

In multipass mode, PostGraphile starts with the schemas configured on each
PostgreSQL service, then queries the PostgreSQL catalog in rounds, following
dependencies such as column types and foreign key targets. This can discover
objects outside the configured schemas without needing to load every object in
the database. This can result in massively reduced memory usage if your database
contains a lot of types/tables/functions/etc that is not exposed/used by your
GraphQL schema.

However, a schema extension (e.g. `extendSchema(...)`) may depend on an object
that no database dependency points to, and thus will not be automatically
discovered by multipass introspection. For example, an application exposing the
`app` schema might use an enum table, a helper function, or a custom PostgreSQL
type from the `sys` schema.

### multipassInclude

Add a `multipassInclude(...)` plugin to your preset to ensure certain database
entities are included in your introspection results, this is typically useful if
you're using enum tables from another schema but you don't already reference
them (e.g. via foreign key) in your exposed schema(s).

```ts
import { multipassInclude } from "postgraphile/utils";

export default {
  gather: { pgMultipassIntrospection: true },
  plugins: [
    multipassInclude({
      serviceName: "main",
      tables: ["sys.some_enum"],
      functions: ["sys.plan_helper"],
      types: ["sys.field_result"],
    }),
  ],
};
```

Every option is optional; `serviceName` defaults to `main` and the others
simply don't add policies if not provided. Function names include all overloads.
