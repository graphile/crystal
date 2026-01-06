---
"@dataplan/pg": patch
"graphile-build-pg": patch
---

Fix PgSubscriber: do NOT automatically re-establish subscriptions, instead
terminate them so the clients know something went wrong and can invoke the
relevant re-synchronization code.
