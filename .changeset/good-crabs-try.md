---
"grafast": patch
---

🚨 LoadOneStep/LoadManyStep and related helpers have been merged into `LoadStep`
so that the underlying business logic can be shared.

`loadOne`/`loadMany` are still used exactly as before, but some of the related
types and helpers have been renamed and `loadOne` now results in the same step
class as an item from a `loadMany` (`LoadedRecordStep`).

References to `LoadOneStep` and `LoadManySingleRecordStep` both need to be
replaced with `LoadedRecordStep`.

References to `LoadManyStep` need to be replaced with `LoadStep`.

`LoadOneOptions` and `LoadManyOptions` are now both `LoadOptions` (and types
refer to the _item_ type).
