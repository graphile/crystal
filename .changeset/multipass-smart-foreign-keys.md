---
"pg-introspection": patch
"graphile-build-pg": patch
"graphile-utils": patch
---

Multipass introspection fixes and additions:

- `onlyAccessible` now discovers standalone composite types
  (`create type ... as (...)`) whose row type the role can use; previously they
  were never initial.
- `details.request` returns a token, and `details.after(tokens, callback)` runs
  a continuation once those selectors have been fetched, so policies can
  discover in stages (e.g. a namespace by name, then a table within it).
  `requestByName` implements that pattern.
- `multipass.include` lists `[collection, schemaName, name]` entries to discover
  as initial objects regardless of entrypoint filters and privilege checks.
- PostGraphile now discovers the targets of `@foreignKey` smart tags, including
  tags added by `pgSmartTags`/`jsonPgSmartTags` rules and targets outside the
  introspected schemas, and re-introspects in watch mode when those rules
  change.
- graphile-build-pg's built-in introspection purposes (`registryCodec`,
  `enumTables`, etc.) are now declared from its entry point so that custom
  policies can use them.
