---
"postgraphile": patch
"@dataplan/pg": patch
"grafast": patch
---

Introduce step caching to reduce deduplication workload safely, thereby reducing
planning time for many larger queries.
