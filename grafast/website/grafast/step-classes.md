---
sidebar_position: 7
---

# Step classes

The building blocks of an operation plan are "steps." A step is an instance of a
specific _step class_, produced during the planning of an operation. Each step
may depend on 0 or more other steps, and through these dependencies ultimately
form a directed acyclic graph which we refer to as the _operation plan_.

Grafast makes available a modest range of [standard step
classes][standard steps] that you can use; but when these aren't enough you are
encouraged to write your own (or pull down third party step classes from npm or
similar).

Step classes extend the `ExecutableStep` class, the only required method to
define is `execute`, but you may also implement the various lifecycle methods,
or add methods of your own to make it easier for you to write [plan resolvers][]
─ but if you do this, we recommend that you prefix them with your initials or
organization name to avoid naming conflicts occurring.

## Built in methods

### addDependency

When your step requires another step's value to execute (which is the case for
the majority of steps!) it must add a dependency via the
`this.addDependency($otherStep)` method. This method will return a number, which
is the index in the execute values tuple that represents this step.

It's common to do this in the constructor, but it can be done at other stages
too, for example during the optimize phase a steps descendent might ask the step
to do additional work, and that work might depend on another step.

In the [getting started][] guide we saw the constructor for the `AddStep` step
class added two dependencies:

```ts
class AddStep extends ExecutableStep {
  constructor($a, $b) {
    super();
    this.addDependency($a);
    this.addDependency($b);
  }
```

:::warning

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

### getDep

Pass in the number of the dependency (`0` for the first dependency, `1` for the
second, and so on) and Grafast will return the corresponding step. This should
only be used before or during the `optimize` phase.

### getDepDeep

_EXPERIMENTAL_

Like `getDep`, but skips over `__ItemStep` and similar builtin intermediary
steps to try and get to the original source.

### toString

Pretty formatting for the step.

### toStringMeta

You may override this to add additional data to the `toString` method.

## Lifecycle methods

### execute

Execute is the one method that your step class must define, and it has very
strict rules.

The first argument to the execute method, `count`, indicates how many values
will be fed into your execute function, and the length of the list that it must
return.

The second argument to the execute method, `values`, will be a tuple that
contains a list of all the batched values for each of your dependencies. The
length of each of these lists will be `count`. The value in each of these lists
at the same index relate to each other. Your execute method must return a list
(or a promise to a list) with this exact same length, and each entry in this
result list must correspond with the input values at the same index in the
values tuple.

:::danger

If the step has no dependencies then the `values` tuple will contain no
entries, so you _must_ use `count` to determine how many results to return.

:::

:::info

You might wonder why the `values` input is a tuple of lists, rather than what
it obviously represents which is a list of tuples. The reason comes down to
efficiency, by using a tuple of lists, Grafast only needs to build one new
array (the tuple), and into that array it can insert the results from previous
execute methods unmodified. Were it to provide a list of tuples instead then it
would need to build N+1 new arrays, where N was the number of values being
processed, which can easily be in the thousands.

:::

In the [getting started][] guide the `AddStep` step class should add two numbers
together. It's execute method looked like this:

```ts
  execute(count, [allA, allB]) {
    return allA.map((a, i) => {
      return a + allB[i];
    );
  }
```

Remembering that Grafast does batching of everything, at runtime we might have
been asked to add 1 and 2, 3 and 4, 5 and 6. So the values for `$a` would be
`allA = [1, 3, 5]` and the values for `$b` would be `allB = [2, 4, 6]`. The
`execute` method maps over the `allA` values, and adds that value to the
corresponding value from `allB` and returns the results.

The result of execute may or may not be a promise, and each entry in the
resulting list may or may not be a promise.

:::tip

If you want one of your entries to throw an error, but the others shouldn't,
then an easy way to achieve this is to set the corresponding entry in the
results list to `Promise.reject(new Error(...))`. You can do this even if you
don't use promises for any of the other values.

:::

### stream

_This method is optional._

TODO: document stream. (It's like execute, except it returns a list of async iterators.)

### deduplicate

_This method is optional._

Grafast will call this method on a step when more than one step exists with the
same step class and the same dependencies. These "peers" (including the step
itself) will be passed in to the deduplicate method, and this method should
return the list of the peers that are equivalent to the current step.

To cause your step class to never be deduplicated, you can simply
`return [this];`.

You should not fiddle with your peers during this method, instead:

### deduplicatedWith

_This method is optional._

If Grafast determines that this specific step instance should be replaced by one
of its peers, Grafast will call `deduplicatedWith` on the step that is being
replaced, passing the replacement as the first argument. This gives your step a
chance to pass any information to the peer that the peer may need. It's very
rare to need this functionality.

### optimize

_This method is optional._

This method is called on each step during the optimize lifecycle event. It gives
the step a chance to request that its ancestors do additional work, and/or
replace itself with another step. This is often useful for "inlining" the
requirements of this step into an ancestor, allowing for significantly more
efficient data fetching - this one method is the place that unlocks the majority
of Grafast's efficiency improvements.

### finalize

_This method is optional._

This method is called on each step during the optimize lifecycle event. It gives
each step a chance to prepare for execution, doing anything that needs to be
done just once. A step that deals with a database might precompile its SQL, a
step that transforms an object might build an optimized function to do so, there
are so many other actions that this step can be used for.

:::warning

Importantly during this step the step should only worry about its own concerns
and should not attempt to communicate with its ancestors or descendents - they
may not be the steps that it remembers!

:::

## Other properties

### id

Every step is assigned a unique id by Grafast. This id may be a string, number,
or symbol - treat it as opaque.

:::note

Currently this value is a `number`, but Grafast may change it to be a string or
symbol in a minor release so you should not rely on its data type. You may,
however, rely on `String(id)` being unique across an operation plan.

:::

### hasSideEffects

Set this true if the step has side effects (i.e. causes a mutation) - if this is
true then Grafast will _not_ remove this step during tree shaking, and will
ensure that the step is executed even if it doesn't appear to be used in any
output.

### isSyncAndSafe

:::warning

This is a very dangerous optimization, only use it if you're 100% sure you know
what you are doing!

:::

Setting this true is a performance optimisation, but it comes with strong rules;
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

Grafast sets this true after the step has been optimized.

### allowMultipleOptimizations

Set this true if your plan's optimize method can be called a second time.

:::warning

In this situation it's likely that your dependencies will not be what you expect
them to be (e.g. a `PgSelectSingleStep` might become an `AccessStep` due to
having been optimized) which is why it's not enabled by default.

:::

### metaKey

You may optionally override this to indicate a key to use for which `meta`
object to be passed in to `execute` and typically used for caching. For example,
if you want to share the same `meta` object between all steps of a given class,
that class may set `metaKey` to be the name of the class. You can even set it to
a shared value between multiple step classes should that make sense.

:::tip

The `loadMany` and `loadOne` standard steps make use of this key to optimize
value caching, you may want to look at them for more inspiration.

:::

## Step function

By convention, we always define a function that calls our class so we don't see
the `new` calls in our plan resolver functions. This function is named after the
corresponding class, but with the first letter in lower case and the `Step`
suffix omitted, for example `AddStep` would become `add`:

```ts
function add($a, $b) {
  return new AddStep($a, $b);
}
```

This practice makes plan resolvers easier to read, and the layer of abstraction
often allows us to do some minor manipulations before handing off to the class
constructor.

[plan resolvers]: ./plan-resolvers
[getting started]: ./getting-started
