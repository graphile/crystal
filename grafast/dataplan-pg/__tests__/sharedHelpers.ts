// Shared with postgraphile

import type { Pool } from "pg";

import type { PgClientQuery, WithPgClient } from "../src";
import { createWithPgClient } from "../src/adaptors/node-postgres.js";

function queuedWPC(withPgClient: WithPgClient): WithPgClient {
  let queue: Promise<void> | null;
  return (pgSettings, callback) => {
    const result = queue
      ? queue.then(() => withPgClient(pgSettings, callback))
      : withPgClient(pgSettings, callback);
    const nextQueue = result.then(
      () => {},
      () => {},
    );
    queue = nextQueue;
    queue.then(() => {
      if (queue === nextQueue) {
        queue = null;
      }
    });
    return result;
  };
}

/**
 * Make a test "withPgClient" that writes queries issued into the passed
 * 'queries' array.
 *
 * Manages transactions automatically - if pgSettings are supplied then the
 * entire thing will be wrapped in a transaction and calls  to withTransaction
 * will trigger a savepoint, otherwise no transaction is required initially and
 * withTransaction will simply issue 'BEGIN'.
 */
export async function withTestWithPgClient<T>(
  testPool: Pool,
  queries: PgClientQuery[],
  direct: boolean,
  callback: (withPgClient: WithPgClient) => Promise<T>,
): Promise<T> {
  const poolClient = await testPool.connect();
  const oldQuery = poolClient.query;
  poolClient.query = function (...args: any[]) {
    const opts = typeof args[0] === "string" ? { text: args[0] } : args[0];
    if (!opts.text.includes("--ignore--")) {
      if (!direct) {
        switch (opts.text) {
          case "savepoint tx": {
            queries.push({ text: "begin /*fake*/" });
            break;
          }
          case "release savepoint tx": {
            queries.push({ text: "commit /*fake*/" });
            break;
          }
          case "rollback to savepoint tx": {
            queries.push({ text: "rollback /*fake*/" });
            break;
          }
          default: {
            queries.push(opts);
          }
        }
      } else {
        queries.push(opts);
      }
    }
    return oldQuery.apply(this, args);
  };
  try {
    if (direct) {
      const withPgClient = createWithPgClient({
        poolClient,
      });
      return await callback(queuedWPC(withPgClient));
    } else {
      await poolClient.query("begin --ignore--");
      try {
        const withPgClient = createWithPgClient({
          poolClient,
          poolClientIsInTransaction: true,
        });
        return await callback(queuedWPC(withPgClient));
      } finally {
        await poolClient.query("rollback --ignore--");
      }
    }
  } finally {
    poolClient.query = oldQuery;
    poolClient.release();
  }
}
