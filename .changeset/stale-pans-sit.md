---
"graphile-config": patch
"postgraphile": patch
---

Fixes bug where two different plugins with the same name would be allowed to
exist in the same (resolved) preset. Users of dynamically created presets and
plugins (e.g. `makeV4Preset(...)` in PostGraphile) should be wary not to include
two calls to the same factory in their preset (directly or indirectly).
