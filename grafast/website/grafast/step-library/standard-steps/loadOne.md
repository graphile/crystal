# loadOne

Similar to [DataLoader][]'s load method, uses the given callback function to
read a single result from your business logic layer. To load a list, see
`loadMany`.

As an enhancement over DataLoader, `loadOne` also keeps track of the attributes
that were accessed via `.get(attrName)` and any parameters set via
`.setParam(key, value)`. This information will be passed through to your
callback function such that you may make more optimal calls to your backend
business logic, only retrieving the data you need.

Usage:

```ts
const $userId = $post.get("author_id");
const $user = loadOne($userId, getUsersByIds);
```

`loadOne` accepts two arguments, the first is the step that specifies which
records to load, and the second is the callback function called with these specs
responsible for loading them.

The callback function is called with two arguments, the first is a list of the
values from the specifier step and the second is options that may affect the
fetching of the records.

:::tip

For optimal results, we strongly recommend that the callback function is defined
in a common location so that it can be reused over and over again, rather than
defined inline. This will allow LoadOneStep to optimise calls to this function.

:::

## Example callback

An example of the callback function might be:

```ts
async function getUsersByIds(ids, { attributes }) {
  // Your business logic would be called here; e.g. this might be the same
  // function that your DataLoaders would call, except we can pass additional
  // information to it.

  // For example, load from the database
  const rows = await db.query(
    sql`SELECT id, ${columnsToSql(attributes)} FROM users WHERE id = ANY($1);`,
    [ids],
  );

  // Ensure you return the same number of results, and in the same order!
  return ids.map((id) => rows.find((row) => row.id === id));
}
```

## Multiple steps

The [`list()`](./list) step can be used if you need to pass the value of more
than one step into your callback:

```ts
const $isAdmin = $user.get("admin");
const $stripeId = $customer.get("stripe_id");
const $last4 = loadOne(list([$isAdmin, $stripeId]), getLast4FromStripeIfAdmin);
```

The first argument to the `getLast4FromStripeIfAdmin` callback will then be an
array of all the tuples of values from these plans: `ReadonlyArray<[isAdmin:
boolean, stripeId: string]>`. The callback might look something like:

```ts
async function getLast4FromStripeIfAdmin(tuples) {
  const stripeIds = uniq(
    tuples
      .filter(([isAdmin, stripeId]) => isAdmin)
      .map(([isAdmin, stripeId]) => stripeId),
  );
  const last4s = await getLast4FromStripeIds(stripeIds);

  return tuples.map(([isAdmin, stripeId]) => {
    if (!isAdmin) return null;
    const index = stripeIds.indexOf(stripeId);
    return last4s[index];
  });
}
```

[dataloader]: https://github.com/graphql/dataloader
