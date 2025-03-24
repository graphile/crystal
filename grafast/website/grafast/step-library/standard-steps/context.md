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

## TypeScript

TypeScript declaration merging should be used to detail the properties you are
making available on GraphQL context such that usage of this step is type safe in
plan resolvers. For example:

```ts
declare global {
  namespace Grafast {
    interface Context {
      currentUserId?: number;
    }
  }
}
```

The code above would mean that `context().get("currentUserId")` returns
`Step<number | undefined>`, thereby making its usage in plan resolvers type
safe.
