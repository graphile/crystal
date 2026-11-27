---
"graphile-utils": patch
"postgraphile": patch
---

Graphile Utils now exports a `scopedUtils` helper to bind Graphile helpers to a
named generated type scope, useful alongside `@graphile-pro/postgraphile` type
generation. The returned helpers can then infer table matches, attribute names,
and other generated types from that scope.

```ts
import { scopedUtils } from "postgraphile/utils";

// These plugin factories will now automatically use the `<"api">` scope for
// generated types.
const { addPgTableOrderBy, addPgTableCondition } = scopedUtils("api");

addPgTableOrderBy("public.users", (_build, orderByAscDesc) =>
  orderByAscDesc("BY_ID", "id"),
);
addPgTableCondition("public.users", "matchesId", (build) => {
  // ...
});
```
