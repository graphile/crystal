---
"graphile-build-pg": minor
"postgraphile": minor
---

Set `preset.gather.pgMultipassIntrospection` to `true` to enable
`pg-introspection`'s new multipass introspection feature. This reduces
schema-building memory and registry size significantly in databases where many
resources are not exposed via PostGraphile (e.g. where there are unexposed
schemas, GRANTs used to choose what to expose, or in databases that use an
identical schema for each tenant where we've observed a 97% (!!) reduction in
heapTotal usage from building a schema).
