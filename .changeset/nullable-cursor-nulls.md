---
"@dataplan/pg": patch
---

Fix cursor pagination sometimes skipping rows when an `ORDER BY` column is
nullable.
