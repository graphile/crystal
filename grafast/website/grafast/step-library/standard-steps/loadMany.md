# loadMany

Similar to [DataLoader][]'s load method, uses the given callback function to
read many results from your business logic layer. To load just one, see
`loadOne`.

As an enhancement over DataLoader, `loadMany` also keeps track of the
attributes that were accessed on each of the records returned via
`.get(attrName)` and any parameters set via `.setParam(key, value)`. This
information will be passed through to your callback function such that you may
make more optimal calls to your backend business logic, only retrieving the
data you need.

Usage:

```ts
const $userId = $user.get("id");
const $friendships = loadMany($userId, getFriendshipsByUserIds);
```

`loadMany` accepts two arguments, the first is the step that specifies which
records to load, and the second is the callback function called with these specs
responsible for loading them.

The callback function is called with two arguments, the first is a list of the
values from the specifier step and the second is options that may affect the
fetching of the records.

:::tip

For optimal results, we strongly recommend that the callback function is defined
in a common location so that it can be reused over and over again, rather than
defined inline. This will allow LoadManyStep to optimise calls to this function.

:::

An example of the callback function might be:

```ts
const friendshipsByUserIdCallback = (ids, { attributes }) => {
  // Your business logic would be called here; e.g. this might be the same
  // function that your DataLoaders would call, except we can pass additional
  // information to it:
  return getFriendshipsByUserIds(ids, { attributes });
};
```

[dataloader]: https://github.com/graphql/dataloader
