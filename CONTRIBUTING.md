# Contributing
The PostGraphQL project welcomes all contributors, we want to invest in you so you can invest back into PostGraphQL. Together we can make great software that enables developers to build powerful applications in much less time then would previously have been taken. This document aims to help you get started contributing to the project.

As PostGraphQL may be a piece of critical infrastructure in your app, it is only fair to run the project as [OPEN Open Source](http://openopensource.org/). If you contribute meaningful work to the PostGraphQL project you will be made a collaborator which allows you to create new branches and approve pull requests.

The codebase is documented via READMEs throughout the `src` folder heirarchy, starting with [`src/README.md`](src/README.md). Contributions are also encouraged where these files are missing or inadequate.

To get started hacking on the codebase, make sure Postgres is listening on `localhost:5432`, go to the project folder and then run the following to install all dependencies and PostGraphQL schemas into your default database:

```bash
npm install
scripts/run-kitchen-sink-sql
scripts/dev
```

The first script will install all dependencies of PostGraphQL project. The second script will add the kitchen sink SQL schemas (named `a`, `b`, and `c`) to your default Postgres database at `localhost:5432`. The third script will start PostGraphQL in watch mode and open GraphiQL in your default browser. Whenever you change the PostGraphQL source code, the `scripts/dev` command will restart the PostGraphQL server. To manually restart the server type in `rs` and hit enter while `scripts/dev` is running.

If you want to use a different database (e.g. after `createdb postgraphql`), you can do so by passing the database URL to these commands, like this:

```bash
scripts/run-kitchen-sink-sql postgres://localhost:5432/postgraphql
scripts/dev -c postgres://localhost:5432/postgraphql
```

To start PostGraphQL with arguments besides the defaults, just add them to `scripts/dev` like so:

```bash
scripts/dev --schema forum_example --secret keyboard_kitten
```

## Tests
PostGraphQL uses [Jest](http://facebook.github.io/jest/) for testing to take advantage of Jest’s snapshot feature. To run PostGraphQL tests you will need to first create the `postgraphql_test` database in your Postgres instance running on `localhost:5432`. To do so run the following:

```bash
createdb postgraphql_test
```

To run the full test suite run:

```bash
scripts/test
```

When developing PostGraphQL, we recommend using the Jest watch mode feature. So instead you would run tests like so:

```bash
scripts/test --watch
```

Now, only the tests in the files you have changed will be run. There are some slow tests in the PostGraphQL suite so hopefully this should make your development time faster. Once you are in watch mode, Jest will present you with some options you can use to better configure your testing experience.

### Snapshots
PostGraphQL makes use of the Jest snapshot feature. Even when you change small things in PostGraphQL the snapshot tests are likely to fail. This is OK, the snapshot tests are expected to fail. To make the snapshot tests pass again, run `scripts/test --watch` and then press `u` once the initial tests have run. Or run `scripts/test --updateSnapshot`. This will rerun the tests and change the snapshot files in the repository. Commit the changes to the snapshots and the changed snapshots will be reviewed along with the rest of your changes in the PR review process.

### Linting
PostGraphQL uses [TSLint](http://palantir.github.io/tslint/) and Travis CI to test builds and enforce lint rules:
[travis-ci.org/calebmer/postgraphql](https://travis-ci.org/calebmer/postgraphql).

## GraphiQL
The instance of GraphiQL used by PostGraphQL is a [`create-react-app`](https://github.com/facebookincubator/create-react-app) located in `src/postgraphql/graphiql`. When developing PostGraphQL (running `scripts/dev` only), GraphiQL will run on a different port to take advantage of the `create-react-app` developer experience.

When we build PostGraphQL before publishing (with `scripts/build`), GraphiQL is built into a few JS, CSS, and HTML files then served by the PostGraphQL middleware people import into their projects.

## Commit messages
PostGraphQL team use [karma-style](http://karma-runner.github.io/1.0/dev/git-commit-msg.html) commit messages: a type
(`feat`/`fix`/`chore`/`docs`/etc.), a scope (`graphql`/`postgraphql`/`examples`/`tests`) and
then the commit message. Commit messages are written in the imperative tense.

Here’s a few examples:

```
feat(ci): run against multiple postgres versions
fix(postgraphql): fix opaque error messages
chore(docs): rename anonymous role to default role
```

When comitting to a branch or a PR you do not need to adhere to this format. However, all commits to the `master` branch *must* be in this format. Often all of the commits in a PR will be squashed and a commit message of this format will be written to summarize the changes.

You must use one of the following types:

- `chore`
- `docs`
- `feat`
- `fix`
- `refactor`
- `style`
- `test`

Common scopes are as follows. You are not required to use any of the following scopes and may instead invent your own. These are just a few that get commonly used.

- `*`
- `postgraphql`
- `graphql`
- `interface`
- `postgres`
- `package`
- `scripts`
- `examples`
- `ci`

## Resources

Here are some resources that will help you learn more about Postgres and GraphQL so that you may understand more of what is going on inside PostGraphQL.

- [The Anatomy of a GraphQL Query.](https://dev-blog.apollodata.com/the-anatomy-of-a-graphql-query-6dffa9e9e747) This article provides the vocabulary you need to talk about a GraphQL query technically.
