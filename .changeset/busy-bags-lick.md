---
"@graphile/simplify-inflection": patch
"graphile-build-pg": patch
"graphile-build": patch
"graphile-utils": patch
"postgraphile": patch
"@dataplan/pg": patch
---

Significantly reduce the size of a PostGraphile exported schema (around 20%
reduction on test fixtures) by:

- marking optional things as optional
- excluding many optional things from being specified in configuration objects
  (including `tags` objects if no tags are present)
- using `LIST_TYPES` for PostgreSQL builtin list types
- extracting inline function definitions to be global functions where
  appropriate, and simplifying functions where not

Breaking changes to types (but more accurate reflection of reality):

- `extensions` is now marked as optional in many places.
- `extensions.tags` is now marked optional in many places.
- `PgCodecAttribute.notNull` is now marked as optional.
- `PgResourceParameter.requires` is now marked as optional.
- `PgCodecRelation.isUnique` is now marked as optional.
- `pgGetArgDetailsFromParameters().argDetails.postgresArgName` is now optional
  (may return `undefined` in addition to `null`) and `.required` is now optional
  (returns `boolean | undefined`)
