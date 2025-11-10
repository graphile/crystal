# \*WithPgClient

Sometimes you want to use your PostgreSQL client directly, e.g. to run
arbitrary SQL, or use your specific database client's helper methods; that's
what the `\*WithPgClient` steps are there to help you with.

## loadOneWithPgClient(executor, lookup, loader)

## loadManyWithPgClient(executor, lookup, loader)

These work similar to Grafast's
[`loadOne`](https://grafast.org/grafast/step-library/standard-steps/loadOne) and
[`loadMany`](https://grafast.org/grafast/step-library/standard-steps/loadMany)
steps respectively, with the following differences:

- There's an additional initial argument, the `executor` which details the
  database being connected to (PostGraphile users: you probably want
  `build.pgExecutor` unless you're using multiple databases)
- The callback (`load`) is passed an additional initial parameter: `pgClient`
- The `shared` parameter, if specified, must be an object containing steps (not
  a direct step or list of steps)

```ts
const objects = {
  User: {
    plans: {
      e164PhoneNumbers($user) {
        const $id = get($user, "id");
        return loadManyWithPgClient(
          executor,
          $id,
          async (pgClient, userIds) => {
            // NOTE: We're doing batched processing across all the userIds,
            // fetching all their phone numbers at once and converting them.

            // Step 1 - load the user's phone numbers
            const { rows: userContacts } = await pgClient.query<{
              user_id: string;
              phone: string;
            }>({
              text: `
              select user_id, phone
              from user_contacts
              where user_id = any($1::int[]);
            `,
              values: [userIds],
            });

            // Step 2 - normalize the phone numbers
            const phoneNumbersByUserId: Record<string, string[]> =
              Object.create(null);
            for (const row of userContacts) {
              const { user_id: userId, phone: rawPhone } = row;
              const phone = normalizePhone(rawPhone);
              (phoneNumbersByUserId[userId] ??= []).push(phone);
            }

            // Optionally: query pgClient again using these normalized phone numbers

            // Finally - match the inputs to the outputs
            return userIds.map((userId) => phoneNumbersByUserId[userId] ?? []);
          },
        );
      },
    },
  },
};
```

## sideEffectWithPgClient(executor, $data, callback)

:::danger

Like `lambda`, `sideEffectWithPgClient` is an escape hatch and does not use
batching. It is only intended for use in top-level mutations where batch size is
always one. When desired elsewhere, consider using `pgSelect`, `loadOne`, or
`loadOneWithPgClient` instead. In future, we intend to add a batched version of
these functions.

:::

You need to pass three arguments to `sideEffectWithPgClient`:

- `executor` - this is needed to connect to the database; you can grab the
  executor from the registry directly or any of the
  [resources](./registry/resources) that you have in the same database
- `$data` - an arbitrary step representing the data that your `callback` needs;
  you may also pass a multistep (a list of steps, object with string keys and
  step values, or `null` if no data is needed)
- `callback(client, data)` - the (async) function to be called with the
  database client and the data from your `$data` step

`sideEffectWithPgClient` will grab a client from the context, call your callback and wait
for it to return, and then release the client again, ultimately yielding the
return result of your callback.

```ts
import { sideEffectWithPgClient } from "@dataplan/pg";
import { constant } from "grafast";
import { registry } from "./myRegistry";

// Grab executor from the registry
const executor = registry.pgExecutors.main;

function meaningOfLifePlan() {
  // Arbitrary data for our callback to use
  const $twenty = constant(20);

  // 20 + 22 = 42
  const $meaningOfLife = sideEffectWithPgClient(
    executor,
    $twenty,
    async (client, twenty) => {
      // The client that you receive will be dependent on the adaptor you're
      // using, but must have a `query` method:
      const {
        rows: [{ num }],
      } = await client.query({ text: `select 22 as num` });

      return twenty + parseInt(num, 10);
    },
  );

  return $meaningOfLife;
}
```

## sideEffectWithPgClientTransaction(executor, $data, callback)

Exactly the same as `sideEffectWithPgClient` except it starts a transaction
before calling `callback` and commits it when `callback` completes successfully
or rolls it back if an error is raised.
