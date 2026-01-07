---
"postgraphile": patch
"@dataplan/pg": patch
---

When the PostgreSQL LISTEN is interrupted (networking issue/server restart/etc),
subscriptions will now be TERMINATED. This is a change in behavior to ensure
that messages are not dropped without client knowledge - we want at-least-once
delivery, and if we can't guarantee that we should terminate the subscription so
the client can perform any necessary resynchronization.
