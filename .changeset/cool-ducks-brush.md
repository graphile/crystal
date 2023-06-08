---
"grafast": patch
---

Restore field-local handling of planning errors safely, eradicating all steps
created while planning an errored field (and falling back to blowing up the
request on error).
