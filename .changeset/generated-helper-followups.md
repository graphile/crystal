---
"graphile-utils": minor
---

Extend generated type support to the remaining schema helpers:

- `orderByAscDesc<TResource>` checks attribute names, attribute codecs and
  callback query builders against a PostgreSQL resource type. Callbacks continue
  to support returning either one order specification or an array.
- `addPgTableCondition<TScope, TValue>` shares the input value type between its
  input field configuration and deprecated condition callback.
- `processSchema<TScope>` exposes the scoped build and finalize context
  alongside the schema.
