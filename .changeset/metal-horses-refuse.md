---
"grafast": patch
"grafserv": patch
"postgraphile": patch
---

Fix bug in subscriptions where termination of underlying stream wouldn't
terminate the subscription.
