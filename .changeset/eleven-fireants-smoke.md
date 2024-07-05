---
"grafast": patch
---

Fix inference for `loadOne`, `loadMany` and similar steps by removing
`@internal` from some of the types, thereby making `.d.ts` files valid again.
