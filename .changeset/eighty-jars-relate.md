---
"graphile-build": patch
"graphile-export": patch
"grafserv": patch
"grafast": patch
---

Support for `@defer` and `@stream` no longer requires
`graphql@16.1.0-experimental-stream-defer.6`. `graphql@^16.9.0` should now work,
since we ponyfill everything we need.
