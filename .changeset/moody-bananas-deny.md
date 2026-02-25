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

(A temporary `getter` has been added to allow both `required` and `optional` to
be used for a short time, but this will output a warning if it's hit and will
not persist through an executable schema export. Please update your code to use
`optional` instead of `required` as soon as possible, we'll be removing this
compatibility shim once V5 is released.)
