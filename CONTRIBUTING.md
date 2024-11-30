# Contributing

Thanks for your interesting in contributing to Graphile's GraphQL libraries!

First, and most importantly, contributions to Graphile are governed by the
Graphile Code of Conduct (which uses the Contributor Covenant); you can read it
here: https://www.graphile.org/postgraphile/code-of-conduct/

Following are some guidelines for contributions.

## Setting up a development environment

We use `yarn` to manage this monorepo; we strongly recommend that you only use
`yarn` when dealing with it - not `npm`, `pnpm` or similar. (Not because these
technologies are in any way inferior to `yarn`, simply because they're not 100%
compatible with each other and we require that you use `yarn` to contribute.)

Install the dependencies with `yarn`, and then run `yarn watch` which will
compile all the source code with `tsc` (TypeScript) and will keep watching the
filesystem for changes. (You can do `yarn build` for a one-time build if you
prefer.)

```bash
yarn
yarn watch # or 'yarn build'
```

We assume you have a local PostgreSQL server running in "trust" authentication
mode. Other options may or may not work - you may need to set `PGHOST`,
`PGUSER`, `PGPASSWORD` and/or similar config variables.

If you don't have such a server, you can use docker to run it locally:

```bash
docker run -v /var/run/postgresql/:/var/run/postgresql/ --network host -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_HOST_AUTH_METHOD=trust -e POSTGRES_INITDB_ARGS='--auth-host=trust'  -d postgres
# Make sure you set PGUSER in your shell session
export PGUSER=postgres
```

We also assume you have `psql` on your machine, if you don't you may install it using your preferred package manager, for example:

```bash
sudo apt update && sudo apt install postgresql-client
```

First run the database reset procedure: `yarn pretest`

Now you're ready to run the tests with `yarn test`

If the above succeeds, you're good to go! If not, please try again after running
`yarn install --force` and always feel free to reach out via
[our discord chat](http://discord.gg/graphile) on the #core-development channel.

### Platform specific quirks

#### macOS

macOS comes with an older version of `diff` by standard. We rely on `diff` for
snapshot testing. Should your snapshot tests fail unexpectedly (for instance,
with varying line endings), consider updating `diff`.

You can make use of `homebrew` or other macOS package managers for this purpose.

Here's an example for `homebrew`:

```shell
brew install diffutils
```

## ASK FIRST!

There's nothing worse than having your PR with 3 days of work in it rejected
because it's just too complex to be sensibly reviewed! If you're interested in
opening a PR please open an issue to discuss it first, or come chat with us:
http://discord.gg/graphile

Sometimes, your suggestions are more appropriate as a plugin rather than in
core - if this is the case then we'll let you know and can guide you how to
achieve this. Often it may make sense to change your PR into a series of smaller
PRs that each focus on changing one thing.

Small, focussed PRs are generally welcome without previous approval.

Please **do not include refactoring** of existing code in a PR that adds a
feature - you should always aim for PRs to change as few lines of code as
possible to make them easier to review and iterate. If refactoring is necessary,
it often makes sense to raise this refactoring in a separate PR (or series of
PRs) so that it can be reviewed/merged separately.

## Performance Matters

At Graphile we're obsessed with performance, and it is critical to a wide range
of our users; as such we favour performance over legibility. This means that we
typically eschew immutability in favour of more performant operations and we
tend to use explicit loops rather than functional equivalents. Most of our
optimisations are focussed around the V8 engine (and Node.js in particular).

Typically we care more about the load on the Garbage Collector than we do on the
absolute performance of the code - so try and avoid allocations where possible.

This said, we still want our software to be maintainable so code quality and
legibility is important. We're not super interested in micro-optimisations; if
you want to do a PR with performance enhancements that are more than a couple
lines of code, please come chat with us first. If your PR is to improve
performance, you should include before/after benchmarks and a script that shows
how to reproduce the results.

### `Array.reduce(...)`

Prefer mutability in reduce. If you want to break out into a `for` loop that's
fine too - it's faster but does not reduce the load on the garbage collector
significantly.

```js
// Slow:
const result = ["a", "b", "c"].reduce(
  (memo, letter) => ({ ...memo, [letter]: true }),
  {},
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

### Leverage ES2021

Graphile's software typically requires at least Node 16; this means we get
access to a lot of ES2021 goodness. Use https://node.green/ to check what we
have access to.

- `Object.values(obj)` is better than `Object.keys(obj).map(k => obj[k])`.
- `arr.find(...)` is better than `arr.filter(...)[0]`
- use `async`/`await` - [it's fast!](https://v8.dev/blog/fast-async)
