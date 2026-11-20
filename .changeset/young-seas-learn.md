---
"graphile-utils": patch
"postgraphile": patch
---

`addPgTableOrderBy`'s callback gains an `orderByAscDesc` helper:

```ts
addPgTableOrderBy("public.users", (_build, orderByAscDesc) =>
  orderByAscDesc("BY_ID", "id"),
);
```

When using the latest PostGraphile Pro plugin (v0.4.0+) to generate types, this
helper infers the resource from `"public.users"` and checks attribute names in
strings, order specs, and query builder callbacks. (The standalone
`orderByAscDesc` export still requires an explicit resource type for
table-specific checking.)
