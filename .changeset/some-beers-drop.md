---
"@dataplan/pg": patch
---

Fixes an issue where `loadOneWithPgClient`/`loadManyWithPgClient` might result
in `Step<Promise<...>>` types. Steps will never represent promises.
