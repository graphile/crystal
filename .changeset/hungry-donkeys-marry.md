---
"graphile-build": patch
"graphile-build-pg": patch
"pg-introspection": patch
---

Create new getTags() introspection helper and use it. Rename
GraphileBuild.GraphileBuildSchemaOptions to GraphileBuild.SchemaOptions. Fix a
couple minor inflection bugs. Add some missing descriptions. Fix the initial
inflection types to not leak implementation details. Fix inflectors to use
ResolvedPreset rather than Preset.
