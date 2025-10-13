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

### The Aether

:: Before we can execute our plans we must first establish a context in which to
create the plans. We call this context the _Aether_.

*Aether*s may be shared between multiple GraphQL requests so long as they meet
the relevant requirements (based on matching {schema}, {document} and
{operationName}, and passing relevant tests on the values that they have
referenced within {variableValues} / {context} / {rootValue}).

Sharing Aethers across GraphQL requests allows us to batch execution of certain
plans across requests, leading to massively improved performance - especially
for subscription operations which may result in thousands of concurrent GraphQL
selection set executions all triggered at the same moment from the same pub/sub
event.

If a suitable existing Aether is found for a request then we can skip straight
to Execution, otherwise we must build an Aether.

#### Relationships between variables and Aethers

In general we do not evaluate variables until "execution time", and thus
different variable values will not result in different Aethers; however there
are situations when variable values must be evaluated at planning time, and this
will cause variable value tests to be attached to the Aether - if a future
request comes in that does not pass the tests of any existing Aethers then a new
Aether will be constructed.

An example of having to evaluate variables at planning time are with the
`@skip`, `@include` and `@stream` directives - the arguments to these directives
must be evaluated at planning time because the inputs to these directives may
cause plans to branch in different ways, and thus separate Aethers would be
required to represent them even for the same document. If the arguments to these
directive turn out to be variables then tests will be added to ensure that the
same Aether can only be used with the same values of these variables.

You may also have user code that needs to be evaluated at planning time, for
example if you allow GraphQL clients to specify the order in which rows are
pulled from the database then the variable that specifies this ordering may need
to be evaluated at planning time as it may effect the SQL query that is to be
generated for the request.

Another situation that may require tests to be added is when walking through
plannable input objects, however in these cases we don't require that the
objects are identical each time, instead the tests added enforce that the inputs
have the same "shape", for example the same number of entries in a list, or the
same property names in an object, but not necessarily what the values themselves
are.

In general, this "planning-time evaluation" of variables should be avoided as
much as possible, and where it cannot be then the checks added should be as
lenient (non-specific) as possible. If care is not taken, an explosion of the
number of Aethers can occur which will reduce performance significantly, and
will make it much more likely that the same document will need to be planned
many times.

### Planning the request

Now we have an Aether we must build the plan. Grafast will walk the document and
call the relevant code for each field, argument, directive, fragment, etc that
it finds. For fields, Grafast will call the field's plan resolver, which...

TBC
