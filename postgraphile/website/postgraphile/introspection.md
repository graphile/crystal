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

PostGraphile starts with the schemas configured on each PostgreSQL service. It
then queries the PostgreSQL catalog in rounds, following dependencies such as
column types and foreign key targets. This can discover objects outside the
configured schemas without loading every object in the database. Multipass
introspection is enabled by default. Setting
`gather.pgMultipassIntrospection` to `false` selects single-pass introspection.

A schema extension may depend on an object that no database dependency points
to. For example, an application exposing the `app` schema might use an enum
table, a helper function, or a custom PostgreSQL type from the `sys` schema.
Add a `multipassInclude` plugin to your preset to include those objects in
the introspection results:

```ts
import { multipassInclude } from "postgraphile/utils";

export default {
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

Each list is optional. Use schema-qualified PostgreSQL names. A function name
includes every overload. The service defaults to `main`. These settings affect
catalog discovery. GraphQL field and type generation follow their usual rules.
