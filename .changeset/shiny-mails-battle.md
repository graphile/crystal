---
"graphile-build-pg": patch
"postgraphile": patch
---

Fix bug in nullable nodeID handling for computed column arguments with the Relay
preset that was causing the entire select to be inhibited on null/undefined.
