---
"graphile-utils": patch
"postgraphile": patch
---

`wrapPlans()` now automatically applies `fieldArgs` when you call the underlying
`plan()`, so your wrapper applies _after_ field args have been applied. This
helps address invalid plan heirarchy issues due to side effects your plan
wrappers may wish to add and similar. Opt out via
`{ autoApplyFieldArgs: false, plan(plan, $parent, fieldArgs) { ... } }`.
