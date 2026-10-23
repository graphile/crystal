---
"grafast": minor
"postgraphile": patch
---

Expose `prepare` function that performs operation planning but does not execute
the operation. Useful for pre-warming the operation plan cache on server start.
