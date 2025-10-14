# Grafast technical overview

Gra*fast* is a radical new approach to executing GraphQL requests.

Traditional servers execute the request field by field at runtime, discovering
data needs on the fly and thereby inviting over-fetching, under-fetching, and
the classic N+1 cascade (or the explosion of Promises needed to avoid it via
DataLoader).

Gra*fast* embraces GraphQL's declarative appearance. Plan resolvers describe
each field's requirements, Gra*fast* walks the document and assembles these
requirements into a draft execution plan, **eliminating over-fetching** by only
requesting what's needed. Optimisation phases remove duplication and fuse
related work, **eliminating under-fetching** by reducing the round-trips
required to your backend data stores. And at execution-time, each step in the
plan runs just once, **eliminating the N+1 problem** by design via built-in
batching which bypasses the need for one-promise-per-item that traditional
approaches such as DataLoader require.

## Parsing and validation

The act of parsing and validating the GraphQL query is currently out of scope of
Grafast, you should use graphql-js to provide these facilities. Passing a
GraphQL document into Grafast that has not been validated may lead to unexpected
results, infinite recursion, and various other issues - please ensure all
documents are validated!

## Planning

### Operation-plan reuse

Before we can execute a request Gra*fast* needs an operation plan (an execution
plan plus the output plan). Gra*fast* keeps a cache of operation plans keyed by
the schema, document, operation name, and a collection of tests over any values
inspected during planning.
If an existing entry passes every test for the incoming request we can skip
straight to execution; otherwise Gra*fast* must build a new operation plan
for the request.
This reuse is particularly powerful for subscriptions where thousands of
selection sets might execute in response to the same event.

#### Relationships between variables and operation plans

In general Gra*fast* defers evaluating variables until execution-time, so
different variable values do not usually trigger new operation plans.
Sometimes variables must be examined during planning though, and when this
happens Gra*fast* records tests alongside the cached plan.
Future requests that fail those tests will be planned again.

Directives such as `@skip`, `@include`, and `@stream` are common sources of this
behaviour.
Their arguments need to be evaluated while planning because they can change
which branches of the document are explored, thereby requiring distinct
operation plans.
If those arguments are provided via variables the cache entry tracks the
accepted values so that only compatible requests reuse the plan.

User-defined behaviour can have the same effect.
For example, if clients supply an `orderBy` argument that influences the SQL
you generate, planning may need to inspect that argument in order to build the
right step tree.
In these cases the tests should be as permissive as possible (for example
checking the shape of an input object rather than the exact values) to avoid a
proliferation of cache entries that hurt performance.

### Planning the request

When we need a new operation plan Gra*fast* walks the document and calls the
relevant code for each field, argument, directive, fragment, etc that it finds.
For fields, Gra*fast* will call the field's plan resolver, which...

TBC
