---
"@dataplan/pg": minor
"grafast": minor
"graphile-build": minor
"graphile-build-pg": minor
"graphile-utils": minor
"postgraphile": minor
---

Improves types in `@dataplan/pg` around codecs, resources, nullability, range
values, and resource execution arguments. Adds support for PostGraphile Pro (V5)
type generation.

**NOTE**: `pgResource.execute(...)` no longer accepts `pgCodec` in the
arguments; it was always ignored internally because the parameter codec was
used, now we explicitly don't accept it. `{ step, name?, pgCodec }` &rarr;
`{ step, name? }`

The new PostGraphile Pro (V5) plugin can generate registry, plan resolver,
introspection (for smart tags) and other related types, and even supports
correct types across multiple PostGraphile schemas in the same TypeScript
environment. The generated-schema-aware types provide checked schema names,
tables, fields, arguments, nullability, and PostgreSQL resource types where
available, while preserving broad fallbacks when they are not.

With this plugin, many of the standard PostGraphile APIs can become more
strongly typed with minimal user input. If you only have one PostGraphile
instance then using the default generation should be picked up automatically by
most plugin helpers -- `extendSchema()`, `wrapPlans()`, `pgSmartTags()`,
`changeNullability()`, `addPgTableCondition()`, `addPgTableOrderBy()` -- and for
manual plugins you can use the `scopedPlugin(...)` helper to define your plugin.
If you run multiple schemas then you can pass a generic (e.g.
`extendSchema<"public-api">(...)`) to indicate the types to use.
