---
"@dataplan/pg": patch
"grafast": patch
"grafserv": patch
"graphile-build": patch
"graphile-build-pg": patch
"graphile-utils": patch
"postgraphile": patch
---

Grafserv now masks untrusted errors by default; trusted errors are constructed
via GraphQL's GraphQLError or Grafast's SafeError.
