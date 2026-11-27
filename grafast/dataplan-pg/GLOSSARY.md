# `@dataplan/pg` glossary

## Clients and connections

- **Borrower** — One invocation of `withSharedPgClient`. Each borrower has its
  own idle reservation and can request a transaction.
- **Shared client** (`SharedPgClient`) — The query-only object passed to one
  borrower's callback. Separate objects let the scheduler track each borrower's
  outstanding queries even when several borrowers share a checkout.
- **Checkout** — One acquisition through `withPgClient`, from the request for an
  adaptor client until its release. A shared checkout counts once towards the
  pool's shared-client limit, regardless of how many borrowers use it.
- **Adaptor client** (`PgClient`) — The object supplied by `withPgClient`. It
  implements `query` and `withTransaction`. When the scheduler enters a
  transaction, it directs shared queries through the adaptor client supplied to
  the transaction callback.
- **Driver client** — The object the adaptor uses to send SQL to PostgreSQL. In
  the `pg` adaptor this is a `pg.PoolClient`, exposed on the adaptor client as
  `rawClient`.
- **Connection** — The database connection used by the driver client. A pool can
  reuse one connection across successive checkouts.
- **Backend PID** — The process ID PostgreSQL reports via `pg_backend_pid()`.
  Tests can compare PIDs to verify that two queries reached the same backend.

## Transactions and cursors

- **Ambient transaction** — A transaction already active when a borrower
  requests one, for example because the adaptor applied `pgSettings`. The
  borrower can join it with `needsTransaction: true`. Its original owner
  controls when it ends.
- **Cursor** — A PostgreSQL cursor used by `executeStream` to fetch rows in
  batches. The stream's borrower uses the same checkout and transaction to
  declare, fetch from and close its cursor. Between fetches, another borrower
  can issue its own query on that connection.
