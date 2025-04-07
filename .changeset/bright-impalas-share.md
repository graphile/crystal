---
"grafast": patch
---

Fixes bug in `__inputObject` step where `[key]: undefined` entries could be
added. Entries will now only be added if not undefined, to match the behavior of
GraphQL.js.
