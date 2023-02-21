---
"graphile-build": patch
---

Gather phase initialState may now be asynchronous. If initialCache returns a
promise, a helpful error message with advice is now raised.
