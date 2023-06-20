---
"graphile-build-pg": patch
"graphile-build": patch
"graphile-utils": patch
"graphile-export": patch
"grafast": patch
---

Change 'objectType.extensions.grafast.Step' to
'objectType.extensions.grafast.assertStep', accept it via object spec, deprecate
registerObjectType form that accepts it (pass via object spec instead), improve
typings around it.
