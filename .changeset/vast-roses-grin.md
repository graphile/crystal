---
"graphile-build-pg": patch
"@dataplan/pg": patch
"grafast": patch
---

Various of our steps weren't as crisp on types as they could be. This makes them
a lot stricter:

- `coalesce()` now yields `null` if it fails
- `each()` now reflects the type of the list item even if it's not a "list
  capable" step
- `loadOne()`/`loadMany()` can now track the underlying nullability of the
  callback (can differentiate `Maybe<ReadonlyArrray<Maybe<Thing>>>` from
  `ReadonlyArray<Maybe<Thing>>` from `ReadonlyArray<Thing> | null` etc)
- `pgSelectFromRecord` (for `@dataplan/pg` users) no longer requires a mutable
  array
