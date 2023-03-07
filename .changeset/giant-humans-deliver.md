---
"graphile-build": patch
"postgraphile": patch
---

Convert a few more more options from V4 to V5.

Explicitly remove query batching functionality, instead use HTTP2+ or websockets
or similar.

Add schema exporting.
