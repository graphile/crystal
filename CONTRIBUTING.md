# Contributing

Thanks for your interesting in contributing to Graphile Engine!

First, and most importantly, contributions to Graphile are governed by the
Graphile Code of Conduct (which uses the Contributor Covenant); you can read it
here: https://www.graphile.org/postgraphile/code-of-conduct/

Following are some guidelines for contributions.

## Setting up a development environment

Please see [the CONTRIBUTING.md in PostGraphile](https://github.com/graphile/postgraphile/blob/master/CONTRIBUTING.md#development-environment).

## ASK FIRST!

There's nothing worse than having your PR with 3 days of work in it rejected
because it's just too complex to be sensibly reviewed! If you're interested
in opening a PR please open an issue to discuss it, or come chat with us: 
http://discord.gg/graphile

Sometimes, your suggestions are more appropriate as a plugin rather than in
core - if this is the case then we'll let you know and can guide you how to
achieve this. Sometimes it may make sense to change your PR into a series
of smaller PRs that each focus on changing one thing.

Small, focussed PRs are generally welcome without previous approval.

## Performance Matters

Graphile Engine performance is critical to a wide range of users; as such we
favour performance over legibility. This means that we typically eschew
immutability in favour of more performant operations (we only target the V8
engine in Node) and we tend to use explicit loops rather than functional
equivalents.

Typically we care more about the load on the Garbage Collector than we do on
the absolute performance of the code - so try and avoid allocations where
possible.

This said, we still want PostGraphile to be maintainable so code quality and
legibility is important. We're not super interested in micro-optimisations;
if you want to do a PR with performance enhancements that are more than a
couple lines of code, please come chat with us first.

### `Array.reduce(...)`

Prefer mutability in reduce. If you want to break out into a `for` loop that's
fine too - it's faster but does not reduce the load on the garbage collector
significantly.

```js
// Slow:
const result = ["a", "b", "c"].reduce(
  (memo, letter) => ({ ...memo, [letter]: true }),
  {}
);

// Faster:
const result = ["a", "b", "c"].reduce((memo, letter) => {
  memo[letter] = true;
  return memo;
}, {});

// Fastest:
const result = {};
for (const letter of ["a", "b", "c"]) {
  result[letter] = true;
}
```

### `String.endsWith(...)` vs regexp

Regexps that end with `$` like `/_id$/` are typically fairly expensive (much
more so than regexps that lock the start `/^foo_`); is generally more efficient
to do `.endsWith('_id')` when appropriate, but use whatever makes sense.

### DRY

Try to avoid repeating yourself - by putting shared logic into a shared
function, V8 can perform shared JIT optimisations and ultimately this should 
mean that the code runs faster (and uses less memory).

### Leverage ES6

Graphile Engine currently requires at least Node 8.6+; this means we get access
to a lot of ES6 goodness. Use https://node.green/ to check what we have access
to.

- `Object.values(obj)` is better than `Object.keys(obj).map(k => obj[k])`.
- `arr.find(...)` is better than `arr.filter(...)[0]`
- use `async`/`await` - [performance optimisations are coming](https://v8.dev/blog/fast-async)
