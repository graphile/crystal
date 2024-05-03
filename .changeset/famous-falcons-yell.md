---
"grafast": patch
---

`resolvedPreset` and `outputDataAsString` can now be specified directly via
ExecutionArgs - no need to pass additional params to `execute()` and
`subscribe()` to enable these. Previous signatures are now deprecated (but still
supported, for a few betas at least).
