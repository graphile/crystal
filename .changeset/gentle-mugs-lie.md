---
"@graphile/simplify-inflection": patch
---

Renamed `getBaseName`, `baseNameMatches`, `getOppositeBaseName` and
`getBaseNameFromKeys` inflectors to all begin with an underscore (`_`) - this is
because these inflectors should only be used from other inflectors, since they
may return non-string types (null/boolean/etc).
