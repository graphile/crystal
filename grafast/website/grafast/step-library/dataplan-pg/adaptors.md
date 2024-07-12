---
sidebar_position: 2
---

# Adaptors

`@dataplan/pg` can use any client to communicate with your database, so long as
there is a suitable adaptor. Each adaptor provides a baseline of capabilities
for `@dataplan/pg` to use. You may use multiple adaptors with the same schema.

At planning time, when a step determines a PgExecutor will be needed to
communicate with the database, the PgExecutor's `context()` method is called.
This method should return a step that describes an object with `withPgClient`
and (optionally) `pgSettings` entries. These entries will, in most cases, come
from the GraphQL context. A very common pattern for defining a PgExecutors
context is:

```ts
import { context, object } from "grafast";
import { PgExecutor } from "@dataplan/pg";

const executor = new PgExecutor({
  name: "default",
  context() {
    return object({
      withPgClient: context().get("withPgClient"),
      pgSettings: context().get("pgSettings"),
    });
  },
});
```

:::note

Here we build the PgExecutor context by getting a reference to the GraphQL
context via the `context()` step, and then extracting the `withPgClient` and
`pgSettings` keys. Note that the naming of these keys is unimportant, and you
will need to use different names for these keys for each of your adaptors.

:::

At runtime, we must ensure that these properties are supplied on the GraphQL
context so that the PgExecutor can operate. It's the adaptors responsibility to
provide a suitable `withPgClient` callback, and it's up to the user whether or
not they will supply a `pgSettings` object.

## withPgClient

Every adaptor must give a way to build or retrieve a `withPgClient` function
(see the adaptor documentation). This function is typically stored onto the
GraphQL context and will be called by the resources (via the executor) at run
time in order to communicate with the database. The function accepts two
parameters (`pgSettings` and `callback`) and it:

1. creates or retrieves a `PgClient` (see below) connected to the database,
2. if set, applies any settings from the `pgSettings` object (creating a transaction if necessary),
3. calls the callback, passing the client as the only argument,
4. on success releases the client (after committing the transaction if necessary) and returns the result of the callback,
5. on error releases the client (after rolling back the transaction if necessary) and raises the error.

## PgClient

Each adaptor is capable of producing an object that conforms to `PgClient`.
This means it will have at least the following methods:

- `query(opts)` - runs the SQL query `opts.text` (a string) using the
  placeholder values `opts.values` (an array) against the database, and returns
  the result
- `withTransaction(callback)` - 1. starts a transaction, 2. calls and awaits
  the callback (passing the client), 3. on error, rolls back the transaction;
  on success commits the transaction and returns the result

Note that `withTransaction` can be nested, in which case it's common to use
savepoints to implement the subtransactions.

Depending on the adaptor, the PgClient may have additional methods and
properties available - this is a common way of making your ORM's capabilities
available inside a Gra*fast* plan.

## pgSettings

`pgSettings` is an optional string-string map. If set, the values will be set
as temporary session variables in the database connection. This is commonly
useful when you're using PostgreSQL's row-level security. If you do not
use row-level security, you probably won't need this.

## PgSubscriber

A PgSubscriber can be used to leverage the LISTEN/NOTIFY capabilities of a
PostgreSQL database to give your schema realtime (pubsub) capabilities. Not all
adaptors support PgSubscriber, and they each have their own way of building
one.

A `PgSubscriber` instance it typically referenced from the GraphQL context
(e.g. via `context().get('pgSubscriber')`) and then used via the
[`listen()`](/grafast/step-library/standard-steps/listen) step. PgSubscribers
have the standard listening method, `subscribe(topic)`, which returns an async
iterable yielding events from the topic. The subscription can be terminated by
terminating the async iterable.

## `@dataplan/pg/adaptors/pg`

This adaptor uses [the `pg` module](https://www.npmjs.com/package/pg) to
communicate with the database.

### createWithPgClient

To create a `withPgClient` function suitable for usage at runtime,
`createWithPgClient` can be called, passing an object with the following
properties:

- `pool` - a `pg.Pool` instance
- `connectionString` - a PostgreSQL connection string
  (`postgres://user:pass@host/dbname`) to use to create a pool
- `poolConfig` - configuration options for a `pg.Pool` (less the
  `connectionString`) to be used when creating a pool internally using
  `connectionString`

Exactly one of `pool` or `connectionString` must be set, all other options are
optional, and `poolConfig` is ignored if `pool` is specified.

### new PgSubscriber(pool)

Creates a new PgSubscriber instance using the given `pg.Pool` instance, ready
to be stored onto the GraphQL context.

### Example

```ts
import * as pg from "pg";
import { createWithPgClient, PgSubscriber } from "@dataplan/pg/adaptors/pg";

const pool = new pg.Pool({ connectionString: "postgres:///pagila" });

const withPgClient = createWithPgClient({ pool });
const pgSubscriber = new PgSubscriber(pool);

const graphqlContext = { withPgClient, pgSubscriber };

// await grafast({ query: `...`, contextValue: graphqlContext });
```

## Writing your own adaptor

TODO: document this.
