---
"@dataplan/pg": patch
---

Superuser connection now uses `superuserPoolConfig` rather than `poolConfig`
when creating a pool.
