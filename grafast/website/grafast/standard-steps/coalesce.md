# coalesce

Returns a step that represents to the first non-nullish[^1] value from the
provided steps, or `null` if they are all nullish. Steps can be passed either as
individual arguments or as a single array.

Inhibited steps passed to `coalesce()` will **not** cause the `coalesce()`
itself to be inhibited.

Usage:

```ts
const $coalesced = coalesce($a, $b, $c);
// or
const $coalesced = coalesce([$a, $b, $c]);
```

[^1]: "Nullish" meaning `null` or `undefined`.
