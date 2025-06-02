---
"grafast": patch
---

Fix a number of edge-case issues relating to incremental delivery:

- If a `@stream`'d step was `isSyncAndSafe` then the stream code wouldn't fire.
  Fixed by forcing all `@stream`'d steps to have `.isSyncAndSafe = false`.
- If a `@stream`'d step was an `AccessStep` then the output plan would skip over
  it using the optimized expression, thus reading data from the wrong place.
  AccessSteps are now only skipped by OutputPlan if they are `isSyncAndSafe`.
- Fixed a bug in our iterable where an error would not correctly surface errors
  to consumers.
