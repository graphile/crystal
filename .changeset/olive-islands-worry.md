---
"graphile-utils": patch
"postgraphile": patch
---

Fix major bug in PostGraphile v5 RC5 where smart tag string matching matches all
entities after the first check due to mutation.
