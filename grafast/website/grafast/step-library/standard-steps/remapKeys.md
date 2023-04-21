# remapKeys

Returns an object resulting from extracting the given `actualKey` from the input
and storing it as the `desiredKey` in the output.

Usage:

```ts
const $mapped = remapKeys(
  $original,

  // Take the `first_name` and `id` properties of the original object, and
  // return a new object where these are stored into the `name` and `row_id`
  // properties respectively.
  {
    name: "first_name",
    row_id: "id",
  },
);
```

:::tip

This step is particularly useful during the optimize phase, if your step manages
to inline itself into an ancestor then likely it will need to transform the
ancestor in order to return something equivalent to what it would have been
without this optimization.

:::

TODO: this tip is poorly worded.
