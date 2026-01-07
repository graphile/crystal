---
"graphile-utils": patch
---

`wrapPlans()` now refuses to wrap the plan for a field that both has no plan and
either has a `resolve()` or `subscribe()` method (i.e. resolver emulation will
be used). This is done by simply skipping wrapping the resolver, and emitting a
warning to the console. This is a breaking fix as fields that may have
previously had the default plan resolver wrapped may no longer do so, but should
not impact anyone running a "pure" PostGraphile/Grafast schema (it only impacts
you if you are using traditional (non-plan) resolvers, e.g. via
`extendSchema()`, and you're also using `wrapPlans()` to target these same
fields).
