---
"graphile-build-pg": minor
"postgraphile": minor
---

Use the new `pg-introspection` APIs to enable multipass PostgreSQL
introspection. This reduces schema-building memory and registry size
significantly in databases where many resources are not exposed via PostGraphile
(e.g. where there are unexposed schemas, GRANTs used to choose what to expose,
or in databases that use an identical schema for each tenant where we've
observed a 97% (!!) reduction in heapTotal usage from building a schema).

If you have any issues with this new feature, set
`preset.gather.pgMultipassIntrospection` to `false` to use single-pass
introspection, and please report the issue with a minimal reproduction.
