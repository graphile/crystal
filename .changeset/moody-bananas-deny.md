---
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
---

🚨 PostgreSQL function parameters `required` property has been removed and
replaced with its inverse `optional`. Checks for `parameter.required` should be
replaced with `!parameter.optional`. Omitting this configuration option will now
have the effect of marking the parameter as _required_ (which matches Postgres'
default) rather than _optional_ as before.
