---
"@dataplan/pg": patch
"graphile-build-pg": patch
---

Renamed `recordType` codec factory to `recordCodec`. `recordCodec()` now only
accepts a single object argument. Renamed `enumType` codec factory to
`enumCodec`. `enumCodec()` now only accepts a single object argument.
