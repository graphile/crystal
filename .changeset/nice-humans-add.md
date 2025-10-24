---
"graphql-codegen-grafast": patch
---

Fix generation for abstract types to reflect Grafast type changes. Specifically,
`source` and `specifier` have reversed order, and `specifier` is generated as
the _data_ type rather than the _step_ type. If you had `specifier: ...` in your
type overrides file (unlikely), please ensure this change is reflected:
`specifier: Step<T>` should now be `specifier: T`.
