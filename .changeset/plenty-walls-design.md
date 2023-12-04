---
"graphile-build-pg": patch
"@dataplan/pg": patch
---

Move PgContextPlugin from graphile-build-pg into @dataplan/pg so it can be used
after schema export without needing dependency on graphile-build-pg
