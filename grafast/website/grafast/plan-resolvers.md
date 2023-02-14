---
sidebar_position: 5
---

# Plan resolvers

Each field in the schema may implement a synchronous `plan` method, called a
"plan resolver." At operation planning time, each time this field is referenced
the plan resolver may be called with Grafast passing the resulting step of the
parent plan[^1] and a "field args" object. The plan resolver may create as many
intermediate steps as it likes, but it must return exactly one step that its
children may use (or, in the case of a leaf, that may be used by the output
plan). Plan resolvers

[^1]:
    The resulting step will be the returned step from the parent field when that
    field has an object type, but when the field has a list or polymorphic type
    the resulting step will likely differ.

In the case of a field that has a polymorphic type, the step that is returned
must be a polymorphic-capable plan. (TODO: document polymorphism.)

In the case of a field that has a list type, the step that is returned must
produce lists when executed. (TODO: document listItem step class method.)

A plan resolver can be used instead of, or in addition to, a traditional
resolver. Since plan resolvers run only when the operation is being planned, not
when it is being executed, they do not have access to any data ─ only other
steps.

Like regular resolvers, the first two arguments to a plan resolver represent the
parent data and the arguments respectively. However, since we're dealing in
potentials rather than concrete data, both of these are a little different.

The first argument, the "parent step," is a step that represents the data from
the parent. Note that if the parent field returned an array then the parent step
will represent an item from this array, rather than the whole collection.

The second argument, the "field arguments," is an object with access methods to
read the arguments. We'll expand on that below because it's a little bit subtle.

A plan resolver might look something like:

```ts
function plan_resolver(
  $parent: ExecutableStep,
  args: FieldArgs,
): ExecutableStep {
  const $friends = $parent.getRelation("friends");
  $friends.limit(args.get("limit"));
  return $friends;
}
```

:::note

By convention, when a variable represents a step we start the variables name
with a `$`.

:::

Of course the actual body of the plan resolver function will vary based on your
own application's needs.

## Argument and input field plan resolvers

:::tip

This section is very advanced and rarely used, so feel free to skip to the next
subsection. It's included here only because FieldArgs (the next section) relies
on these behaviors if present.

:::

In addition to field plan resolvers, Grafast allows you to attach an `inputPlan`
and/or an `applyPlan` to individual arguments or to input fields on input
objects. These plan resolvers work a little differently.

### `inputPlan` plan resolvers

An `inputPlan` plan resolver may exist on an argument or an input field. It is
passed three arguments:

1. the parent plan
2. the FieldArgs relative to this argument or input field
3. additional info (TODO: document)

The `inputPlan` must return a step that shall be used in place of the argument
or input value's raw value when `FieldArgs.get` references it.

### `applyPlan` plan resolvers

An `applyPlan` plan resolver may exist on an argument or an input field. It is
passed three arguments:

1. the target step - the step to apply changes to
2. the FieldArgs relative to this argument or input field
3. additional info (TODO: document)

The `applyPlan` may either manipulate the target step directly, or it may return
a ModifierStep which will gather changes and then apply them all at once. The
ModifierStep is passed to child input fields `applyPlan` plan resolvers (if any)
to allow the changes to stack up. This is particularly useful when building
"patch" or objects to be used with a mutation, or "filter" objects to be used
against a collection.

## Field arguments (`FieldArgs`)

The FieldArgs object gives access to field arguments. It contains three methods:

### FieldArgs.get

Pass this method either the name of the argument you wish to get, or a path to
the value you want through arguments and input objects (_but not lists_), and
you shall receive a step that represents that value.

If the argument or input object field has an `inputPlan` method, it will be
called, and the step that it returns will be used instead of the raw step that
would represent the value.

:::note

You may also call `fieldArgs.get()` with no arguments to get the value of the
current argument/input field; but this may only be done inside `inputPlan` or
`applyPlan`.

:::

### FieldArgs.getRaw

As FieldArgs.get, except it ignores any `inputPlan`s and just returns a step
representing the raw value.

### FieldArgs.apply

Pass this method a step to apply to and either the name of the argument you wish
to apply, or a path to the input field you want to apply through arguments and
input objects (_but not lists_), and the `applyPlan` for that argument or input
field will be applied to the given step.

TODO: expand this section with examples of why you might do these things.

## Automatic application of `applyPlan` plan resolvers

FieldArgs keeps track of the arguments/input fields that you `.get()`,
`.getRaw()` or `.apply()`, and should there be any left unaccessed that have an
`applyPlan` method, these will automatically be called passing the field plan
resolvers resulting step as the argument.

This, for example, allows you to associate the "first" behavior with the
argument rather than the plan resolver, such that you could share the
first/last/before/after behavior via a common object that you spread into each
of your arguments on connections, rather than having to rewrite the logic in
each of your plan resolver functions.
