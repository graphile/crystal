---
"graphile-build-pg": patch
"graphile-build": patch
"graphile-utils": patch
"postgraphile": patch
---

Use a single behavior check per location.

In the past two weeks I added a few behavior strings like
`array:attribute:filterBy` (a scoped form of `attribute:filterBy` to only be
used by attributes that were arrays); however I've realised that this will
require plugin authors to implement all the same logic to figure out what type
an attribute is in order to then see if it has the relevant behavior. This goes
against the design of the behavior system, and makes plugin authors' lives
harder. So I've reverted this, and instead used the `entityBehaviors` system to
add or remove the base `attribute:filterBy` (etc) behavior depending on what the
type of the attribute is.
