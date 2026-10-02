---
"graphile-build": patch
---

Optimize the behavior system for large schemas: parsed behavior strings are now
cached, and entity lookups no longer scan every previously seen entity. On a
schema of ~8,500 types, `buildSchema` drops from 33s to 6.5s; the resulting
schema is unchanged.
