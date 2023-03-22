---
"@dataplan/pg": patch
"graphile-build-pg": patch
---

Renamed `recordType` codec factory to `recordCodec`. `recordCodec()` now only
accepts a single object argument. Renamed `enumType` codec factory to
`enumCodec`. `enumCodec()` now only accepts a single object argument. Rename
`listOfType` to `listOfCodec`.

Massive overhaul of PgTypeCodec, PgTypeColumn and PgTypeColumns generics - types
should be passed through much deeper now, but if you reference any of these
types directly you'll need to update your code.
