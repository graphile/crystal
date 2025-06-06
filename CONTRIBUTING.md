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

### Install dependencies

Install the dependencies with `yarn`, and then run `yarn watch` which will
compile all the source code with `tsc` (TypeScript) and will keep watching the
filesystem for changes. (You can do `yarn build` for a one-time build if you
prefer.)

```bash
yarn
yarn watch # or 'yarn build'
```

### Ensure PostgreSQL is running

We assume you have a local PostgreSQL server running in "trust" authentication
mode. Other options may or may not work - you may need to set `PGHOST`,
`PGUSER`, `PGPASSWORD` and/or similar config variables.

If you don't have such a server, you can use docker to run it locally:

```bash
# Run a temporary postgres instance on port 6432
docker run --rm -it -e POSTGRES_HOST_AUTH_METHOD=trust -p 6432:5432 postgres:17 -c wal_level=logical
```

Note that this Docker will keep running until you kill it (e.g. with `Ctrl-C`)
and thus you will need to continue with a different terminal window.

Be sure to set the required environmental variables for this setup before you
attempt to run the tests; you will need these for each terminal window that you
attempt to run the tests from:

```bash
export PGUSER=postgres
export PGHOST=127.0.0.1
export PGPORT=6432
```

> [!TIP]
>
> If you want to keep the data between sessions, run docker in the background,
> or the above doesn't work for you, this version:
>
> - mounts permanent storage into `/var/run/postgresql`
> - detaches (runs in background)
> - explicitly uses host networking
>
> ```bash
> docker run -v /var/run/postgresql/:/var/run/postgresql/ --network host -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_HOST_AUTH_METHOD=trust -e POSTGRES_INITDB_ARGS='--auth-host=trust' -d postgres
> ```
>
> You'll need to indicate the PostgreSQL user to use:
>
> ```bash
> export PGUSER=postgres
> ```
>
> If you previously set PGHOST/PGPORT then you will need to reset these for this
> configuration too:
>
> ```bash
> export PGHOST=/var/run/postgresql/
> export PGPORT=5432
> ```

The command `psql` should now work (exit with `Ctrl-D`). We require this utility
to install the test fixtures; if you don't have `psql` installed, t you may
install it using your preferred package manager, for example:

```bash
sudo apt update && sudo apt install postgresql-client
```

### Setup the test database

You do not need to run this every time, but if you make changes to the SQL test
fixtures (or pull down any updates) then you will need to run it to apply your
changes.

```bash
yarn pretest
```

### Run the tests

Now you're ready to run the tests:

```bash
yarn test
```

> [!NOTE]
>
> This may make your fans (if you have any) spin a bit as it uses significant
> concurrency.

If the above succeeds, you're good to go! If not, please try again after running
`yarn install --force` and always feel free to reach out via
[our discord chat](http://discord.gg/graphile) on the #core-development channel.

### Platform specific quirks

#### macOS

macOS comes with an older version of `diff`. We rely on `diff` for snapshot
testing. Should your snapshot tests fail unexpectedly (for instance, with
varying line endings), consider updating `diff`.

You can make use of `homebrew` or other macOS package managers for this purpose.

Here's an example for `homebrew`:

```shell
brew install diffutils
```

### Update test snapshots

If you're contributing to our test suite, make sure you update (and then check!)
the test snapshots:

```shell
UPDATE_SNAPSHOTS=1 yarn test
```

If you're iterating you may want to test just a single file; to do so change
into the relevant folder and then run that single file with `jest` with
`UPDATE_SNAPSHOTS` enabled:

```shell
cd postgraphile/postgraphile
UPDATE_SNAPSHOTS=1 yarn jest __tests__/path/to/file.test.graphql
```

Note: you only need to create/change the `.test.graphql` file; the `.sql`,
`.mermaid` and `.json5` files are auto-generated snapshots. There will also be a
`.errors.json5` snapshot if the test does not include a
`## expect(errors).toBeFalsy();` comment.

If you're making planning updates (e.g. optimizations) that shouldn't affect the
resulting data, you can tell the system to only update certain types of
snapshots:

```shell
cd postgraphile/postgraphile
UPDATE_SNAPSHOTS="sql,mermaid" yarn jest __tests__/path/to/test.file.graphql
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
