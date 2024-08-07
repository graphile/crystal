---
"graphile-build-pg": patch
---

🚨 `pgCodecRef` behaviors are now presented a `[codec, refName]` tuple rather
than the ref object directly. You can get the old `ref` object via
`codec.refs?.[refName]`
