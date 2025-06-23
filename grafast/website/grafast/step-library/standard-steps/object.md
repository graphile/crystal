# object

Builds an object using the keys given and the values being the results of the
associated steps.

Usage:

```ts
const $fetchOptions = object({
  userId: $user.get("id"),
  first: fieldArgs.getRaw("first"),
  includeArchived: constant(true),
});
```
