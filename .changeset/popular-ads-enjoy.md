---
"eslint-plugin-graphile-export": patch
"graphile-build-pg": patch
"graphile-build": patch
"@dataplan/json": patch
"graphile-export": patch
"@dataplan/pg": patch
"grafast": patch
---

Since `ModifierStep` and `BaseStep` are no more; `ExecutableStep` can be renamed
to simply `Step`. The old name (`ExecutableStep`) is now deprecated.
