# Users and Friends example

This is a trivial example built for the Grafast introduction to compare and
contrast a DataLoader-based schema and a plan-based schema.

We're trying to demonstrate how the business logic is separate from the
resolvers and plan resolvers, so we've attempted to create a clean separation:

- [./businessLogic.mjs](./businessLogic.mjs) contains the business logic that your
  GraphQL API, REST API, worker, etc might all call into. The logic in this
  should not know about the technology that is calling it.
- [./database.mjs](./database.mjs) contains access to the database; we're actually
  using a tiny in-memory SQLite database that we create on demand, but that's
  not particularly important. This database should only be accessed by the
  `businessLogic` - never by the resolvers/plan resolvers directly.
- [./dataloaders.mjs](./dataloaders.mjs) contains the DataLoaders that power the
  GraphQL.js based schema
- [./plans.mjs](./plans.mjs) contains the plans that power the Grafast based
  schema
- [./index.mjs](./index.mjs) is where the GraphQL schemas are built and executed

## `node index.mjs`

Running this will run the example query through the GraphQL.mjs schema and the
Grafast schema, and will ensure that the stringified data matches.

## Benchmarks

The above script can be used for benchmarking by appending the mode (see below).

To make it fair, I've cached the parse and validate results and am only
benchmarking execute. I've built a schema that uses DataLoader (schemaDL) and an
identical schema that uses plans (schemaGF, which only Grafast can execute).

### `node index.mjs graphql`

This will run the query through GraphQL.js against the DataLoader-based schema
10,000 times and output how long it took.

### `node index.mjs grafast-resolvers`

This will run the query through Grafast against the exact same DataLoader-based
schema as above 10,000 times and output how long it took.

### `node index.mjs grafast`

This will run the query through Grafast against the plan-based schema 10,000
times and output how long it took.

### I'm too lazy to run it... give me the results

Running each script 3 times and picking the best result for each, we get the
following:

```
GraphQL's execute / schemaDL: 7180ms
Grafast's execute / schemaDL: 6551ms
Grafast's execute / schemaGF: 5072ms
```

## `node index.mjs docs`

Runs a simplified query via Grafast and writes the plan to
[./plan.mermaid](./plan.mermaid).
