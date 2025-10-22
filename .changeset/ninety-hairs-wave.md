---
"graphile-build": patch
"postgraphile": patch
"grafserv": patch
---

Implement queue for `watchGather`/`watchSchema`/etc and integrate with
grafserv's `setPreset` middleware. Promises returned by such now delay schema
application, preventing growing concurrent work.
