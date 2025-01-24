---
title: Aggregates
---

PostGraphile's engine has support for powerful aggregates. The
[@graphile/pg-aggregates](https://github.com/graphile/pg-aggregates) module
adds various aggregates to the schema, and gives you the ability to add more
via plugins. Aggregates are located under connection fields.

### Aggregates ignore pagination info

Aggregates are performed over the **entire collection** represented by the
field and its filters — not just the data that would be returned if you were to
query the nodes. This means they ignore the `first`, `last`, `before`, `after`
and `offset` arguments. This is deliberate (if you only need aggregates over
the data that matches your pagination information then you could calculate
these on the client).

### Aggregates only work on Relay connection

Thanks to their expansibility, relay [connections](./connections) were the
perfect place to add aggregates support. If you're using a behavior
configuration that prefers lists over connections (e.g. `-connection +list`)
then you can override it on a per-collection basis with the [`@behavior
+connection` smart tag](./smart-tags/#behavior).
