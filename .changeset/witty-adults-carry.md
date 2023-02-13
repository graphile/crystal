---
"@dataplan/pg": patch
"graphile-build-pg": patch
"postgraphile": patch
---

- `name` is now a required configuration option in `makePgConfig`
- Conflicts in `pgConfigs` (e.g. multiple sources using the same 'name') now
  detected and output
- `makePgConfig` now allows passing `pgSettings` callback and
  `pgSettingsForIntrospection` config object
