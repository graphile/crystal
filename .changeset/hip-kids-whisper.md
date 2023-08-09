---
"graphile-utils": patch
"postgraphile": patch
---

Fix makeExtendSchemaPlugin: now calls callback in 'init' phase, so `Build` type
is used (rather than `Partial<Build>`) and other types/handlers/etc should
already be registered.
