---
"graphile-utils": patch
"postgraphile": patch
---

When generating types in named scopes (i.e. when using multiple PostGraphile
schemas in the same TypeScript namespace, and using `@graphile-pro/postgraphile`
for type generation), you can now pass the scope as an addition initial argument
to `addPgTableCondition` and `addPgTableOrderBy` to avoid having to pass
explicit generics, for example

```ts
addPgTableOrderBy("api", "public.users", (_build, orderByAscDesc) =>
  orderByAscDesc("BY_ID", "id"),
);
addPgTableCondition("api", "public.users", "matchesId", (build) => {
  // ...
});
```
