---
"@dataplan/pg": patch
---

Add `.scopedSQL(sql => ...)` method to PgSelectStep, PgSelectSingleStep,
PgUnionAllStep, PgUnionAllSingleStep; can be used to allow embedding of other
_typed_ steps directly into an SQL expression without needing to use
`$pgSelect.placeholder(...)` wrapper. Only works with steps that have a
`pgCodec: PgCodec` property (typically those coming from PgSelectSingleStep
accesses) since otherwise we don't currently know how to cast the value to
Postgres.
