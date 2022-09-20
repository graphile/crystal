# jsonParse($string)

Returns a step that represents the `JSON.parse`'d value of the string. On null,
will return null. On error, will throw.

Usage:

```ts
const $parsed = jsonParse($jsonString);
```

A `JsonParseStep` has the following methods:

- `.get(key)` - gets the value for the key `key` assuming the parsed JSON value
  was an object
- `.at(index)` - gets the value at index `index` assuming the parsed JSON value
  was an array
