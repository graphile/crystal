# context

Returns a step representing the GraphQL contextValue.

Usage:

```ts
const $context = context();
```

The returned step has the following methods:

- `.get(key)` - gets the value for the key `key` assuming the parsed JSON value
  was an object
- `.at(index)` - gets the value at index `index` assuming the parsed JSON value
  was an array

## Typescript

Typescript declaration merging should be used to extend the default grafast context and make the usage of this step type safe in the plan resolvers. Here's an example:

```ts
declare global {
  namespace Grafast {
    interface Context {
      postgresClient: PostgresClient;
    };
  }
}
```

The code above would make accessing `context().get("postgresClient")` and its return value type-safe in the plan resolvers.
