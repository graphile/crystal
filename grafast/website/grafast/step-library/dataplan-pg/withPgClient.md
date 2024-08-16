# withPgClient and withPgClientTransaction

Sometimes you want to use your PostgreSQL client directly, e.g. to run
arbitrary SQL, or use your specific database client's helper methods; that's
what `withPgClient` is there to help you with.

:::warning

Like `lambda`, `withPgClient` is an escape hatch and does not use batching.

:::

## withPgClient(executor, $data, callback)

You need to pass three arguments to `withPgClient`:

- `executor` - this is needed to connect to the database; you can grab the
  executor from the registry directly or any of the
  [resources](./registry/resources) that you have in the same database
- `$data` - an arbitrary step representing the data that your `callback` needs;
  set this to `constant(null)` if you don't need anything
- `callback(client, data)` - the (async) function to be called with the
  database client and the data from your `$data` step

`withPgClient` will grab a client from the context, call your callback and wait
for it to return, and then release the client again, ultimately resolving to
the return result of your callback.

```ts
import { withPgClient } from "@dataplan/pg";
import { constant } from "grafast";
import { registry } from "./myRegistry";

// Grab executor from the registry
const executor = pgRegistry.pgExecutors.main;

function meaningOfLifePlan() {
  // Arbitrary data for our callback to use
  const $twenty = constant(20);

  // 20 + 22 = 42
  const $meaningOfLife = withPgClient(
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

## withPgClientTransaction(executor, $data, callback)

Exactly the same as `withPgClient` except it starts a transaction before calling `callback` and
commits it when `callback` completes successfully or rolls it back if an error is raised.
