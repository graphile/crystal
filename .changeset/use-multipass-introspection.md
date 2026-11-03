---
"graphile-build-pg": minor
---

Use multipass PostgreSQL introspection by default to reduce schema-building
memory and registry size. Set `gather.pgIntrospection.multipass` to `false` to
use single-pass introspection.
