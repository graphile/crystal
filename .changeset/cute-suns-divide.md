---
"grafast": patch
---

Steps whose execute method raise an error no longer gain FLAG_STOPPED - can now
`trap(...)` such steps as if they had instead returned an error for each value.
