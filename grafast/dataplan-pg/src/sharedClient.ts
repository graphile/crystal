import type {
  PgClient,
  PgClientQuery,
  PgClientResult,
  PgExecutorContext,
} from "./executor.ts";

export type SharedPgClient = Pick<PgClient, "query">;
interface RoutingHints {
  affinity?: symbol;
  name?: string;
  signature?: string;
}

export type WithSharedPgClient = <T>(
  context: PgExecutorContext,
  options: RoutingHints & {
    needsTransaction?: boolean;
    maxClientQueues?: number;
  },
  callback: (client: SharedPgClient) => Promise<T> | T,
) => Promise<T>;

interface Borrower {
  /** Null while acquiring or running a query. */
  reservedUntil: number | null;
  stopped: PromiseWithResolvers<never>;
}

class Checkout {
  readonly borrowers = new Set<Borrower>();
  readonly controller = new AbortController();
  readonly affinities = new Set<symbol>();
  readonly names = new Set<string>();
  readonly signatures = new Set<string>();
  readonly done = Promise.withResolvers<void>();
  finished = Promise.resolve();
  client: PgClient | null = null;
  transaction: Transaction | null = null;
  failure: { error: unknown } | null = null;
  closed = false;

  isIdle(at = Infinity) {
    for (const borrower of this.borrowers) {
      if (borrower.reservedUntil === null || borrower.reservedUntil > at) {
        return false;
      }
    }
    return true;
  }

  fail(error: unknown) {
    this.closed = true;
    this.failure ??= { error };
    for (const borrower of this.borrowers) {
      borrower.stopped.reject(error);
    }
  }
}

interface Pending {
  hints: RoutingHints;
  limit: number;
  deadline: number;
  borrower: Borrower;
  available: PromiseWithResolvers<Checkout>;
  opening: Checkout | null;
  acquisitionError: { error: unknown } | null;
}
interface ContextQueue {
  checkouts: Set<Checkout>;
  pending: Set<Pending>;
  enqueue: (request: Pending) => void;
  dispatch: () => void;
}

type AffinityHistory = Pick<Checkout, "affinities" | "names" | "signatures">;

export function recordQueryAffinity(
  checkout: AffinityHistory,
  { affinity, name, signature }: RoutingHints,
) {
  if (affinity !== undefined) {
    checkout.affinities.add(affinity);
  }
  if (name !== undefined) {
    checkout.names.add(name);
  }
  if (signature !== undefined) {
    checkout.signatures.add(signature);
  }
}

export function matchesQueryAffinity(
  checkout: AffinityHistory,
  { affinity, name, signature }: RoutingHints,
) {
  return (
    (affinity !== undefined && checkout.affinities.has(affinity)) ||
    (name !== undefined && checkout.names.has(name)) ||
    (signature !== undefined && checkout.signatures.has(signature))
  );
}

interface Transaction {
  ready: PromiseWithResolvers<PgClient>;
  done: PromiseWithResolvers<void>;
  finished: Promise<void>;
  reservations: number;
  queries: Set<Promise<unknown>>;
}
interface PoolState {
  limit: number;
  active: Set<Checkout>;
  waiters: Set<() => void>;
}
const pools = new WeakMap<object, PoolState>();

function reclaim(pool: PoolState) {
  const now = performance.now();
  for (const checkout of pool.active) {
    if (
      !checkout.closed &&
      checkout.borrowers.size > 0 &&
      checkout.isIdle(now)
    ) {
      checkout.fail(
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
    reservations: 0,
    queries: new Set(),
  };
  checkout.transaction = tx;
  tx.finished = base
    .withTransaction(
      async (client) => {
        tx.ready.resolve(client);
        await tx.done.promise;
        await Promise.allSettled(tx.queries);
        if (checkout.failure) {
          throw checkout.failure.error;
        }
      },
      { savepoint: false },
    )
    .catch((error) => {
      tx.ready.reject(error);
      checkout.fail(error);
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
  if (tx?.reservations === 0) {
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
    checkout.fail(e);
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
  canAcquireImmediately?: () => boolean;
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
    waiters: new Set<() => void>(),
  };
  // Services sharing one physical pool must all honour its smallest budget.
  pool.limit = Math.min(pool.limit, maxClients);
  pools.set(options.pool, pool);
  const byContext = new WeakMap<PgExecutorContext, ContextQueue>();

  function open(
    context: PgExecutorContext,
    queue: ContextQueue,
    speculative: boolean,
  ): Checkout {
    const checkout = new Checkout();
    const { signal } = checkout.controller;
    queue.checkouts.add(checkout);
    pool.active.add(checkout);
    checkout.finished = Promise.resolve()
      .then(() => {
        signal.throwIfAborted();
        // Another checkout in this burst may have just taken the last connection.
        if (speculative && options.canAcquireImmediately?.() === false) {
          checkout.closed = true;
          return;
        }
        return context.withPgClient(
          context.pgSettings,
          async (client) => {
            if (signal.aborted) {
              return;
            }
            checkout.client = client;
            queue.dispatch();
            if (checkout.borrowers.size === 0) {
              checkout.closed = true;
              return;
            }
            await checkout.done.promise;
            if (checkout.failure) {
              throw checkout.failure.error;
            }
          },
          signal,
        );
      })
      .catch((error) => {
        if (!signal.aborted) {
          checkout.fail(error);
          for (const request of queue.pending) {
            if (request.opening === checkout) {
              request.acquisitionError = { error };
            }
          }
          throw error;
        }
      })
      .finally(() => {
        queue.checkouts.delete(checkout);
        pool.active.delete(checkout);
        for (const dispatch of pool.waiters) {
          dispatch();
        }
      });
    checkout.finished.catch(() => {});
    return checkout;
  }

  function makeQueue(context: PgExecutorContext): ContextQueue {
    let scheduled: Promise<void> | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const queue: ContextQueue = {
      checkouts: new Set(),
      pending: new Set(),
      enqueue,
      dispatch,
    };
    function assign(request: Pending, checkout: Checkout) {
      recordQueryAffinity(checkout, request.hints);
      checkout.borrowers.add(request.borrower);
      queue.pending.delete(request);
      request.available.resolve(checkout);
    }
    function enqueue(request: Pending) {
      queue.pending.add(request);
      scheduled ??= Promise.resolve().then(() => {
        scheduled = undefined;
        dispatch(true);
      });
    }
    function dispatch(checkPressure = false) {
      // All requests in this context have the same acquisition timeout.
      const now = performance.now();
      for (const request of queue.pending) {
        if (request.deadline > now) {
          break;
        }
        queue.pending.delete(request);
        request.available.reject(
          new Error("Shared PostgreSQL client acquisition timed out"),
        );
      }
      const ready: Checkout[] = [];
      const openings: Checkout[] = [];
      for (const checkout of queue.checkouts) {
        if (checkout.closed) {
          continue;
        }
        if (checkout.client === null) {
          openings.push(checkout);
        } else {
          ready.push(checkout);
          // Pull matching waiters before offering idle capacity in FIFO order.
          for (const request of queue.pending) {
            if (
              request.opening === checkout ||
              matchesQueryAffinity(checkout, request.hints)
            ) {
              assign(request, checkout);
            }
          }
        }
      }

      // Keep an acquisition only if at least one remaining waiter can use it.
      const unused = new Set(openings);
      let underPressure = false;
      for (const request of queue.pending) {
        const matches = (checkout: Checkout) =>
          matchesQueryAffinity(checkout, request.hints);
        const checkout =
          ready.find(matches) ?? ready.find((candidate) => candidate.isIdle());
        if (checkout !== undefined) {
          assign(request, checkout);
          continue;
        }

        const live = ready.length + openings.length;
        if (live === 0 && request.acquisitionError) {
          queue.pending.delete(request);
          request.available.reject(request.acquisitionError.error);
          continue;
        }
        let opening = openings.find(matches) ?? unused.values().next().value;
        if (opening === undefined && live < request.limit) {
          if (
            pool.active.size >= pool.limit ||
            (live > 0 && options.canAcquireImmediately?.() === false)
          ) {
            underPressure = true;
          } else if (request.acquisitionError === null) {
            opening = open(context, queue, live > 0);
            openings.push(opening);
          }
        }
        request.opening = opening ?? null;
        if (opening !== undefined) {
          unused.delete(opening);
          recordQueryAffinity(opening, request.hints);
          if (checkPressure && options.isPoolWaiting?.() === true) {
            underPressure = true;
          }
        }
      }
      // Withdraw unused demand before the next checkout can start or apply settings.
      for (const checkout of unused) {
        checkout.closed = true;
        checkout.controller.abort();
      }
      const first = queue.pending.values().next().value;
      if (first === undefined) {
        pool.waiters.delete(dispatch);
        clearTimeout(timer);
        timer = undefined;
      } else {
        pool.waiters.add(dispatch);
        timer ??= setTimeout(
          () => {
            timer = undefined;
            dispatch(true);
          },
          Math.min(100, first.deadline - performance.now()),
        );
        if (checkPressure && underPressure) {
          reclaim(pool);
        }
      }
    }
    byContext.set(context, queue);
    return queue;
  }

  return async (context, hints, callback) => {
    const { needsTransaction = false, maxClientQueues = 3 } = hints;
    const queue = byContext.get(context) ?? makeQueue(context);
    const borrower: Borrower = {
      reservedUntil: null,
      stopped: Promise.withResolvers(),
    };
    borrower.stopped.promise.catch(() => {});
    const request: Pending = {
      hints,
      limit: Math.max(1, maxClientQueues),
      deadline: performance.now() + acquisitionTimeoutMs,
      borrower,
      available: Promise.withResolvers(),
      opening: null,
      acquisitionError: null,
    };
    queue.enqueue(request);
    const checkout = await request.available.promise;
    let valid = true;
    let transaction: Transaction | null = null;
    const outstanding = new Set<Promise<unknown>>();
    try {
      const base = checkout.client!;
      if (needsTransaction) {
        if (checkout.transaction?.reservations === 0) {
          await checkout.transaction.finished;
        }
        if (checkout.closed) {
          throw new Error("Shared PostgreSQL client released");
        }
        transaction = checkout.transaction ?? startTransaction(checkout, base);
        transaction.reservations++;
        await transaction.ready.promise;
      }
      borrower.reservedUntil = performance.now() + idleReservationMs;
      const client: SharedPgClient = {
        query<TData>(opts: PgClientQuery) {
          if (!valid || checkout.closed) {
            return Promise.reject(
              new Error("Shared PostgreSQL client released"),
            );
          }
          borrower.reservedUntil = null;
          const result = submitQuery<TData>(checkout, base, opts).finally(
            () => {
              outstanding.delete(result);
              if (outstanding.size === 0) {
                borrower.reservedUntil = performance.now() + idleReservationMs;
                if (queue.pending.size > 0) {
                  queue.dispatch();
                }
              }
            },
          );
          outstanding.add(result);
          return result;
        },
      };
      const result = callback(client);
      if (outstanding.size === 0 && queue.pending.size > 0) {
        queue.dispatch();
      }
      return await Promise.race([result, borrower.stopped.promise]);
    } finally {
      valid = false;
      await Promise.allSettled(outstanding);
      try {
        if (transaction && --transaction.reservations === 0) {
          // Closing the transaction is still work in flight on this checkout.
          borrower.reservedUntil = null;
          transaction.done.resolve();
          await transaction.finished;
        }
      } finally {
        checkout.borrowers.delete(borrower);
        if (queue.pending.size > 0) {
          queue.dispatch();
        }
        if (checkout.borrowers.size === 0) {
          checkout.closed = true;
          checkout.done.resolve();
          await checkout.finished;
        }
      }
    }
  };
}
