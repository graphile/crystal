---
"graphile-export": patch
---

Optimize `exportSchema` for large schemas: detecting well-known namespaces and
deduplicating factory calls no longer scan every previously exported value. On a
schema of ~8,500 types (a 42MB export), the export drops from 100s to 25s; the
generated file is unchanged.
