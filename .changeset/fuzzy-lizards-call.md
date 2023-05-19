---
"grafast": patch
---

Massive overhaul of planning, now up to 2x faster!

- 🚨 `metaKey` and `optimizeMetaKey` now default to `undefined` - if you need
  the `meta` object in your step class, be sure to set them (e.g.
  `this.metaKey = this.id`)
- `RemapKeys` can optimize itself away if it doesn't really do anything
- Simpler plan diagrams - non-polymorphic buckets no longer have "polymorphic
  paths"
- `deduplicate()` will now no-longer receive the step itself as a peer
