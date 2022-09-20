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
