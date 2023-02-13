---
"@dataplan/pg": patch
"graphile-build-pg": patch
"postgraphile": patch
---

- Conflicts in `pgConfigs` (e.g. multiple sources using the same 'name') now
  detected and output
- Fix defaults for `pgSettingsKey` and `withPgClientKey` based on config name
- `makePgConfig` now allows passing `pgSettings` callback and
  `pgSettingsForIntrospection` config object
- Multiple postgres sources now works nicely with multiple `makePgConfig` calls
