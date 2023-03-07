---
"graphile-build": patch
"graphile-utils": patch
---

`graphile-utils` now includes the `makeAddPgTableConditionPlugin` and
`makeAddPgTableOrderByPlugin` generators, freshly ported from V4. The signatures
of these functions has changed slightly, but the functionality is broadly the
same.
