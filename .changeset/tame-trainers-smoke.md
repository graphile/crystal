---
"graphile-build-pg": patch
"postgraphile": patch
---

🚨 `@notNull` on a volatile function now results in the field on the payload
becoming non-null, not the mutation field itself.
