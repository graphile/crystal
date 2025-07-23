---
"graphile-build": patch
"graphile-build-pg": patch
---

Allow changing the Node ID codec from the default (`base64JSON`) to your own
default via the `preset.schema.defaultNodeIdCodec` setting, or even override it
on a per-table basis with the `@nodeIdCodec` smart tag. Thanks @jsmnbom!
