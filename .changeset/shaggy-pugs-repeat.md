---
"graphile-config": patch
"graphile": patch
---

`GraphileConfig.Preset::plugins` is now marked readonly - we do not require a
mutable array.
