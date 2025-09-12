---
"graphile-build-pg": patch
---

Fix a bug in watch fixtures where refreshing a materialized view would result in
the schema being rebuilt (thanks @zarybnicky!)
