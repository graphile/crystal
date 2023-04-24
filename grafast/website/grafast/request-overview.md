---
sidebar_position: 8
---

# Request overview

:::caution

The following deliberately over-simplifies the inner workings of <grafast /> by
focussing on single-payload GraphQL requests rather than those that return
streams. The aim is to give you a general feel for how the system works.

:::

For a straightforward GraphQL request (one that does not return a stream), the
request cycle looks something like this:

1. Receive and parse request from user
2. Find or build operation and output plans
3. Execute operation and output plan
4. Return data to user

## Receive and parse request

Essentially the same as in a graphql-js system with the slight tweak that we
cache the parsing of the document.

## Getting the operation plan

When <grafast /> sees an operation for the first time, it builds an [operation
plan][]. Whilst building the operation plan, it may have also determined
particular constraints that a future request must satisfy in order to use this
same operation plan; for example if the request contained `@skip(if: $variable)`
then a different operation plan would be needed depending on whether `$variable`
was `true` or `false`. Where possible, constraints are kept as narrow as
possible - for example "variable $foo is a list" is preferred over "variable
$foo
is the list [1,2,3]" - to maximize reuse.

When an operation is seen a future time, <grafast/> looks for an existing
operation plan whose constraints fit the request. If there is one then this
operation plan can be executed, otherwise a new operation plan is created (see
previous paragraph).

## Execute operation and output plan

&ZeroWidthSpace;<grafast /> will populate the relevant system steps in the plan
with the variables, context value, root value, etc and will then execute the
plan, the execution flowing down through the operation plan's step graph,
executing each step exactly once (and sometimes in parallel with other steps)
until all steps have been executed. Since each step is only executed once per
request, the execution must process all of the data in a batch. Thus, it is fed
a list of data from each of its dependencies, and it must return a
corresponding list of data that its dependents may themselves consume.

Once the operation plan has executed to completion, the values gathered are ran
through the output plan to produce the output. Typically this is a JSON object,
however for an optimization <grafast /> may optionally output stringified JSON
instead without ever building the intermediary JavaScript objects.

:::note

When the operation involves streams, the relevant execution and output plan
steps take place for each element of the stream(s).

:::

[plan resolvers]: ./plan-resolvers
[argument applyplan resolvers]: ./plan-resolvers#applyplan-plan-resolvers

## Returning data to user

This can be the same as in a graphql-js project, but <grafast /> also supports
an optimized strategy for stringifying the result should you need to do so
(e.g. if you are serving the request over HTTP). For this reason, we recommend
that you use `stringifyPayload` rather than `JSON.stringify` on the results
before sending to the user.

```ts
import { stringifyPayload, grafast } from "grafast";

const result = await grafast(/*...*/);
console.log(stringifyPayload(result));
```

[dataloader]: https://github.com/graphql/dataloader
[graphql-js]: https://github.com/graphql/graphql-js
[operation plan]: ./operation-plan
