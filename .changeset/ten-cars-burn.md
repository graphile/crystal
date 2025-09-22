---
"graphile-build-pg": patch
"postgraphile": patch
---

Enable partitions to be exposed via the `@partitionExpose child` or
`@partitionExpose both` smart tags on the partitioned table. Also adds a global
configuration option for managing the default setting for this (`parent` by
default: only expose the parent partitioned table, not its underlying child
partitions).
