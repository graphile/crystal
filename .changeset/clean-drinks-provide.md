---
"graphile-utils": patch
---

🚨 makeWrapPlansPlugin callback is now passed `build` rather than `options` -
use `build.options` to get the options object. 🚨 makeWrapPlansPlugin filters
now accept only three args (`context`, `build`, `field`) since the fourth
argument (`options`) was redundant - get it from `build.options` instead.
