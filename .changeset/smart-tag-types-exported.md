---
"graphile-utils": patch
---

Re-export the smart-tag types (`PgSmartTagRule`, `PgSmartTagTags`,
`PgSmartTagFilterFunction`, `JSONPgSmartTags`, and the update/subscribe
callback types) from the package root. They are defined and `export`ed
by `makePgSmartTagsPlugin.ts` but were missing from the barrel's
`export type`, unlike every sibling plugin module — so consumers
building typed rule arrays (e.g. `const rules: PgSmartTagRule[] = [...]`
passed to `makePgSmartTagsPlugin`) could not import `PgSmartTagRule` from
`graphile-utils` / `postgraphile/utils`.
