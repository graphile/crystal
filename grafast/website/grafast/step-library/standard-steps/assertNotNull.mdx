# assertNotNull

Guard a step so that `null` values become execution errors. The returned step
shares the same value as the original when it resolves to a non-null result. If
the wrapped step resolves to `null`, Grafast raises a `SafeError` with the
message you provide, and any dependant steps are prevented from running.

```ts
const $id = assertNotNull($nodeId, "Expected a User ID");
const $user = users.get($id);
```

Optionally pass `{ if: $cond }` to toggle the assertion dynamically. When the
condition resolves to `false`, `assertNotNull` behaves like a pass-through.

:::note[Declarative flow]
Only dependants of the returned step see the assertion. Other branches of the
plan continue executing.
:::

Use [`trap`](./trap.md) when you need to turn the resulting error back into data
(such as a nullable field or a dedicated error object).

:::tip[Naming]
The Graphile packages export this helper as `assertNotNull`. Historical
references to `assertNonNull` refer to the same step.
:::

## Plan diagrams

`assertNotNull` also builds a `__FlagStep` (see `grafast/src/steps/__flag.ts`).
Plan diagrams typically inline that step into the dependency edge, annotating
the arrow with labels such as `rejectNull` and `onReject="Null ID"` rather than
displaying a separate node.

```mermaid
graph TD
  A["Access"] -->|rejectNull, onReject="Null ID"| B["Lambda"]
```

Those labels show that dependants skip execution when the input is `null`, and
that a `SafeError("Null ID")` will be raised if the branch is reached.
