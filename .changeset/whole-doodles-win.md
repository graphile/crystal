---
"graphile-build-pg": patch
---

Change how dataplanPg and grafast helpers are imported by the introspection
plugin so that when AI copies this pattern it does it the right way and doesn't
have to add loads of dependencies.
