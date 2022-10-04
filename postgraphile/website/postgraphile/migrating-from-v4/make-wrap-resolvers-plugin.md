---
title: "makeWrapResolversPlugin"
---

# No makeWrapResolversPlugin

Since PostGraphile V5 no longer uses resolvers, wrapping resolvers is
meaningless. And yet! Since we now use `plans`, you can suddenly do a lot more
by wrapping the plans than you ever could by wrapping resolvers - not only does
it allow you to affect the data that's returned, it also allows you to change
the very plan of what's being built!

## makeWrapPlansPlugin

This new plugin generator replaces makeWrapResolversPlugin. It has a similar
API, but it's somewhat simplified:

- No need for `requires` any more, since you can use steps to get what you need
- No resolveInfo since it's not needed in Gra*fast*
- No context, but you can retrieve it via the [`context()` step][context]

[context]: https://grafast.org/grafast/step-library/standard-steps/context

## Setting a create/update mutation column value

You could use makeWrapResolversPlugin in V4 as a clumsy workaround to set
specific column values in a builtin CRUD mutation by overriding what the system
thought the arguments were. Fortunately V5's plan system means that you no
longer need to do this and you can address the problem more directly - you don't
even have to have the column in your GraphQL schema in order to set it any more!
:sweat_smile:

```js
makeWrapPlansPlugin({
  Mutation: {
    // This same pattern works for 'update' mutations too
    createPost(plan, $source, fieldArgs) {
      // Call the original plan
      const $planResult = plan();

      // Get a reference to the `PgInsertStep`.
      // Remember: it's a step, it has not executed yet, so we can still
      // augment what it will do.
      const $insert = $planResult.get("result");

      // We have a legacy 'name' field that needs populating; build it from
      // each tuple of firstName/lastName fields:
      const $name = lambda(
        [fieldArgs.get("firstName"), fieldArgs.get("lastName")],
        ([firstName, lastName]) => `${firstName} ${lastName}`,
        // Our callback is synchronous and won't throw
        true,
      );

      // Now set this as the value of 'name' in the PgInsertStep:
      $insert.set("name", $name);

      // Our result is the same as before (otherwise dependent plans may fail)
      return $planResult;
    },
  },
});
```

## Performing an access check before calling plan

Steps that have side effects never get tree shaken or deduplicated, so if we
want to throw an error before the mutation takes place we can do so like this:

```js
const plugin = makeWrapPlansPlugin({
  Mutation: {
    createUser(plan) {
      // Extract the 'isAdmin' property from the GraphQL context
      const $isAdmin = context().get("isAdmin");

      // If the user isn't an admin, throw an error
      const $preCheck = lambda($isAdmin, (isAdmin) => {
        if (!isAdmin) {
          throw new Error("Abort");
        }
      });
      // Force this plan to run by marking it as having side effects
      $preCheck.hasSideEffects = true;

      // Now call the underlying plans; these will never execute if the above throws
      return plan();
    },
  },
});
```
