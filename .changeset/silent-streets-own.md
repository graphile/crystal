---
"postgraphile": minor
---

Bugfix: the V4 preset now correctly ignores `@omit select` like V4 would.
Previously, the V4 preset would silently turn `@omit select` into `-select`,
which differs to V4's handling of this. (Note: `@omit read` is probably what
you're looking for, `@omit select` is silently ignored.)
