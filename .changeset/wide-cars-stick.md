---
"@dataplan/pg": patch
"graphile-build-pg": patch
"postgraphile": patch
---

Overhaul types of `.where()`, `.having()`, `.orderBy()` and similar methods to
avoid invalid embeds resulting in runtime errors - TypeScript should complain if
you do the wrong thing now. To fix your code in most cases you can switch to the
callback form: e.g. `.orderBy({ ... })` becomes `.orderBy(sql => ({ ... }))` -
the `sql` here is scoped to explicitly allow some embeds.
