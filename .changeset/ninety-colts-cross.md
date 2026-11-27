---
"grafast": patch
---

Ability for caching options comparisons to "ignore" certain keys; this is
typically useful when the setting is 'advisory' (e.g. connection "affinity") and
should not require the keysets use separate fetches. Also adds ability to merge
options in this case, e.g. choose which of the 'ignore'-d settings wins.
