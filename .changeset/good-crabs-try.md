---
"grafast": patch
---

🚨 LoadOneStep/LoadManyStep and related helpers have been merged into `LoadStep`

`loadOne`/`loadMany` still work exactly as before, but the related types and
helpers have been renamed (to remove the `One`/`Many`) so that the underlying
business logic can be shared. `LoadOneStep` and `LoadManySingleRecordStep`
references should be replaced with `LoadedRecordStep`.
