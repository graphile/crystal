# Grafast technical overview

Gra*fast* is a radical new approach to executing GraphQL requests.

Traditional servers execute the request field by field at runtime, discovering
data needs on the fly and thereby inviting over-fetching, under-fetching, and
the classic N+1 cascade (or the explosion of Promises needed to avoid it via
DataLoader).

Gra*fast* embraces GraphQL's declarative appearance. Plan resolvers describe
each field's requirements, Gra*fast* walks the document and assembles these
requirements into a draft execution plan, **eliminating over-fetching** by only
requesting what's needed from your business logic. Optimisation phases remove
duplication and fuse related work, **eliminating under-fetching** by reducing
the round-trips required to your backend data stores. And at execution-time,
each step in the plan runs just once, **eliminating the N+1 problem** by design
via built-in batching, the efficient design of which does away with the need for
one-promise-per-item that traditional approaches such as DataLoader require.

## Parsing and validation

The act of parsing and validating the GraphQL query is currently out of scope of
Gra*fast*, you should use graphql-js to provide these facilities. Passing a
GraphQL document into Gra*fast* that has not been validated may lead to
unexpected results, infinite recursion, and various other issues - please ensure
all documents are validated!

## Planning

To process a request, Gra*fast* needs an **operation plan** (the combination of
execution plan and output plan).

First it will check through its operation plan cache (keyed by the schema,
document, and operation name[^1]), and if it finds a match it can skip directly
to execution!

[^1]:
    Technically the cache also factors in constraints, typically related to the
    values of variables, detailing whether or not a plan can be reused. These
    constraints are being phased out; they have already been removed from all
    user-facing code, but at time of writing they're still used internally to
    implement the `@skip` and `@include` directives. We plan to remove this
    entirely as Gra*fast* continues to develop.

To establish a plan for a never-seen-before operation, Gra*fast* walks the
document and calls the relevant "plan resolver" for each field, argument, and
abstract type that it finds. For fields, Gra*fast* will call the field's plan
resolver, which...
