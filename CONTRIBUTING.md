Contributing
============

Pull requests to PostGraphQL are welcome. To get started:

```
createdb postgraphql_test
npm run build
npm test
```

PostGraphQL uses Travis CI to test builds and enforce lint rules:
[travis-ci.org/calebmer/postgraphql](https://travis-ci.org/calebmer/postgraphql).

The codebase is documented via READMEs throughout the src folder heirarchy,
starting with [src/README.md](src/README.md). Contributions are also encouraged
where these files are missing or inadequate.

Commit messages
---------------

PostGraphQL team use [karma-style][] commit messages: a type
(feat/fix/chore/docs/etc), a scope (graphql/postgraphql/examples/tests) and
then the commit message. Commit messages are written in the imperative tense.

Here's a few examples:

```
feat(ci): run against multiple postgres versions
fix(postgraphql): fix opaque error messages
chore(docs): rename anonymous role to default role
```

Types:

- chore
- docs
- feat
- fix
- refactor
- style
- test

Scopes:

- *
- catalog
- ci
- collection
- connection
- contributing
- docs
- examples
- forumCatalog
- gitignore
- graphql
- interface
- library
- main
- package
- paginator
- postgraphql
- postgres
- procedures
- readme
- resolve
- scripts
- server
- tests
- typings
- typings
- vscode

New scopes can be added as necessary, when doing so please add them to this list.

[karma-style]: http://karma-runner.github.io/1.0/dev/git-commit-msg.html
