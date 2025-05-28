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

🚨 This will potentially break your plan types quite a bit. In particular, the
`LoadOneCallback` and `LoadManyCallback` types now have 5 (not 4) generic
parameters, the new one is inserted in the middle (after the second parameter)
and indicates the true return type of the callback (ignoring promises) - e.g.
`Maybe<ReadonlyArray<Maybe<ItemType>>>` for `LoadManyCallback`. They have
sensible defaults if you only specify the first two generics.
