# @graphile/lru

**You probably want [lru-cache](https://github.com/isaacs/node-lru-cache)
instead.**

This is an obsessively optimized LRU cache for Node.js, it forgoes features in
favour of performance, and is very marginally faster than node-lru-cache in
certain circumstances.

It is, however, quite straightforward. So if you want to study how an LRU works,
this is a simple example. It uses a doubly-linked-list and tracks both the head
and the tail.

## Usage

```js
import LRU from "@graphile/lru";

// Construct an LRU cache
const lru = new LRU({
  // Maximum number of items to store (required)
  maxLength: 500, // Must be an integer at least 2

  // Optional callback to handle when a value is removed (both when LRU becomes
  // full and when LRU is reset)
  dispose(key, value) {
    console.log(`Disposing of key '${key}' with value '${inspect(value)}'`);
  },
});

const ANY_VALUE_HERE = { randomNumber: () => 4 };
// Store a value
lru.set("<string_key_here>", ANY_VALUE_HERE);

// Retrieve a value
const value = lru.get("<string_key_here>");

// Clear the cache
lru.reset();
```

## Considering a pull request?

Pull requests that add features that aren't required by the Graphile suite are
unlikely to be entertained - use node-lru-cache instead!

Pull requests that improve performance should come with benchmarks, benchmark
scripts and explanation of technique. And if you pull it off without breaking
anything - YES PLEASE.

Pull requests that add documentation are welcome.
