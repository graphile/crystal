// Shared with postgraphile

import type { Pool, QueryConfig } from "pg";

import { createWithPgClient } from "../dist/adaptors/pg.js";
import {
  type PgClientQuery,
  PgExecutor,
  type PgExecutorInput,
  type PgExecutorOptions,
  type WithPgClient,
} from "../dist/index.js";

export { createTestDatabase, dropTestDatabase } from "@localrepo/test-helpers";

function noop() {}

/**
 * For the tests we want to ensure that `withPgClient` calls hang waiting for
 * the previous to complete - this allows our snapshots to be in a consistent
 * predictable order. You would not want this in production!
 */
function queuedWPC(withPgClient: WithPgClient): WithPgClient {
  let queue: Promise<void> | null;
  return (pgSettings, callback) => {
    const result = queue
      ? queue.then(() => withPgClient(pgSettings, callback))
      : withPgClient(pgSettings, callback);
    const nextQueue = result.then(noop, noop);
    queue = nextQueue;
    queue.then(() => {
      if (queue === nextQueue) {
        queue = null;
      }
    });
    return result;
  };
}

const originalExecuteWithoutCache = PgExecutor.prototype.executeWithoutCache;
const originalExecuteWithQueue = PgExecutor.prototype.executeWithQueue;

/**
 * Make a test "withPgClient" that writes queries issued into the passed
 * 'queries' array.
 *
 * Manages transactions automatically - if pgSettings are supplied then the
 * entire thing will be wrapped in a transaction and calls to withTransaction
 * will trigger a savepoint, otherwise no transaction is required initially and
 * withTransaction will simply issue 'BEGIN'.
 *
 * If !direct then everything will be wrapped in transactions and savepoints so
 * that it can be rolled back at the end.
 */
export async function withTestWithPgClient<T>(
  testPool: Pool,
  queries: PgClientQuery[],
  direct: boolean,
  callback: (withPgClient: WithPgClient) => Promise<T>,
): Promise<T> {
  let currentBatch: {
    promises: Set<Promise<any>>;
    queries: PgClientQuery[];
    end: {
      promise: Promise<void>;
      resolve: () => void;
    };
  } | null = null;
  function finishCurrentBatch() {
    if (!currentBatch) return;
    const currentBatchQueries = currentBatch.queries;
    const endBatch = currentBatch.end.resolve;
    currentBatch = null;
    queries.push(...currentBatchQueries);
    endBatch();
  }
  function addBatch<TResult>(promise: Promise<TResult>): Promise<TResult> {
    if (!currentBatch) {
      currentBatch = {
        promises: new Set([promise]),
        queries: [],
        end: Promise.withResolvers<void>(),
      };
    } else {
      currentBatch.promises.add(promise);
    }
    function rm() {
      if (!currentBatch) return;
      currentBatch.promises.delete(promise);
      if (currentBatch.promises.size === 0) {
        finishCurrentBatch();
      }
    }
    promise.then(rm, rm);
    return currentBatch.end.promise.then(() => promise);
  }

  function addQuery(query: QueryConfig, flushBatch = false) {
    if (flushBatch) {
      finishCurrentBatch();
    }
    if (currentBatch) {
      currentBatch.queries.push(query);
    } else {
      queries.push(query);
    }
  }

  const poolClient = await testPool.connect();
  const oldQuery = poolClient.query;
  poolClient.query = function (this: typeof poolClient, ...args: any[]) {
    const opts = typeof args[0] === "string" ? { text: args[0] } : args[0];
    if (!opts.text.includes("--ignore--")) {
      if (direct) {
        addQuery(opts, direct);
      } else {
        // Because we're wrapping everything in a transaction already, we need
        // to "pretend" for the SQL snapshots that this was actually
        // begin/commit/rollback.
        switch (opts.text) {
          case "savepoint tx": {
            addQuery({ text: "begin; /*fake*/" }, true);
            break;
          }
          case "release savepoint tx": {
            addQuery({ text: "commit; /*fake*/" }, true);
            break;
          }
          case "rollback to savepoint tx": {
            addQuery({ text: "rollback; /*fake*/" }, true);
            break;
          }
          default: {
            addQuery(opts);
          }
        }
      }
    }
    return (oldQuery as (...args: any[]) => unknown).apply(this, args);
  } as typeof poolClient.query;
  // Release concurrent executor calls together for consistent SQL snapshots.
  if (
    originalExecuteWithoutCache !== PgExecutor.prototype.executeWithoutCache ||
    originalExecuteWithQueue !== PgExecutor.prototype.executeWithQueue
  ) {
    throw new Error("Already patched!");
  }
  function withBatchCompletion(execute: PgExecutor["executeWithQueue"]) {
    return function <TInput, TOutput>(
      this: PgExecutor,
      values: readonly PgExecutorInput<TInput>[],
      options: PgExecutorOptions,
    ) {
      const executeTyped = execute<TInput, TOutput>;
      return addBatch(executeTyped.call(this, values, options));
    };
  }
  PgExecutor.prototype.executeWithoutCache = withBatchCompletion(
    originalExecuteWithoutCache,
  );
  PgExecutor.prototype.executeWithQueue = withBatchCompletion(
    originalExecuteWithQueue,
  );
  try {
    if (direct) {
      const withPgClient = createWithPgClient({
        poolClient,
      });
      return await callback(queuedWPC(withPgClient));
    } else {
      await poolClient.query("begin; --ignore--");
      let alive = true;
      try {
        const withPgClient = createWithPgClient({
          poolClient,
          poolClientIsInTransaction: true,
        });
        // Because we're already in a transaction, to pretend that we're _not_
        // in a transaction we actually have to create a sub-transaction so
        // that a statement failure can automatically rollback as if we weren't
        // in a transaction...
        const withPgClientWithSavepoints: WithPgClient = async (
          pgSettings,
          callback,
        ) => {
          if (!alive) {
            throw new Error(
              "Test transaction has already been ended - async operations shouldn't keep happening after grafast returns",
            );
          }
          // No transaction here; honest, gov!
          await poolClient.query("savepoint notxhonest; --ignore--");
          let result: any;
          try {
            result = await withPgClient(pgSettings, callback);
          } catch (e) {
            if (alive) {
              try {
                await poolClient.query(
                  "rollback to savepoint notxhonest; --ignore--",
                );
              } catch (e2) {
                console.error(
                  `Error occurred releasing 'notxhonest' savepoint in tests`,
                  e2,
                );
              }
            }
            throw e;
          }
          if (!alive) {
            throw new Error(
              "Test transaction has already been ended - async operations shouldn't keep happening after grafast returns",
            );
          }
          await poolClient.query("release savepoint notxhonest; --ignore--");

          return result;
        };
        return await callback(queuedWPC(withPgClientWithSavepoints));
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 0));
        alive = false;
        await poolClient.query("rollback; --ignore--");
      }
    }
  } finally {
    PgExecutor.prototype.executeWithoutCache = originalExecuteWithoutCache;
    PgExecutor.prototype.executeWithQueue = originalExecuteWithQueue;
    poolClient.query = oldQuery;
    poolClient.release();
  }
}
