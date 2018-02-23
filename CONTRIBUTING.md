# Contributing

The PostGraphile project welcomes all contributors, we want to invest in you so
you can invest back into PostGraphile. Together we can make great software that
enables developers to build powerful applications in much less time then would
previously have been taken. This document aims to help you get started
contributing to the project.

As PostGraphile may be a piece of critical infrastructure in your app, it is
only fair to run the project as [OPEN Open Source](http://openopensource.org/).
If you contribute meaningful work to the PostGraphile project you will be made
a collaborator which allows you to create new branches and approve pull
requests.

To get started hacking on the codebase, make sure Postgres is listening on
`localhost:5432`, go to the project folder and then run the following to
install all dependencies and PostGraphile schemas into your default database:

```bash
yarn # or "npm install" if you prefer
scripts/run-kitchen-sink-sql
scripts/dev
```

The first script will install all dependencies of PostGraphile project. The
second script will add the kitchen sink SQL schemas (named `a`, `b`, and `c`)
to your default Postgres database at `localhost:5432`. The third script will
start PostGraphile in watch mode and open GraphiQL in your default browser.
Whenever you change the PostGraphile source code, the `scripts/dev` command
will restart the PostGraphile server. To manually restart the server type in
`rs` and hit enter while `scripts/dev` is running.

If you want to use a different database (e.g. after `createdb postgraphile`),
you can do so by passing the database URL to these commands, like this:

```bash
scripts/run-kitchen-sink-sql postgres://localhost:5432/postgraphile
scripts/dev -c postgres://localhost:5432/postgraphile
```

To start PostGraphile with arguments besides the defaults, just add them to
`scripts/dev` like so:

```bash
scripts/dev --schema forum_example --secret keyboard_kitten
```

## Tests

PostGraphile uses [Jest](http://facebook.github.io/jest/) for testing to take
advantage of Jest’s snapshot feature. To run PostGraphile tests you will need
to first create the `postgraphile_test` database in your Postgres instance
running on `localhost:5432`. To do so run the following:

```bash
createdb postgraphile_test
```

To run the full test suite run:

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
located in `src/postgraphile/graphiql`. When developing PostGraphile (running
`scripts/dev` only), GraphiQL will run on a different port to take advantage of
the `create-react-app` developer experience.

When we build PostGraphile before publishing (with `scripts/build`), GraphiQL
is built into a few JS, CSS, and HTML files then served by the PostGraphile
middleware people import into their projects.

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

* `chore`
* `docs`
* `feat`
* `fix`
* `refactor`
* `style`
* `test`

Common scopes are as follows. You are not required to use any of the following
scopes and may instead invent your own. These are just a few that get commonly
used.

* `*`
* `postgraphile`
* `graphql`
* `interface`
* `postgres`
* `package`
* `scripts`
* `examples`
* `ci`

## Resources

Here are some resources that will help you learn more about Postgres and
GraphQL so that you may understand more of what is going on inside
PostGraphile.

* [The Anatomy of a GraphQL Query.](https://dev-blog.apollodata.com/the-anatomy-of-a-graphql-query-6dffa9e9e747) This article provides the vocabulary you need to talk about a GraphQL query technically.
