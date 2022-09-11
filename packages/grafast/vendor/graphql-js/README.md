# graphql-js test suite

This folder contains select tests and supporting files from graphql-js with very
minimal modifications (mostly calling out to Grafast's `graphql` and `execute`
methods instead of GraphQL.js', and referencing the GraphQL resources from the
`graphql` module rather than via relative paths) in order to check that Grafast
is compatible with GraphQL.js schemas/resolvers.

To run the tests:

```
yarn mocha 'vendor/graphql-js/**/*-test.ts'
```
