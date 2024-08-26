# each

Transforms a list by wrapping each element in the list with the given mapper.

Usage:

```ts
const $newList = each($oldList, ($listItem) => doSomethingWith($listItem));
```

## Extended Usage with `object`

You may end up in a scenario where you need to alter the return value of an opaque step. For example, when using a `PgSelect` step, you may end up with something like this in your plan:

```ts
const $users = usersResource.find();
const tbl = $users.alias;
$users.where(sql`${tbl}.username = 'Benjie'`);
return $users;
```

For this example, lets say you have a field you want to resolve to with a type that does not match the schema of the DB:

```graphql
type UsernameMapping {
  currentUsername: String!;
  currentEmail: String!;
}

```

In order to map these values to new keys, you could use something like this:

```ts
// return $users;
return each($users, ($user) => 
    object({
        currentUsername: $user.get('username'),
        currentEmail: $user.get('email')
    })
)
```