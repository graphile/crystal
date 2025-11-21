---
title: "Glossary"
sidebar_position: 999999998
---

:::info[Work in progress]

Feel free to add more terms and/or definitions via pull requests!

:::

# Glossary

## GraphQL Terms

### (GraphQL) context

Data passed by the GraphQL server into execution that provides additional
context about the running request, for example:

- authn/authz info about the user running the request
- environmental information about the request (remote IP, preferred language,
  etc)
- security tokens
- API and database clients
- dataloaders (not needed for Gra*fast*!)
- etc

This is the `contextValue` passed to `graphql({...})` or `grafast({...})`, and
is also the third argument to a [traditional resolver](#traditional-resolver).
In a [plan resolver](#plan-resolver), a step representing the context can be
retrieved through [`context()`](./standard-steps/context.md).

### (GraphQL) document

As [defined in the GraphQL spec](https://spec.graphql.org/draft/#sec-Document).
Typically an executable document.

### (GraphQL) executable document

A [document](#graphql-document) consisting only of executable definitions
(operation and fragment definitions), as [defined in the GraphQL
spec](https://spec.graphql.org/draft/#ExecutableDocument).

### (GraphQL) mutation

An operation to mutate data,
as [defined in the GraphQL spec](https://spec.graphql.org/draft/#sec-Mutation).

### (GraphQL) operation

Typically refers to an operation definition (and associated fragments) within a
GraphQL executable document ([GraphQL spec
reference](https://spec.graphql.org/draft/#sec-Language.Operations)).

### (GraphQL) operation type

A GraphQL [OperationType](https://spec.graphql.org/draft/#OperationType): `query`, `mutation` or `subscription`

### (GraphQL) query

An operation to fetch data,
as [defined in the GraphQL spec](https://spec.graphql.org/draft/#sec-Query).

### GraphQL request

As defined in the GraphQL spec as ["a request for
execution"](https://spec.graphql.org/draft/#request).

- `schema` - the GraphQL schema
- `document` - the GraphQL [document](#document)

### GraphQL response

As [defined in the GraphQL spec](https://spec.graphql.org/draft/#sec-Response).

### (GraphQL) subscription

An operation to subscribe to an event stream,
as [defined in the GraphQL spec](https://spec.graphql.org/draft/#sec-Subscription).

### (Traditional) resolver

A `resolve` function that you might see in a traditional GraphQL.js schema;
typically following [the ResolveFieldValue algorithm in the GraphQL
spec](<https://spec.graphql.org/draft/#ResolveFieldValue()>).

## Gra*fast* Terms

### Abstract type plan resolver

See [`planType`](./polymorphism.mdx#plantype).

### Argument plan resolver

See [Argument plan resolvers](./index.mdx#argument-plan-resolvers).

### Batch execution value

An [execution value](#execution-value) that represents a batch of values.
`ev.isBatch` will be `true`, and data can be accessed via `ev.at(index)` for
each index in the batch size (`executionDetails.count`).

### Bucket

Stores the data for a [layer plan](#layer-plan) during execution of an
individual request. Contains the execution state of each step in the layer plan
along with its [execution value](#execution-value), and also stores links to
other buckets such that the [output plan](#output-plan) may later traverse to
access the data.

When the context is clearly plan-time, it's common to use the term "bucket" as a
short-hand for "layer plan". This isn't technically correct, but is
convenient.

### Field plan resolver

See [Field plan resolvers](./index.mdx#field-plan-resolvers).

A simple JavaScript function that runs at [plan-time](#plan-time) to determine
a step that satisfies the requirements for a given field. May infolve the
creation of zero or more steps in the draft execution plan.

### Execution plan

A directed acyclic graph of steps that detail the actions to take for execution
of a GraphQL request. Part of the [operation plan](#operation-plan). Also
details the [layer plans](#layer-plan) within, and their relationships.

### Execution-time

One a plan has been established, it can be executed. A plan is executed for each
valid GraphQL request; the period of time during which a plan is executed is
called "execution-time".

### Execution value

The execution-time storage of all the values for a step, used as input to the
`execute` method of a [step class](#step-class). Typically represented by the
variable name `ev`. For unary steps this will be a [unary execution
value](#unary-execution-value), for all other steps it will be a [batch
execution value](#batch-execution-value).

### Layer plan

Every [step](#step) belongs to exactly one layer plan within the execution plan.
The root layer plan represents request data and always
has a batch size of 1; any time the batch size might change (up or down), a new
layer plan is introduced to handle this transition - normally this will be a
result of traversing types and selections in the GraphQL request.

Layer plans are a plan-time concern; when executing an individual request a
[bucket](#bucket) stores the data for a layer plan.

See: [Layer plans](./operation-plan.mdx#layer-plans).

### Lifecycle methods

[Step classes](#step-class) contain methods for handling key events during their
lifecycle:

- `deduplicate` to help eliminate redundant work
- `deduplicatedWith` when a step is disposed of due to deduplication
- `optimize` to allow a step to talk to its ancestors, request they do
  additional work, and replace itself with a step that does less work
- `finalize` to allow a step to do any "once only" (**not** once per request)
  actions such as compiling SQL statements to text or hashing parameters
- `execute` to produce (synchronously or asynchronously) the result data from
  the [execution values](#execution-value) for each of its dependencies.

### Operation plan

The combination of an [execution plan](#execution-plan) and [output
plan](#output-plan) that details how to execute and output the result of a
_GraphQL request_.

### Output plan

Details how to take data from the [steps](#step) executed as part of the
[execution plan](#execution-plan) for an individual _GraphQL request_ and format
them into a valid _GraphQL response_.

### Plan diagram

Any visual representation of an [operation plan](#operation-plan) or subset
thereof. Typically this is a render of the steps and layer plans in an execution
plan via the Mermaid library.

### Plan resolver

One of:

- [field plan resolver](#field-plan-resolver) (most common)
- [argument plan resolver](#argument-plan-resolver)
- [abstract type plan resolver](#abstract-type-plan-resolver)

### Plan-time

Before a GraphQL request can be executed, an operation plan is required.
Operation plans can be reused, but if a suitable plan is not available then one
is built; the period of time during which a plan is built is called "plan-time".

### Step

The building block of an execution plan. A particular action or transform
performed as part of executing a _GraphQL request_. An instance of a [step
class](#step-class). By convention, steps are stored into variables that are
named with a `$` prefix. Each step belongs to exactly one [layer
plan](#layer-plan). A step is a plan-time representation of a specific value
(for example "a Post's author ID") (reminder: plans, and thus steps, are reused across
requests). When executing an individual request, the data for a step is stored in
an [execution value](#execution-value) which contains the full batch of values
the step represents (for example "the author IDs of all the returned Posts").

### Step class

The backing logic of a step, see [step classes](./step-classes.mdx). Implements
the [lifecycle methods](#lifecycle-methods).

### Step function

A function that returns a step (often by instantiating a step class or by
calling other step functions).

### Unary execution value

An [execution value](#execution-value) that represents exactly one value.
`ev.isBatch` will be `false`, and data can be accessed via `ev.unaryValue()`.
Like a batch execution value, data can also be accessed via `ev.at(index)` for
each index in the batch size, but the return result of all of these will be
identical since there is only one value (it's shared across all indexes in the
batch).

### Unary step

A step that will always have exactly one value when executing a request (i.e.
does not require batching). Includes constants, field arguments, the GraphQL
context, the root value, and many values derived from these. At execution time,
the data will be stored into a [unary execution value](#unary-execution-value).
