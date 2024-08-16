---
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
---

Added `pgRegistry.pgExecutors` so executors don't need to be looked up from a
resource (this causes confusion) - instead they can be referenced directly. By
default there's one executor called `main`, i.e.
`build.input.pgRegistry.pgExecutors.main`.
