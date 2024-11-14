---
sidebar_position: 7
---

# Step classes

A step details a particular action or transform that needs to be performed when
executing a GraphQL request. Each step is an instance of a specific _step
class_, produced during the planning of a field. Each step may depend on 0 or
more other steps, and through these dependencies ultimately form a directed
acyclic graph which we refer to as the _execution plan_. Thus the steps are the
building blocks of an execution plan.

A modest range of [standard step classes][standard steps] are available for you
to use; but when these aren't enough you are encouraged to write your own (or
pull down third party step classes from npm or similar).

Step classes extend the `ExecutableStep` class, the only required method to
define is `execute`, but you may also implement the various lifecycle methods,
or add methods of your own to make it easier for you to write [plan
resolvers][].

<!-- prettier-ignore -->
```ts
/** XKCD-221 step class @ref https://xkcd.com/221/ */
class GetRandomNumberStep extends ExecutableStep {
  execute({ count }) {
    return new Array(count).fill(4); // chosen by fair dice roll.
                                     // guaranteed to be random.
  }
}

function getRandomNumber() {
  return new GetRandomNumberStep();
}
```

:::tip Use prefixes on custom fields/methods.

If you add any custom fields or methods to your step classes we recommend that
you prefix them with your initials or organization name to avoid naming
conflicts occurring.

:::

:::warning Don't subclass steps.

Don't subclass steps, this will make things very confusing for you. Always
inherit directly from `ExecutableStep`.

:::

## Built in methods

Your custom step class will have access to all the built-in methods that come
as part of `ExecutableStep`.

### addDependency

When your step requires another step's value in order to execute (which is the
case for the majority of steps!) it must add a dependency via the
`this.addDependency($otherStep)` method. This method will return a number,
which is the index in the `execute` values tuple that represents this step.

It's common to do this in the constructor, but it can be done at other stages
too, for example during the optimize phase a step's descendent might ask it to
do additional work, and that work might depend on another step.

In the [getting started][] guide we saw the constructor for the `AddStep` step
class added two dependencies:

```ts
class AddStep extends ExecutableStep {
  constructor($a, $b) {
    super();
    this.addDependency($a); // Returns 0
    this.addDependency($b); // Returns 1
  }
```

:::warning Steps are ethemeral, never store a reference to a step.

You must never store a reference to another step directly (or indirectly) in
your step class. Steps come and go at quite a rate during planning - being
removed due to deduplicate, optimize, or tree shaking lifecycle events.
Referring to a step that no longer exists is likely to make your program have
very unexpected behaviors and/or crash.

In the exceedingly unlikely event that you need to reference another step but it
is not a dependency, use its `id` ─ you can then look up the step associated
with that `id` at a later time; if it exists it may be different to the step you
remember, but it should serve the same purpose. However, it may have been
deleted due to tree shaking - if this causes a problem, then maybe that step
should have been a dependency after all?

:::

### addUnaryDependency

Sometimes you'll want to ensure that one or more of the steps your step class
depends on will have exactly one value at runtime; to do so, you can use
`this.addUnaryDependency($step)` rather than `this.addDependency($step)`. This
asserts that the given dependency is a **unary step** (a regular step which the
system has determined will always represent exactly one value) and is primarily
useful when a parameter to a remote service request needs to be the same for
all entries in the batch; typically this will be the case for ordering,
pagination and access control.

:::warning Use with caution.

`this.addUnaryDependency($step)` will raise an error during planning if the
given `$step` is not unary, so you should be very careful using it. If in
doubt, use `this.addDependency($step)` instead.

The system steps which represent request–level data (e.g. context, variable and
argument values) are always unary steps, and &ZeroWidthSpace;<grafast /> will
automatically determine which other steps are also unary steps.

It's generally intended for `addUnaryDependency` to be used for arguments and
their derivatives; it can also be used with `context`-derived values, but there
is complexity when it comes to mutations since `context` is mutable (whereas
input values are not).

:::

### getDep

Pass in the number of the dependency (`0` for the first dependency, `1` for the
second, and so on) and Grafast will return the corresponding step. This should
only be used before or during the `optimize` phase.

For example in the `AddStep` example above we might have:

```ts
const $a = this.getDep(0);
const $b = this.getDep(1);
```

### getDepDeep

_EXPERIMENTAL_

Like `getDep`, but skips over `__ItemStep` and similar builtin intermediary
steps to try and get to the original source. Typically useful if you have a
step representing an entry from a collection (e.g. a database "row") and you
want to get the step representing the entire collection (e.g. a database
`SELECT` statement).

### toString

Pretty formatting for the step.

```ts
console.log("$a = " + $a.toString());
```

### toStringMeta

You may override this to add additional data to the `toString` method (the data
that would occur between the triangular brackets).

## Access methods

When writing a step class, you should implement either `.at()` or `.get()` depending on
if the step represents a list, array, or an objet.

### at

Implement `.at()` if your step represents a list or an array. It should accept a single argument, an
integer, which represents the index within the list-like value which should be accessed.

Usage:

```ts
import { access } from 'grafast';

class MyListStep extends ExecutableStep {
  // ...

  at(index) {
    // Your step may implement a more optimized solution here.
    return access(this, index);
  }
}
```

### get

Implement `.get()` if your step represents an object. It should accept a single argument, a
string, which represents an attribute to access an object-like value.

```ts
import { access } from 'grafast';

class MyObjectStep extends ExecutableStep {
  // ...

  get(key) {
    // Your step may implement a more optimized solution here.
    return access(this, key);
  }
}
```


:::caution

If your step implements `.at()` or `.get()`, make sure it conforms to the expectations of
those methods: ie it correctly accepts a single argument of either an integer or string.
&ZeroWidthSpace;<grafast /> relies on these assumptions; unanticipated behaviours may result
from steps which don't adhere to these expectations.

:::

## Lifecycle methods

### execute

```ts
execute(details: ExecutionDetails): PromiseOrDirect<GrafastResultsList>
```

```ts
// These are simplified types
interface ExecutionDetails {
  count: number;
  values: [...ExecutionValue[]];
  indexMap<T>(callback: (i: number) => T): ReadonlyArray<T>;
  indexForEach(callback: (i: number) => any): void;
  extra: ExecutionExtra;
}

type ExecutionValue<TData> =
  | { at(i: number): TData; isBatch: true; entries: ReadonlyArray<TData> }
  | { at(i: number): TData; isBatch: false; value: TData };

type GrafastResultsList<T> = ReadonlyArray<PromiseOrDirect<T>>;
```

`execute` is the one method that your step class must define, and it has very
strict rules.

It is passed one argument, the "execution details", which is an object containing:

- `count` — the size of the batch being processed (and thus the length of the list that must be returned)
- `values` — the "values tuple", an n-tuple (a tuple with `n` entries), where
  `n` is the number of dependencies the step has. Each of the entries in the
  tuple will be an "execution value" containing the data that relates to the
  corresponding dependency
- `indexMap(callback)` - a helper function that builds an array of length
  `count` by calling `callback` for each index in the batch (from `0` to
  `count-1`); equivalent to `Array.from({ length: count }, (_, i) => callback(i))`
- `indexForEach(callback)` - a helper function that calls `callback` for each
  index in the batch (from `0` to `count-1`) but does not return anything
- `extra` — currently experimental, use it at your own risk (and see the source
  for documentation)

An "execution value", `dep`, is an object containing the data for a given
dependency. It will either be a "batch" value (`dep.isBatch === true`) in which
case `dep.entries` will be an array containing `count` entries (the order of
which is significant), or it will be a "unary" value (`dep.isBatch === false`)
in which case `dep.value` will be the common value for this dependency across
all entries in the batch. Either way, `dep.at(i)` will return the value for
this dependency corresponding with the i'th entry in the batch (`dep.at(i)` is
equivalent to `dep.isBatch ? dep.entries[i] : dep.value`).

Execute must return a list (or a promise to a list) of size `count`, where the
i'th entry in this list corresponds to the `dep.at(i)` value for each `dep` in
the "values tuple". The result of `execute` may or may not be a promise, and
each entry in the resulting list may or may not be a promise.

:::warning If your step has no dependencies

If the step has no dependencies then `values` will be a 0-tuple (an empty
tuple), but that doesn't mean the batch is empty or has size one, `count` may
be any positive integer. It's therefore recommended that you use `indexMap` to
generate your results in the vast majority of cases:

```ts
return indexMap((i) => 42);
```

:::

:::info

You might wonder why the `values` input is a tuple of execution values, rather
than a list of tuples. The reason comes down to efficiency, by using a tuple of
execution values, <grafast /> only needs to build one new array (the tuple),
and into that array it can insert the results from previously executed steps
unmodified. Were it to provide a list of tuples instead then it would need to
build N+1 new arrays, where N was the number of values being processed, which
can easily be in the thousands.

:::

:::tip

If you want one of your entries to throw an error, but the others shouldn't,
then an easy way to achieve this is to set the corresponding entry in the
results list to `Promise.reject(new Error(...))`. You can do this even if you
don't use promises for any of the other values, and even if your `execute`
method is not marked as `async`. You **must not** do this if you have marked
your step class with `isSyncAndSafe = true`.

:::

#### Example

In the [getting started][] guide we built an `AddStep` step class that adds two
numbers together. It's `execute` method looked like this:

```ts
  execute({ indexMap, values: [aDep, bDep] }) {
    return indexMap((i) => {
      const a = aDep.at(i);
      const b = bDep.at(i);
      return a + b;
    });
  }
```

Imagine at runtime <grafast /> needed to execute this operation for three
(`count = 3`) pairs of values: `[1, 2]`, `[3, 4]` and `[5, 6]`. The values for
`$a` accessible through `aDep.get(i)` would be `1`, `3` and `5`; and the values
for `$b` accessible through `bDep.get(i)` would be `2`, `4` and `6`. The
execute method then returns the same number of results in the same order: `[3,
7, 11]`.

### stream

_This method is optional._

```ts
stream(details: StreamDetails): PromiseOrDirect<GrafastResultStreamList>
```

```ts
interface StreamDetails extends ExecutionDetails {
  streamOptions: {
    initialCount: number;
  };
}

type GrafastResultStreamList<T> = ReadonlyArray<
  PromiseOrDirect<AsyncIterable<PromiseOrDirect<T>> | null>
>;
```

TODO: document stream. (It's like execute, except it returns a list of async iterators.)

### deduplicate

_This method is optional._

```ts
deduplicate(
  peers: readonly ExecutableStep[]
): readonly ExecutableStep[]
```

After a field has been fully planned, <grafast /> will call this method on each
new step when more than one step exists in the draft execution plan with the
same step class and the same dependencies. These "peers" (including the step
itself) will be passed in to the deduplicate method, and this method should
return the list of the peers that are equivalent (or could cheaply be made
equivalent) to the current step.

To cause your step class to never be deduplicated, either don't implement this
method or simply `return [];`.

You should not mutate your peers or yourself during this method, instead use
the `deduplicatedWith` method to apply side-effects.

### deduplicatedWith

_This method is optional._

```ts
deduplicatedWith(
  replacement: ExecutableStep
): void
```

If <grafast /> determines that this specific step instance should be replaced
by one of its peers (thanks to the results from `deduplicate` above), <grafast
/> will call `deduplicatedWith` on the step that is being replaced, passing the
step that it is being replaced with as the first argument. This gives your step
a chance to pass any information to the peer that may be necessary to make the
peers equivalent.

:::info

It's rare to need this functionality, so let's work through a hypothetical.

Imagine step `$select1` represents the SQL query `SELECT id, name FROM users`
and step `$select2` represents `SELECT id, avatar_url FROM users`.

Lets further imagine that we've optimised our SQL handling step classes such
that both `$select1` and `$select2` return `[$select1, $select2]` from their
`deduplicate` method (because they can "cheaply" be made equivalent).

Assuming <grafast /> chooses to keep `$select1` and
"deduplicate" (get rid of) `$select2`, <grafast /> would then call
`$select2.deduplicateWith($select1)`. This would give `$select2` a chance to
inform `$select1` that in order to be completely equivalent, it must also
select `avatar_url`.

In this scenario, at the end of deduplication, only `$select1` would remain and
it would represent the SQL query `SELECT id, name, avatar_url FROM users`.

:::

### optimize

_This method is optional._

```ts
optimize(
  options: { stream: StepStreamOptions | null }
): ExecutableStep
```

This method is called on each step during the optimize lifecycle event. It
gives the step a chance to request that its ancestors do additional work,
and/or replace itself with another step (new or old). If it does not want
to be replaced, it can simply return itself: `return this;`.

This one method unlocks a significant proportion of <grafast />'s efficiency
improvements. Here are some common use cases that it can be used for:

#### Optimize: inlining

`optimize` is often useful for "inlining" the requirements of this step into an
ancestor and then (optionally) replacing itself with a simple `access` or
`remapKeys` step. This reduces the number of asynchronous tasks the request
needs to execute and can enable significantly more efficient data fetching.

#### Optimize: planning-time only steps

Another use case for `optimize` is to make planning-time only steps "evaporate"
by replacing them with their parent or a different step.

The `loadMany` step represents each record via a `LoadedRecordStep` instance
which can be used to `.get(attr)` a named attribute. This reference is then
stored, and at optimize time the `LoadedRecordStep` can tell the `LoadStep` to
request this attribute (so that the `loadMany` callback doesn't need to do the
equivalent of `SELECT *` - it can be more selective). However, since
`LoadedRecordStep` has no run-time behavior (only planning-time behavior) it
can simply replace itself during `optimize` with its parent step (typically an
`__ItemStep`).

The builtin `each` step uses `optimize` to replace itself with the underlying
list where possible.

#### Optimize: simplification

Another use case is simplification.

For example the step representing `access(access(access($a, 'b'), 'c'), 'd')`
could be simplified down to just `access($a, ['b', 'c', 'd'])`, reducing the
number of steps in the operation plan.

Similarly `first(list([$a, $b]))` can be simplified to just `$a`.

### finalize

_This method is optional._

```ts
finalize(): void
```

This method is called on each step during the finalize lifecycle event. It gives
each step a chance to prepare for execution, doing anything that needs to be
done just once. A step that deals with a database might precompile its SQL, a
step that transforms an object might build an optimized function to do so, there
are so many other actions that this step can be used for.

:::warning

It is critical that the step calls `super.finalize()` at the end of the
`finalize()` step:

```ts
finalize() {
  // ... your code here ...

  super.finalize();
}
```

:::

:::info

Importantly during this step the step should only worry about its own concerns
and should not attempt to communicate with its ancestors or descendents - they
may not be the steps that it remembers as they may have been switched out
during `optimize`! If the step needs to communicate with its ancestors it
should use the `optimize` method to do so.

:::

## Other properties

### id

Every step is assigned a unique id by <grafast />. This id may be a string, number,
or symbol - treat it as opaque.

:::note

Currently this value is a `number`, but <grafast /> may change it to be a string or
symbol in a minor release so you should not rely on its data type. You may,
however, rely on `String(id)` being unique across an operation plan.

:::

### hasSideEffects

Set this true if the step has side effects (i.e. causes a mutation) - if this
is true then Gra*fast* will _not_ remove this step during tree shaking, and
will ensure that the step is executed even if it doesn't appear to be used in
any output.

### isSyncAndSafe

:::warning

This is a very dangerous optimization, only use it if you're 100% sure you know
what you are doing!

:::

Setting this true is a performance optimization, but it comes with strong rules;
we do not test you comply with these rules (as that would undo the performance
gains) but should you break them the behaviour is undefined (and, basically, the
schema may no longer be GraphQL compliant).

Do not set this true unless the following hold:

- The `execute` method must be a regular (not async) function
- The `execute` method must NEVER return a promise
- The values within the list returned from `execute` must NEVER include promises
- The result of calling `execute` should not differ after a
  `step.hasSideEffects` has executed (i.e. it should be pure, only dependent on
  its deps and use no external state)

It's acceptable for the `execute` method to throw if it needs to.

This optimisation applies to the majority of the built in plans and allows the
engine to execute without needing to resolve any promises which saves precious
event-loop ticks.

### isOptimized

This is set `true` after the step has been optimized.

### allowMultipleOptimizations

Set this true if your plan's optimize method can be called a second time.

:::warning Your dependencies may change classes!

In this situation it's likely that your dependencies (or their dependencies)
will not be what you expect them to be (e.g. a `PgSelectSingleStep` might
become an `AccessStep` due to having been optimized). This, and the fact
that it's rarely needed, is why it's not enabled by default.

:::

### metaKey

_EXPERIMENTAL_

You may optionally set this to indicate a key to use for which `meta` object to
be passed in to `execute` (typically used for caching). To make it unique to
the instance of your step, in the constructor after calling `super()`, set it
as `this.metaKey = this.id;`. If you want to share the same `meta` object
between all steps of a given class, that class may set `metaKey` to be the name
of the class. You can even set it to a shared value between multiple step
classes (a "family" of step classes) should that make sense. By default no
`metaKey` is set, and your class will therefore have no `meta` object.

:::tip Inspiration

The `loadMany` and `loadOne` standard steps make use of this key to optimize
value caching, you may want to look at them for more inspiration.

:::

## Step function

By convention, we always define a function that constructs an instance of our
class so we don't see the `new` calls or redundant `Step` text in our plan
resolver functions.

This function is typically named after the corresponding
step class, but with the first letter in lower case and the `Step` suffix
omitted, for example `AddStep` would become `add`:

```ts
function add($a, $b) {
  return new AddStep($a, $b);
}
```

There's multiple reasons for this, a simple one is to make the plan code
easier to read: we won't see the `new` calls in our plan resolver functions,
nor the redundant `Step` wording, resulting in a higher signal-to-noise ratio.
More importantly, though, is that the small layer of indirection allows us to
do some minor manipulations before handing off to the class constructor, and
makes the APIs more future-proof since we can have the function return
something different in future without having to refactor our plans in the
schema. And remember that this cost is only incurred at planning time (which is
generally cached and can be re-used for similar future requests), and each
field is only planned once, so the overhead of an additional function call is
negligible.

[plan resolvers]: ./plan-resolvers
[getting started]: ./getting-started
[standard steps]: ./step-library/standard-steps/index.mdx
