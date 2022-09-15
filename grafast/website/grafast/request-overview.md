# Request overview

:::caution

The following deliberately over-simplifies the inner workings of Gra*fast* by
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

:::tip

If you're unfamiliar with GraphQL terminology such as "selection set", "field",
"type" and so on, please check out our
[Operation Language](https://learn.graphile.org/docs/GraphQL_Operation_Cheatsheet.pdf)
and
[Schema Language](https://learn.graphile.org/docs/GraphQL_Schema_Language_Cheatsheet.pdf)
cheatsheets.

:::

When Gra*fast* sees an operation for the first time, it walks the selection sets
calling the user-provided `plan` method for each field to determine the _steps_
that need to be executed for that field. That series of steps, which we'll call
the _field plan_, is then woven with all the other field plans in the operation,
to form a directed acyclic graph we call the _operation plan_. Whilst doing
this, Gra*fast* keeps track of which fields returned which steps, and uses this
information to form the _output plan_. Finally the _operation plan_ is optimized
and finalized and the _output plan_ is finalized, then they are ready for
execution.

Whilst Grafast was building the operation plan, it may have also determined
particular constraints that govern whether the operation plan may be used for a
future request or not. For example, if the request contained
`@skip(if: $variable)` then a different operation plan would be needed depending
on whether `$variable` was `true` or `false`. Where possible, constraints are
kept as narrow as possible - for example "variable
$foo is a list" is preferred over "variable
$foo is the list [1,2,3]" - to
maximize reuse.

When an operation is seen a future time, Grafast looks for an existing operation
plan whose constraints fit the request. If there is one then this operation plan
can be executed (skip to next section), otherwise a new operation plan is
created (see previous paragraphs).

### Step classes

A step class is a JavaScript class that has an `execute` method. It may,
optionally, implement other Grafast lifecycle methods, and other accessors and
similar that child field plans may call.

Grafast provides a number of standard step classes that schemas may use, but
step classes whose names start with two underscores (`__`) are Grafast internals
and must not be used. Schema designers are also encouraged to write their own
step classes, and/or use step classes made available in other packages.

### Steps

A step is an instance of a specific _step class_, produced during the planning
of an operation. Each step may depend on 0 or more other steps, and through
these dependencies ultimately form a directed acyclic graph which we refer to as
the _operation plan_.

### Field plan method

Each field in the schema may implement a `plan` method, and at operation
planning time each time this field is referenced it may be called, with Grafast
passing the resulting step of the parent plan[^1], and a "field args" object.
The method may create as many intermediate steps as it likes, but it must return
exactly one step that its children may use (or, in the case of a leaf, that may
be used by the output plan).

[^1]:
    The resulting step will be the returned step from the parent field when that
    field has an object type, but when the field has a list or polymorphic type
    the resulting step will likely differ. This is covered in another section of
    the documentation. (TODO: which other section?)

In the case of a field that has a polymorphic type, the step that is returned
must be a polymorphic-capable plan.

In the case of a field that has a list type, the step that is returned must
produce lists when executed.

If the field accepts arguments, Grafast will look through any arguments that
weren't explicitly used during the `plan` method, and if they have a `plan`
method it will plan those too.

Once the field is fully planned, Grafast will _deduplicate_ the steps it has
produced against the other steps in the operation plan.

### Optimize

Once every selection set has been fully visited, the operation plan is complete.
At this point, Grafast optimizes the plan by calling the `optimize` lifecycle
method on each step that supports it. This gives steps a chance to replace
themselves with more optimal forms by inspecting and interacting with their
ancestors.

:::info

For example if a "first" step is to optimize itself, and its parent is a "list"
step, then it can simply replace itself with the first entry in the list of
plans the "list" step contains. More advanced examples may include topics such
as joining tables in a database, or adding selection sets to a remote GraphQL
operation.

:::

### Finalize

Grafast then finalizes the plan by calling the `finalize` method on steps that
support it. This gives each step a chance to do work that need only be done
once, for example:

- a step that talks to a database might compile the SQL it needs and cache it
  for later
- a step that performs templating may build an optimized template function
- etc

### Output plan

Finally, the output plans are finalized, building optimized output functions and
referencing the latest optimized steps.

## Executing operation and output plan

At execution time, data (for example from variables and context) is fed into
system steps, then execution flows down through the operation plan's step graph,
executing each step exactly once until all steps have been executed, at which
point the GraphQL output is produced.

Since each step is only executed once per request, the execution must process
all of the data in a batch. Thus, it is fed a list of data from each of its
dependencies, and it must return a corresponding list of data that its
dependents may themselves consume.

## Returning data to user

This would be the same as in a graphql-js project, except Grafast supports an
optimised strategy for stringifying the result should you need to do so (e.g. if
you are serving the request over HTTP).

[dataloader]: https://github.com/graphql/dataloader
[graphql-js]: https://github.com/graphql/graphql-js
