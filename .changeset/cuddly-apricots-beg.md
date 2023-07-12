---
"grafast": patch
"graphile-build-pg": patch
"graphile-build": patch
"@grafserv/persisted": patch
"postgraphile": patch
"@dataplan/pg": patch
---

Exported `version` no longer uses `require('../package.json')` hack, instead the
version number is written to a source file at versioning time. Packages now
export `version`.
