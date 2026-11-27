import type {
  PgClient,
  PgClientQuery,
  PgClientResult,
  PgExecutorContext,
} from "./executor.ts";

export type SharedPgClient = Pick<PgClient, "query">;
export type WithSharedPgClient = <T>(
  context: PgExecutorContext,
  options: { needsTransaction?: boolean },
  callback: (client: SharedPgClient) => Promise<T> | T,
) => Promise<T>;

interface Borrower {
  inFlight: number;
  idleSince: number;
  stopped: PromiseWithResolvers<never>;
}
interface Checkout {
  borrowers: Set<Borrower>;
  ready: PromiseWithResolvers<PgClient>;
  done: PromiseWithResolvers<void>;
  finished: Promise<void>;
  transaction: Transaction | null;
  reservations: number;
  closed: boolean;
  reservationMs: number;
  acquired: boolean;
  failure: { error: unknown } | null;
}
interface Transaction {
  ready: PromiseWithResolvers<PgClient>;
  done: PromiseWithResolvers<void>;
  finished: Promise<void>;
  closing: boolean;
  queries: Set<Promise<unknown>>;
}
interface PoolState {
  limit: number;
  active: Set<Checkout>;
  pressureChecks: Set<() => boolean>;
  timer: ReturnType<typeof setInterval> | null;
  waiters: Set<() => void>;
}
const pools = new WeakMap<object, PoolState>();

function stop(checkout: Checkout, error: unknown) {
  checkout.closed = true;
  checkout.failure ??= { error };
  for (const borrower of checkout.borrowers) {
    borrower.stopped.reject(error);
  }
}

function wake(pool: PoolState) {
  for (const waiter of [...pool.waiters]) {
    waiter();
  }
}

function reclaim(pool: PoolState) {
  const now = Date.now();
  for (const checkout of pool.active) {
    if (
      !checkout.closed &&
      checkout.borrowers.size > 0 &&
      [...checkout.borrowers].every(
        (borrower) =>
          borrower.inFlight === 0 &&
          now - borrower.idleSince >= checkout.reservationMs,
      )
    ) {
      stop(
        checkout,
        new Error("Shared PostgreSQL client reservation reclaimed"),
      );
      return;
    }
  }
}

function startTransaction(checkout: Checkout, base: PgClient): Transaction {
  const tx: Transaction = {
    ready: Promise.withResolvers(),
    done: Promise.withResolvers(),
    finished: Promise.resolve(),
    closing: false,
    queries: new Set(),
  };
  checkout.transaction = tx;
  tx.done.promise.catch(() => {});
  tx.finished = base
    .withTransaction(
      (client) => {
        tx.ready.resolve(client);
        return tx.done.promise;
      },
      { savepoint: false },
    )
    .catch((error) => {
      tx.ready.reject(error);
      stop(checkout, error);
      throw error;
    })
    .finally(() => {
      checkout.transaction = null;
    });
  tx.finished.catch(() => {});
  return tx;
}

// Register before yielding so ending the transaction waits for every query
// submitted to it, even queries issued by ordinary borrowers.
async function submitQuery<TData>(
  checkout: Checkout,
  base: PgClient,
  opts: PgClientQuery,
): Promise<PgClientResult<TData>> {
  const tx = checkout.transaction;
  if (tx?.closing) {
    await tx.finished;
    return submitQuery<TData>(checkout, base, opts);
  }
  if (checkout.failure !== null) {
    throw checkout.failure.error;
  }
  const query = tx
    ? tx.ready.promise.then((client) => client.query<TData>(opts))
    : base.query<TData>(opts);
  tx?.queries.add(query);
  try {
    return await query;
  } catch (e) {
    stop(checkout, e);
    throw e;
  } finally {
    tx?.queries.delete(query);
  }
}

/**
 * Create a sharing facility for a physical pool. The executor context identifies
 * compatible borrowers and supplies the effective (possibly wrapped) checkout.
 */
export function makeWithSharedPgClient(options: {
  pool: object;
  maxClients: number;
  isPoolWaiting?: () => boolean;
  idleReservationMs?: number;
  acquisitionTimeoutMs?: number;
}): WithSharedPgClient {
  const {
    maxClients,
    idleReservationMs = 5000,
    acquisitionTimeoutMs = 5000,
  } = options;
  if (
    !Number.isInteger(maxClients) ||
    maxClients < 1 ||
    !Number.isFinite(idleReservationMs) ||
    idleReservationMs < 0 ||
    !Number.isFinite(acquisitionTimeoutMs) ||
    acquisitionTimeoutMs <= 0
  ) {
    throw new Error("Invalid shared PostgreSQL client limits");
  }
  const pool: PoolState = pools.get(options.pool) ?? {
    limit: maxClients,
    active: new Set<Checkout>(),
    pressureChecks: new Set(),
    timer: null,
    waiters: new Set<() => void>(),
  };
  // Services sharing one physical pool must all honour its smallest budget.
  pool.limit = Math.min(pool.limit, maxClients);
  pools.set(options.pool, pool);
  const byContext = new WeakMap<PgExecutorContext, Checkout>();

  function open(context: PgExecutorContext): Checkout {
    const checkout: Checkout = {
      borrowers: new Set(),
      ready: Promise.withResolvers(),
      done: Promise.withResolvers(),
      finished: Promise.resolve(),
      transaction: null,
      reservations: 0,
      closed: false,
      reservationMs: idleReservationMs,
      acquired: false,
      failure: null,
    };
    checkout.done.promise.catch(() => {});
    byContext.set(context, checkout);
    pool.active.add(checkout);
    checkout.finished = Promise.resolve()
      .then(() =>
        context.withPgClient(context.pgSettings, (client) => {
          checkout.acquired = true;
          checkout.ready.resolve(client);
          return checkout.done.promise;
        }),
      )
      .catch((error) => {
        checkout.ready.reject(error);
        stop(checkout, error);
        throw error;
      })
      .finally(() => {
        if (byContext.get(context) === checkout) {
          byContext.delete(context);
        }
        pool.active.delete(checkout);
        wake(pool);
      });
    checkout.finished.catch(() => {});
    return checkout;
  }

  return async (context, { needsTransaction = false }, callback) => {
    const deadline = Promise.withResolvers<never>();
    const timer = setTimeout(
      () =>
        deadline.reject(
          new Error("Shared PostgreSQL client acquisition timed out"),
        ),
      acquisitionTimeoutMs,
    );
    const borrower: Borrower = {
      inFlight: 1,
      idleSince: 0,
      stopped: Promise.withResolvers(),
    };
    borrower.stopped.promise.catch(() => {});
    const available = Promise.withResolvers<Checkout>();
    let opening: Checkout | null = null;
    function acquire() {
      const existing = byContext.get(context);
      const checkout =
        existing && !existing.closed
          ? existing
          : pool.active.size < pool.limit
            ? open(context)
            : null;
      if (checkout) {
        pool.waiters.delete(acquire);
        opening = checkout;
        checkout.borrowers.add(borrower);
        available.resolve(checkout);
      }
    }
    pool.waiters.add(acquire);
    acquire();
    const underPressure = () =>
      pool.waiters.has(acquire) ||
      (opening?.acquired === false && options.isPoolWaiting?.() === true);
    pool.pressureChecks.add(underPressure);
    if (underPressure()) {
      reclaim(pool);
    }
    pool.timer ??= setInterval(() => {
      for (const check of pool.pressureChecks) {
        if (check()) {
          reclaim(pool);
          break;
        }
      }
    }, 100);
    function endAcquisition() {
      clearTimeout(timer);
      pool.pressureChecks.delete(underPressure);
      if (pool.pressureChecks.size === 0 && pool.timer !== null) {
        clearInterval(pool.timer);
        pool.timer = null;
      }
    }
    let checkout: Checkout;
    try {
      checkout = await Promise.race([available.promise, deadline.promise]);
    } catch (e) {
      endAcquisition();
      throw e;
    } finally {
      pool.waiters.delete(acquire);
    }
    let valid = true;
    let reserved = false;
    const outstanding = new Set<Promise<unknown>>();
    try {
      const base = await Promise.race([
        checkout.ready.promise,
        deadline.promise,
      ]);
      endAcquisition();
      if (needsTransaction) {
        if (checkout.transaction?.closing) {
          await checkout.transaction.finished;
        }
        if (checkout.closed) {
          throw new Error("Shared PostgreSQL client released");
        }
        const transaction =
          checkout.transaction ?? startTransaction(checkout, base);
        checkout.reservations++;
        reserved = true;
        await transaction.ready.promise;
      }
      borrower.inFlight = 0;
      borrower.idleSince = Date.now();
      const client: SharedPgClient = {
        query<TData>(opts: PgClientQuery) {
          if (!valid || checkout.closed) {
            return Promise.reject(
              new Error("Shared PostgreSQL client released"),
            );
          }
          borrower.inFlight++;
          const result = submitQuery<TData>(checkout, base, opts).finally(
            () => {
              outstanding.delete(result);
              borrower.inFlight--;
              borrower.idleSince = Date.now();
            },
          );
          outstanding.add(result);
          return result;
        },
      };
      return await Promise.race([callback(client), borrower.stopped.promise]);
    } finally {
      valid = false;
      endAcquisition();
      await Promise.allSettled(outstanding);
      checkout.borrowers.delete(borrower);
      const tx = checkout.transaction;
      try {
        if (reserved && --checkout.reservations === 0 && tx) {
          tx.closing = true;
          await Promise.allSettled(tx.queries);
          if (checkout.failure) {
            tx.done.reject(checkout.failure.error);
          } else {
            tx.done.resolve();
          }
          await tx.finished;
        }
      } finally {
        if (checkout.borrowers.size === 0) {
          checkout.closed = true;
          if (checkout.transaction?.closing) {
            await checkout.transaction.finished.catch(() => {});
          }
          if (checkout.failure) {
            checkout.done.reject(checkout.failure.error);
          } else {
            checkout.done.resolve();
          }
          // A timed-out pool checkout can still be waiting inside the driver.
          if (borrower.inFlight === 0) {
            await checkout.finished;
          }
        }
      }
    }
  };
}
