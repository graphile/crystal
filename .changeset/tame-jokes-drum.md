---
"@dataplan/pg": minor
"graphile-build-pg": minor
"postgraphile": minor
---

Add support for PostgreSQL PROCEDUREs (introduced in Postgres 11). Procedures
are invoked via `call proc(...)` rather than being embedded in a `select`, so
they're now exposed as mutation fields backed by a new `PgCallStep`/`pgCall()`
step in `@dataplan/pg`, rather than reusing the `select`-based mechanism used
for functions. Procedures with `OUT`/`INOUT` parameters return their values as a
nested record on the mutation payload, matching the existing behaviour for
functions that return multiple columns.
