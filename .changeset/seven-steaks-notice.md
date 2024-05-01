---
"grafast": patch
---

Completely eradicate the concept of `GrafastError`, instead use `flagError()`
around any value to treat that value as an error. No longer performs
`instanceof Error` checks to detect errors in returned values.
