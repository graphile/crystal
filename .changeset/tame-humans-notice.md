---
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
---

🚨 `resource.resolveVia()` has changed result format; from
`{ relation: string, attribute: string }` to
`{ relationName: string, attributeName: string, relation: PgCodecRelation, attribute: PgCodecAttribute }`.
If you use `resolveVia`, please be sure to extract the correct properties.
