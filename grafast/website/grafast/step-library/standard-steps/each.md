# each

Transforms a list by wrapping each element in the list with the given mapper.

Usage:

```ts
const $newList = each($oldList, ($listItem) => doSomethingWith($listItem));
```

## Example generating a list of objects

Sometimes you have a step representing a collection of resources, `$list`, and
you need to build a list of derivative objects from them. For example, the
items in your collection might have `x` and `y` properties, and you might want
to turn them into `lng` and `lat` attributes; which might look like this:

```ts
const $derivatives = each($list, ($item) =>
  object({
    name: $item.get("name"),
    lng: $item.get("x"),
    lat: $item.get("y"),
  }),
);
return $derivatives;
```

:::warning Remember: `applyTransforms()` if passing to another step

If you aren't returning the result of `each()` from a plan resolver, but are
instead feeding it into another step, you will likely need to perform
`applyTransforms()` to force the list transforms to take place before the
dependent step receives the resulting values. Read more in
[`applyTransforms()`](./applyTransforms.md).

:::
