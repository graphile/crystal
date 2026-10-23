---
"graphile-build-pg": minor
"postgraphile": minor
"@dataplan/pg": minor
---

PgExecutor now groups similar queries and runs them through the same connection,
reducing the overhead from multiple transaction handshakes and making better use
of prepared statements and similar optimizations. Reduces both parallelism and
overhead, hopefully netting an overall performance win with some potential
per-request latency trade-offs.
