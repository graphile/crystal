---
"grafast": patch
---

IMPORTANT: if your step class has `hasSideEffects = true` as a public field
declaration, you need to move this to be inside the `constructor()` as
`this.hasSideEffects = true`.
