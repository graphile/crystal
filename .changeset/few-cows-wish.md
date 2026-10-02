---
"postgraphile": patch
"@dataplan/pg": patch
---

Did you know the parent step for a table type isn't necessarily a
PgSelectSingleStep? It can also be a PgInsertSingleStep, PgUpdateSingleStep or
PgDeleteSingleStep. Normally this doesn't matter to much - if all you're doing
is `.get(attr)` then it should work great (and makes the mutations better
because they're only `RETURNING ...` the attributes you need); but if you want
to do `$parent.select(...)` now you have an issue...

Introducing `PgClassSingleStep.toSelectSingle()`; now you can easily get a
PgSelectSingleStep to work with:

```ts
const myPlan = ($parentClass: PgClassSingleStep, fieldArgs) => {
  const $parent: PgSelectSingleStep = $parentClass.toSelectSingle();
  $parent.select(/*...*/)
```
