---
"postgraphile": patch
---

Fix "simple subscriptions" `ListenPayload.relatedNode` following the overhaul of
polymorphism (thanks @slaskis for the reproduction in the test suite!)
