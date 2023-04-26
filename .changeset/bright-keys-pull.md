---
"postgraphile": patch
"grafserv": patch
---

Grafserv now has a plugin system (via graphile-config), first plugin hook
enables manipulating the incoming request body which is useful for persisted
operations.
