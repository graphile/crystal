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
  inFlight: number;
  idleSince: number;
  stopped: PromiseWithResolvers<never>;
}
interface Checkout {
  borrowers: Set<Borrower>;
  client: PgClient | null;
  controller: AbortController;
  affinities: Set<symbol>;
  names: Set<string>;
  signatures: Set<string>;
  done: PromiseWithResolvers<void>;
  finished: Promise<void>;
  transaction: Transaction | null;
  reservations: number;
  closed: boolean;
  reservationMs: number;
  failure: { error: unknown } | null;
}
interface Pending {
  hints: RoutingHints;
  limit: number;
  borrower: Borrower;
  available: PromiseWithResolvers<Checkout>;
  opening: Checkout | null;
  acquisitionError: { error: unknown } | null;
}
interface ContextQueue {
  checkouts: Set<Checkout>;
  pending: Set<Pending>;
  enqueue: (request: Pending) => void;
  dispatch: (checkout?: Checkout) => void;
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

function idle(checkout: Checkout) {
  for (const borrower of checkout.borrowers) {
    if (borrower.inFlight > 0) {
      return false;
    }
  }
  return true;
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
    pressureChecks: new Set(),
    timer: null,
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
    const checkout: Checkout = {
      borrowers: new Set(),
      client: null,
      controller: new AbortController(),
      affinities: new Set(),
      names: new Set(),
      signatures: new Set(),
      done: Promise.withResolvers(),
      finished: Promise.resolve(),
      transaction: null,
      reservations: 0,
      closed: false,
      reservationMs: idleReservationMs,
      failure: null,
    };
    const { signal } = checkout.controller;
    checkout.done.promise.catch(() => {});
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
          (client) => {
            if (signal.aborted) {
              return;
            }
            checkout.client = client;
            queue.dispatch(checkout);
            if (checkout.borrowers.size === 0) {
              checkout.closed = true;
              return;
            }
            return checkout.done.promise;
          },
          signal,
        );
      })
      .catch((error) => {
        if (!signal.aborted) {
          stop(checkout, error);
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
        wake(pool);
      });
    checkout.finished.catch(() => {});
    return checkout;
  }

  function makeQueue(context: PgExecutorContext): ContextQueue {
    const checkoutsToMatch = new Set<Checkout>();
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
      const ready = route(request, null);
      if (queue.pending.size > 0) {
        pool.waiters.add(dispatch);
        if (ready !== null) {
          // A new read can link its checkout to previously queued work. Scan
          // once per burst, even when many reads introduce routing hints.
          if (checkoutsToMatch.size === 0) {
            queueMicrotask(dispatch);
          }
          checkoutsToMatch.add(ready);
        }
      }
    }
    function route(request: Pending, wanted: Set<Checkout> | null) {
      let ready: Checkout | null = null;
      let opening: Checkout | null = null;
      let live = 0;
      for (const checkout of queue.checkouts) {
        if (checkout.closed) {
          continue;
        }
        live++;
        const match = matchesQueryAffinity(checkout, request.hints);
        if (checkout.client !== null) {
          if (match) {
            ready = checkout;
            break;
          }
          if (ready === null && idle(checkout)) {
            ready = checkout;
          }
        } else if (
          match ||
          (opening === null && wanted !== null && !wanted.has(checkout))
        ) {
          opening = checkout;
        }
      }
      if (ready !== null) {
        assign(request, ready);
      } else if (request.acquisitionError && live === 0) {
        queue.pending.delete(request);
        request.available.reject(request.acquisitionError.error);
      } else {
        if (
          opening === null &&
          !request.acquisitionError &&
          live < request.limit &&
          pool.active.size < pool.limit &&
          (live === 0 || options.canAcquireImmediately?.() !== false)
        ) {
          opening = open(context, queue, live > 0);
        }
        request.opening = opening;
        if (opening !== null) {
          wanted?.add(opening);
          recordQueryAffinity(opening, request.hints);
        }
      }
      return ready;
    }
    function dispatch(checkout?: Checkout) {
      if (checkout !== undefined) {
        checkoutsToMatch.add(checkout);
      }
      // Pull matching waiters before offering idle capacity in FIFO order.
      for (const ready of checkoutsToMatch) {
        if (ready.closed) {
          continue;
        }
        for (const request of queue.pending) {
          if (
            request.opening === ready ||
            matchesQueryAffinity(ready, request.hints)
          ) {
            assign(request, ready);
          }
        }
      }
      checkoutsToMatch.clear();
      const wanted = new Set<Checkout>();
      for (const request of queue.pending) {
        route(request, wanted);
      }
      // Withdraw unused demand before the next checkout can start or apply settings.
      for (const checkout of queue.checkouts) {
        if (
          checkout.client === null &&
          !checkout.closed &&
          !wanted.has(checkout)
        ) {
          checkout.closed = true;
          checkout.controller.abort();
        }
      }
      if (queue.pending.size === 0) {
        pool.waiters.delete(dispatch);
      }
    }
    byContext.set(context, queue);
    return queue;
  }

  async function waitForCheckout(
    queue: ContextQueue,
    request: Pending,
  ): Promise<Checkout> {
    const underPressure = () =>
      queue.pending.has(request) &&
      (request.opening !== null
        ? options.isPoolWaiting?.() === true
        : queue.checkouts.size < request.limit &&
          (pool.active.size >= pool.limit ||
            options.canAcquireImmediately?.() === false));
    pool.pressureChecks.add(underPressure);
    if (underPressure()) {
      reclaim(pool);
    }
    pool.timer ??= setInterval(() => {
      wake(pool);
      for (const check of pool.pressureChecks) {
        if (check()) {
          reclaim(pool);
          break;
        }
      }
    }, 100);
    const timer = setTimeout(() => {
      if (queue.pending.delete(request)) {
        request.available.reject(
          new Error("Shared PostgreSQL client acquisition timed out"),
        );
        queue.dispatch();
      }
    }, acquisitionTimeoutMs);

    try {
      return await request.available.promise;
    } finally {
      clearTimeout(timer);
      pool.pressureChecks.delete(underPressure);
      if (pool.pressureChecks.size === 0 && pool.timer !== null) {
        clearInterval(pool.timer);
        pool.timer = null;
      }
    }
  }

  return async (context, hints, callback) => {
    const { needsTransaction = false, maxClientQueues = 3 } = hints;
    const queue = byContext.get(context) ?? makeQueue(context);
    const borrower: Borrower = {
      inFlight: 1,
      idleSince: 0,
      stopped: Promise.withResolvers(),
    };
    borrower.stopped.promise.catch(() => {});
    const request: Pending = {
      hints,
      limit: Math.max(1, maxClientQueues),
      borrower,
      available: Promise.withResolvers(),
      opening: null,
      acquisitionError: null,
    };
    queue.enqueue(request);
    const checkout = await (queue.pending.has(request)
      ? waitForCheckout(queue, request)
      : request.available.promise);
    let valid = true;
    let reserved = false;
    const outstanding = new Set<Promise<unknown>>();
    try {
      const base = checkout.client!;
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
              if (queue.pending.size > 0) {
                queue.dispatch(checkout);
              }
            },
          );
          outstanding.add(result);
          return result;
        },
      };
      const result = callback(client);
      if (borrower.inFlight === 0 && queue.pending.size > 0) {
        queue.dispatch(checkout);
      }
      return await Promise.race([result, borrower.stopped.promise]);
    } finally {
      valid = false;
      await Promise.allSettled(outstanding);
      checkout.borrowers.delete(borrower);
      if (queue.pending.size > 0) {
        queue.dispatch(checkout);
      }
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
          await checkout.finished;
        }
      }
    }
  };
}
