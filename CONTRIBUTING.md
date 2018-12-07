# Contributing

The PostGraphile project welcomes all contributors, we want to invest in you so
you can invest back into PostGraphile. Together we can make great software that
enables developers to build powerful applications in much less time then would
previously have been taken. This document aims to help you get started
contributing to the project.

## Development environment

Since PostGraphile is mostly powered by Graphile Engine the best way to
develop it is to do it in the context of a Graphile Engine build so that you
may dig into the depths if you need to.

To get started:

```bash
npm install -g yarn # Use the latest yarn

# Clone and setup Graphile Engine
git clone git@github.com:graphile/graphile-engine.git
cd graphile-engine
yarn

# Clone and setup PostGraphile *inside* of graphile-engine
git clone git@github.com:graphile/postgraphile.git
cd postgraphile
yarn
# Remove our dependencies that are instead served by the local Graphile Engine
./rmlocal.sh
```

Make sure you read the instructions on developing Graphile Engine, in
particular remember to run `yarn watch` in the `graphile-engine` folder to
keep transpiling the module sources.

## Running development PostGraphile

Next make sure Postgres is listening on `localhost:5432`, change into the
`postgraphile` folder, then you can run the `scripts/dev`:

```bash
scripts/dev -- -c my_db -s my_schema --watch --enhance-graphiql
```

The `--` makes scripts/dev act more like a regular build - i.e. exiting on
the `-X` commands or when an error occurs.

Run the above **without** the `--` may be preferable in many cases - this
uses `nodemon` so that then whenever you change the PostGraphile source code,
the `scripts/dev` command will restart the PostGraphile server. To manually
restart the server type in `rs` and hit enter while `scripts/dev` is running.

## Updating

When updating, from the `graphile-engine` folder:

```bash
# Pull changes, install updates
git pull --rebase
yarn

# Pull changes, install updates for postgraphile too
cd postgraphile
git pull --rebase
yarn
# Re-delete the modules that we want served by graphile-engine instead
./rmlocal.sh
```

## Tests

PostGraphile uses [Jest](http://facebook.github.io/jest/) for testing to take
advantage of Jest’s snapshot feature. To run PostGraphile tests you will need
to first create the `postgraphile_test` database in your Postgres instance
running on `localhost:5432`. To do so run the following:

```bash
createdb postgraphile_test
```

To run the PostGraphile test suite run:

```bash
scripts/test
```

When developing PostGraphile, we recommend using the Jest watch mode feature.
So instead you would run tests like so:

```bash
scripts/test --watch
```

Now, only the tests in the files you have changed will be run. There are some
slow tests in the PostGraphile suite so hopefully this should make your
development time faster. Once you are in watch mode, Jest will present you with
some options you can use to better configure your testing experience.

If you change Graphile Engine, don't forget to run the Graphile Engine tests.
These require a `TEST_DATABASE_URL` envvar to be set, the database pointed to
by this will be overwritten. For historical reasons, Benjie uses `pggql_test`.

### Snapshots

PostGraphile makes use of the Jest snapshot feature. Even when you change small
things in PostGraphile the snapshot tests are likely to fail. This is OK, the
snapshot tests are expected to fail. To make the snapshot tests pass again, run
`scripts/test --watch` and then press `u` once the initial tests have run. Or
run `scripts/test --updateSnapshot`. This will rerun the tests and change the
snapshot files in the repository. Commit the changes to the snapshots and the
changed snapshots will be reviewed along with the rest of your changes in the
PR review process.

### Linting

PostGraphile uses [TSLint](http://palantir.github.io/tslint/) and Travis CI to
test builds and enforce lint rules:
[travis-ci.org/graphile/postgraphile](https://travis-ci.org/graphile/postgraphile).

## GraphiQL

The instance of GraphiQL used by PostGraphile is a
[`create-react-app`](https://github.com/facebookincubator/create-react-app)
located in `postgraphiql`. When developing PostGraphile (running
`scripts/dev` only), GraphiQL will run on a different port to take advantage of
the `create-react-app` developer experience.

When we build PostGraphile before publishing (with `scripts/build`), GraphiQL
is built into a resources served by the PostGraphile middleware people import
into their projects.

## Commit messages

PostGraphile team use
[karma-style](http://karma-runner.github.io/1.0/dev/git-commit-msg.html) commit
messages: a type (`feat`/`fix`/`chore`/`docs`/etc.), a scope
(`graphql`/`postgraphile`/`examples`/`tests`) and then the commit message.
Commit messages are written in the imperative tense.

Here’s a few examples:

```
feat(ci): run against multiple postgres versions
fix(postgraphile): fix opaque error messages
chore(docs): rename anonymous role to default role
```

When committing to a branch or a PR you do not need to adhere to this format.
However, all commits to the `master` branch _must_ be in this format. Often all
of the commits in a PR will be squashed and a commit message of this format
will be written to summarize the changes.

You must use one of the following types:

- `chore`
- `docs`
- `feat`
- `fix`
- `refactor`
- `style`
- `test`

Common scopes are as follows. You are not required to use any of the following
scopes and may instead invent your own. These are just a few that get commonly
used.

- `*`
- `postgraphile`
- `graphql`
- `interface`
- `postgres`
- `package`
- `scripts`
- `examples`
- `ci`

## Resources

Here are some resources that will help you learn more about Postgres and
GraphQL so that you may understand more of what is going on inside
PostGraphile.

- [The Anatomy of a GraphQL Query.](https://dev-blog.apollodata.com/the-anatomy-of-a-graphql-query-6dffa9e9e747) This article provides the vocabulary you need to talk about a GraphQL query technically.
