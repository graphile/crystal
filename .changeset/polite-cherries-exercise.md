---
"graphile-build-pg": patch
"postgraphile": patch
"graphile-config": patch
---

Overhaul the way in which `graphile-config` presets work such that including a
preset at two different layers shouldn't result in unexpected behavior.
