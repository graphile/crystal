---
"@dataplan/pg": patch
---

Move PgSubscriber to @dataplan/pg/adaptors/pg and automatically build it if you
set `pubsub: true` in your `makePgConfig` call.
