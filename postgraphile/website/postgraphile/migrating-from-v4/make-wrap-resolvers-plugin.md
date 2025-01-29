---
title: "makeWrapResolversPlugin"
---

# No makeWrapResolversPlugin

Since PostGraphile V5 no longer uses resolvers, wrapping resolvers is
meaningless. And yet! Since we now use `plans`, you can suddenly do a lot more
by wrapping the plans than you ever could by wrapping resolvers — not only does
it allow you to affect the data that's returned, it also allows you to change
the very plan of what will be done!

`makeWrapPlansPlugin` is the new plugin generator that replaces
`makeWrapResolversPlugin`. It has a similar API, but it's somewhat simplified:

- No need for `requires` any more, since you can use the methods on steps to get
  what you need
- No `resolveInfo` since it's not needed in Gra*fast*
- No `context` (but you can retrieve it via the [`context()` step][context] if you
  need it)

[context]: https://grafast.org/grafast/step-library/standard-steps/context

Now let's look at some of the things you might have used
`makeWrapResolversPlugin` for in the past, and see how to map them into V5.

## Setting a create/update mutation column value

You could use `makeWrapResolversPlugin` in V4 as a clumsy workaround to set
specific column values in a built-in CRUD mutation by overriding what the system
thought the arguments were. Fortunately, V5's plan system means that you no
longer need to do this and you can address the problem more directly — you don't
even have to have the column in your GraphQL schema in order to set it any more!
:sweat_smile:

```js
makeWrapPlansPlugin({
  Mutation: {
    // This same pattern works for 'update' mutations too
    createPost(plan, $source, { $firstName, $lastName }) {
      // Call the original plan
      const $planResult = plan();

      // Get a reference to the `PgInsertSingleStep`.
      // Remember: it's a step, it has not executed yet, so we can still
      // augment what it will do.
      const $insert = $planResult.get("result");

      // We have a legacy 'name' field that needs populating; build it from
      // each tuple of firstName/lastName fields:
      const $name = lambda(
        [$firstName, $lastName],
        ([firstName, lastName]) => `${firstName} ${lastName}`,
        // Our callback is synchronous and won't throw
        true,
      );

      // Now set this as the value of 'name' in the PgInsertSingleStep:
      $insert.set("name", $name);

      // Our result is the same as before (otherwise dependent plans may fail)
      return $planResult;
    },
  },
});
```

## Performing an access check before a field plan

Steps that have side effects never get tree shaken or de-duplicated, so if we
want to throw an error before the mutation takes place we can do so like this:

```js
import { sideEffect, context } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";

const plugin = makeWrapPlansPlugin({
  Mutation: {
    createUser(plan) {
      // Extract the 'isAdmin' property from the GraphQL context
      const $isAdmin = context().get("isAdmin");

      // If the user isn't an admin, throw an error
      const $preCheck = sideEffect($isAdmin, (isAdmin) => {
        if (!isAdmin) {
          throw new Error("Abort");
        }
      });

      // Now call the underlying plans; these will never execute if the above throws
      return plan();
    },
  },
});
```

:::caution

Plans with side effects are only expected/supported in field plans on the
`Mutation` type. Side effect plans elsewhere may lead to unexpected results.

:::

## Manipulating the data a field will return

It's quite common for developers to store a users `email` into the `users` table
(see tip below on why you _shouldn't_ do this). You typically wouldn't want
other users to be able to see someone's email address; so you could mask it out
with a field plan wrapper:

```js
const plugin = makeWrapPlansPlugin({
  User: {
    email(plan, $user, args, info) {
      // Get 'userId' from the GraphQL context
      const $myUserId = context().get("userId");

      // Get the user's ID
      const $theirUserId = $user.get("id");

      // Get the email via the original plan
      const $email = plan();

      // Now return a new plan that only returns the email if the IDs match
      return lambda(
        [$myUserId, $theirUserId, $email],
        ([myUserId, theirUserId, email]) => {
          if (myUserId === theirUserId) {
            return email;
          } else {
            return null; // TODO: ensure the 'email' field is nullable!
          }
        },
      );
    },
  },
});
```

:::tip

In my opinion, storing the `email` onto the `users` table is generally a bad
design pattern. One reason is that it complicates security (see warning below),
another reason is _plurality_: it's a lot harder to go from 1 to 2 of something
than it is to go from 2 to 3. You should design your system to allow users to
have more than one email address even if you don't allow it to start with, for
example by storing emails into a `user_emails` table.

:::

:::warning

Though the above example may mask the `email` field when fetched directly, there
are side channel attacks that someone could use to determine someones email -
for example they could order by the email address and extract it from the
`cursor`, or they could use advanced filtering to perform a dictionary search
for the users email address. We strongly advise that you store email addresses
and other private information into a separate table for the best security.

:::
