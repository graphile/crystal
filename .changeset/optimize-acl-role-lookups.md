---
"pg-introspection": patch
"postgraphile": patch
---

Optimize ACL role lookups, significantly improving performance for schemas with
many roles (reported 11,000 roles goes from 20+ minutes to 5 seconds!)

🚨 `expandRoles` now returns a read-only array type.
