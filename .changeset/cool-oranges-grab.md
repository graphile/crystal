---
"@dataplan/pg": patch
"grafast": patch
---

Fix issue where planning errors occurring after side-effects would result in
GrafastInternalError being thrown. Further, fix issue causing
`$step.hasSideEffects=true` to throw a planning error if `$step` had created
other steps (as dependencies) during its construction. (Notably, `withPgClient`
suffered from this.) Thanks to @purge for reporting the issue and creating a
reproduction.
