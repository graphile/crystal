---
"grafast": patch
"graphile-build-pg": patch
"graphile-build": patch
"@grafserv/persisted": patch
"postgraphile": patch
"@dataplan/pg": patch
---

Exported version no longer uses 'require' hack, instead it's added at build
time. Packages now export `version`.
