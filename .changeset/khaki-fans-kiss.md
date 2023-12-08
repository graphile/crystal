---
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
---

Add support for limiting polymorphic plans (only some of them, specifically
`pgUnionAll()` right now) to limit the types of their results; exposed via an
experimental 'only' argument on fields, for example
`allApplications(only: [GcpApplication, AwsApplication])` would limit the type
of applications returned to only be the two specified.
