---
"graphile-export": patch
---

Export an interface's `interfaces` as a thunk, as is already done for an object
type's. A plain array could reference an interface whose declaration comes later
in the exported file, and importing the file then threw
`ReferenceError: Cannot access '<Interface>' before initialization`.
