---
"pg-introspection": patch
---

Optimize ACL role lookups with Map-based indexes and WeakMap caching. Replace O(n) linear scans in `getRole()`, `getRoleByName()`, and `expandRoles()` with O(1) Map lookups, and cache `expandRoles` results per introspection object. Significantly improves performance for schemas with many roles.
