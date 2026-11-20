---
"graphile-utils": patch
"postgraphile": patch
---

When generated table resource types are available, use the `orderByAscDesc`
helper passed as the second argument to the `addPgTableOrderBy` callback:

```ts
addPgTableOrderBy("public.users", (_build, orderByAscDesc) =>
  orderByAscDesc("BY_ID", "id"),
);
```

The callback helper infers the resource from `"public.users"` and checks
attribute names in strings, order specs, and query builder callbacks. The
standalone `orderByAscDesc` export requires an explicit resource type for
table-specific checking.
