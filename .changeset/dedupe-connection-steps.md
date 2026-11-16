---
"grafast": patch
---

`ConnectionStep`s over the same collection with the same pagination now
deduplicate, so the same connection selected twice (e.g. under two aliases) is
planned once.
