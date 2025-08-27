---
"postgraphile": patch
"@dataplan/pg": patch
---

Deprecate `withPgClient`/`withPgClientTransaction` because people are using them
incorrectly and causing themselves N+1 issues. Instead, rename to
`sideEffectWithPgClient` and introduce new `loadOneWithPgClient` and
`loadManyWithPgClient` helpers that people should use instead of `withPgClient`.
