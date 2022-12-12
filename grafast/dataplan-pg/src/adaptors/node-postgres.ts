/**
 * This is an adaptor for the `pg` module.
 */

// TODO: don't import 'pg' or '@graphile/lru', we don't want these to be dependencies of @dataplan/pg.
// TODO: This file should only be available via direct (path) import, it should not be included in the main package exports.

import LRU from "@graphile/lru";
import type { PromiseOrDirect } from "grafast";
import type { Pool, QueryArrayConfig, QueryConfig, QueryResultRow } from "pg";
import * as pg from "pg";

import type {
  PgClient,
  PgClientQuery,
  PgClientResult,
  WithPgClient,
} from "../executor.js";

// TODO: security sensitive, review this.
function escapeIdentifier(str: string): string {
  return '"' + str.replace(/"/g, '""') + '"';
}

declare global {
  namespace Grafast {
    interface PgDatabaseAdaptorOptions {
      "@dataplan/pg/adaptors/node-postgres": NodePostgresAdaptorOptions;
    }
  }
}

// Set `DATAPLAN_PG_PREPARED_STATEMENT_CACHE_SIZE=0` to disable prepared statements
const cacheSizeFromEnv = process.env.DATAPLAN_PG_PREPARED_STATEMENT_CACHE_SIZE
  ? parseInt(process.env.DATAPLAN_PG_PREPARED_STATEMENT_CACHE_SIZE, 10)
  : null;
/**
 * If 0, prepared statements are disabled. Otherwise how many prepared
 * statements should we keep around at any one time?
 */
const PREPARED_STATEMENT_CACHE_SIZE =
  !!cacheSizeFromEnv || cacheSizeFromEnv === 0 ? cacheSizeFromEnv : 100;

const $$isSetup = Symbol("isConfiguredForDataplanPg");

/**
 * \> JIT compilation is beneficial primarily for long-running CPU-bound
 * \> queries. Frequently these will be analytical queries. For short
 * \> queries the added overhead of performing JIT compilation will
 * \> often be higher than the time it can save.
 * -- https://www.postgresql.org/docs/14/jit-decision.html
 *
 * `@dataplan/pg` is designed for extremely fast queries, but sometimes
 * user code can make Postgres think the cost of the query is going to
 * be very high (this is especially the case when lots of "computed
 * column functions" are used), and thus enables JIT. In testing we've
 * seen queries that would take 50ms with `jit=off` take 8200ms with
 * jit on. As such we've made the decision to disable jit for all
 * queries.
 *
 * If you don't agree with our decision, disable this by setting the
 * environmental variable `DATAPLAN_PG_DONT_DISABLE_JIT=1`.
 */
const DONT_DISABLE_JIT = process.env.DATAPLAN_PG_DONT_DISABLE_JIT === "1";

function newNodePostgresPgClient(
  pgClient: pg.PoolClient,
  subscriptions: Map<string, ((notification: any) => void)[]>,
  txLevel: number,
  alwaysQueue: boolean,
  alreadyInTransaction: boolean,
): PgClient {
  let queue: Promise<void> | null = null;
  const addToQueue = <T>(callback: () => Promise<T>): Promise<T> => {
    const result = queue ? queue.then(callback) : callback();

    const clearIfSame = () => {
      // Clear queue unless it has moved on
      if (queue === newQueue) {
        queue = null;
      }
    };
    const newQueue = result.then(clearIfSame, clearIfSame);
    queue = newQueue;

    return result;
  };
  return {
    withTransaction(callback) {
      // Transactions always queue; creating queue if need be
      return addToQueue(async () => {
        if (txLevel === 0 && !alreadyInTransaction) {
          await pgClient.query({ text: "begin" });
        } else {
          await pgClient.query({
            text: `savepoint tx${txLevel === 0 ? "" : txLevel}`,
          });
        }
        try {
          const newClient = newNodePostgresPgClient(
            pgClient,
            subscriptions,
            txLevel + 1,
            alwaysQueue,
            alreadyInTransaction,
          );
          const innerResult = await callback(newClient);
          if (txLevel === 0 && !alreadyInTransaction) {
            await pgClient.query({ text: "commit" });
          } else {
            await pgClient.query({
              text: `release savepoint tx${txLevel === 0 ? "" : txLevel}`,
            });
          }
          return innerResult;
        } catch (e) {
          try {
            if (txLevel === 0 && !alreadyInTransaction) {
              await pgClient.query({ text: "rollback" });
            } else {
              await pgClient.query({
                text: `rollback to savepoint tx${txLevel === 0 ? "" : txLevel}`,
              });
            }
          } catch (e2) {
            console.error(`Error occurred whilst rolling back: ${e}`);
          }
          throw e;
        }
      });
    },
    query<TData>(opts: PgClientQuery): Promise<PgClientResult<TData>> {
      // Queries only need to queue if there's a queue already
      if (queue || alwaysQueue) {
        return addToQueue(doIt);
      } else {
        return doIt();
      }
      function doIt() {
        const { text, name, values, arrayMode } = opts;
        const queryObj: QueryConfig | QueryArrayConfig = arrayMode
          ? {
              text,
              values,
              rowMode: "array",
            }
          : {
              text,
              values,
            };

        if (PREPARED_STATEMENT_CACHE_SIZE > 0 && name != null) {
          // Hacking into pgClient internals - this is dangerous, but it's the only way I know to get a prepared statement LRU
          const connection = (pgClient as any).connection;
          if (connection && connection.parsedStatements) {
            if (!connection._graphilePreparedStatementCache) {
              connection._graphilePreparedStatementCache = new LRU({
                maxLength: PREPARED_STATEMENT_CACHE_SIZE,
                dispose(key) {
                  if (connection.parsedStatements[key]) {
                    pgClient
                      .query(`deallocate ${pgClient.escapeIdentifier(key)}`)
                      .then(() => {
                        delete connection.parsedStatements[key];
                      })
                      .catch((e) => {
                        // eslint-disable-next-line no-console
                        console.error("Error releasing prepared query", e);
                      });
                  }
                },
              });
            }
            if (!connection._graphilePreparedStatementCache.get(name)) {
              // We're relying on dispose to clear out the old ones.
              connection._graphilePreparedStatementCache.set(name, true);
            }
            queryObj.name = name;
          }
        }

        // TODO: fix the never
        return pgClient.query<TData extends QueryResultRow ? TData : never>(
          queryObj,
        );
      }
    },
    async listen(topic, callback) {
      const subs = subscriptions.get(topic) ?? [];
      if (subs.length === 0) {
        subs.push(callback);
        subscriptions.set(topic, subs);
        pgClient
          .query({ text: `listen ${escapeIdentifier(topic)}` })
          .catch(() => {
            /*nom nom nom*/
          });
      } else {
        subs.push(callback);
      }
      return () => {
        const i = subs.indexOf(callback);
        if (i >= 0) {
          subs.splice(i, 1);
          if (subs.length === 0) {
            pgClient
              .query({ text: `unlisten ${escapeIdentifier(topic)}` })
              .catch(() => {
                /*nom nom nom*/
              });
          }
        }
      };
    },
  };
}

const $$queue = Symbol("tag");

async function makeNodePostgresWithPgClient_inner<T>(
  pgClient: pg.PoolClient,
  pgSettings: { [key: string]: string } | null,
  callback: (client: PgClient) => T | Promise<T>,
  alwaysQueue: boolean,
  alreadyInTransaction: boolean,
) {
  /** Transaction level; 0 = no transaction; 1 = begin; 2,... = savepoint */
  const pgSettingsEntries = pgSettings
    ? Object.entries(pgSettings).map(([k, v]) => [k, "" + v])
    : [];

  const subscriptions = new Map<string, ((notification: any) => void)[]>();

  const notificationCallback = (notification: pg.Notification) => {
    const subs = subscriptions.get(notification.channel);
    if (subs) {
      for (const cb of subs) {
        try {
          cb(notification);
        } catch {
          /*nom nom nom*/
        }
      }
    }
  };

  // TODO: under what situations is this actually required? We added it to
  // force test queries that were sharing the same client to run in series
  // rather than parallel (probably for the filter plugin test suite?) but it
  // adds a tiny bit of overhead and most likely is only needed for people
  // using makeWithPgClientViaNodePostgresClientAlreadyInTransaction.
  while (pgClient[$$queue]) {
    await pgClient[$$queue];
  }

  return (pgClient[$$queue] = (async () => {
    pgClient.on("notification", notificationCallback);

    try {
      // If there's pgSettings; create a transaction and set them, otherwise no transaction needed
      if (pgSettingsEntries.length > 0) {
        await pgClient.query({
          text: alreadyInTransaction ? "savepoint tx" : "begin",
        });
        try {
          await pgClient.query({
            text: "select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el",
            values: [JSON.stringify(pgSettingsEntries)],
          });
          const client = newNodePostgresPgClient(
            pgClient,
            subscriptions,
            1,
            alwaysQueue,
            alreadyInTransaction,
          );
          const result = await callback(client);
          await pgClient.query({
            text: alreadyInTransaction ? "release savepoint tx" : "commit",
          });
          return result;
        } catch (e) {
          await pgClient.query({
            text: alreadyInTransaction
              ? "rollback to savepoint tx"
              : "rollback",
          });
          throw e;
        }
      } else {
        const client = newNodePostgresPgClient(
          pgClient,
          subscriptions,
          0,
          alwaysQueue,
          alreadyInTransaction,
        );
        return await callback(client);
      }
    } finally {
      pgClient[$$queue] = null;
      pgClient.removeListener("notification", notificationCallback);
    }
  })());
}

/**
 * Returns a `withPgClient` for the given `pg.Pool` instance.
 */
export function makeNodePostgresWithPgClient(
  pool: Pool,
  release: () => PromiseOrDirect<void> = () => {},
): WithPgClient {
  const withPgClient: WithPgClient = async (pgSettings, callback) => {
    const pgClient = await pool.connect();
    if (!pgClient[$$isSetup]) {
      pgClient[$$isSetup] = true;
      if (!DONT_DISABLE_JIT) {
        pgClient.query("set jit = off;").catch((e) => {
          console.error(
            `Error occurred applying @dataplan/pg global Postgres settings: ${e}`,
          );
        });
      }
    }
    try {
      return await makeNodePostgresWithPgClient_inner(
        pgClient,
        pgSettings,
        callback,
        false,
        false,
      );
    } finally {
      // TODO: should we `RESET ALL` here? Probably not; otherwise timezone,jit,etc will reset
      pgClient.release();
    }
  };

  let released = false;
  const releaseOnce = () => {
    if (released) {
      throw new Error("Release called twice on the same withPgClient");
    } else {
      released = true;
      release();
    }
  };

  withPgClient.release = releaseOnce;
  return withPgClient;
}

/**
 * Returns a `withPgClient` for the given `pg.PoolClient` instance. ONLY
 * SUITABLE FOR TESTS!
 *
 */
export function makeWithPgClientViaNodePostgresClientAlreadyInTransaction(
  pgClient: pg.PoolClient,
  alreadyInTransaction = false,
): WithPgClient {
  const release = () => {};
  const withPgClient: WithPgClient = async (pgSettings, callback) => {
    return makeNodePostgresWithPgClient_inner(
      pgClient,
      pgSettings,
      callback,
      // Ensure only one withPgClient can run at a time, since we only have on pgClient.
      true,
      alreadyInTransaction,
    );
  };

  let released = false;
  const releaseOnce = () => {
    if (released) {
      throw new Error("Release called twice on the same withPgClient");
    } else {
      released = true;
      release();
    }
  };

  withPgClient.release = releaseOnce;
  return withPgClient;
}

export interface NodePostgresAdaptorOptions {
  /** ONLY FOR USE IN TESTS! */
  poolClient?: pg.PoolClient;
  /** ONLY FOR USE IN TESTS! */
  poolClientIsInTransaction?: boolean;

  connectionString?: string;
  pool?: Pool;
}

export function createWithPgClient(
  options: NodePostgresAdaptorOptions,
): WithPgClient {
  if (options.pool) {
    return makeNodePostgresWithPgClient(options.pool);
  } else if (options.poolClient) {
    return makeWithPgClientViaNodePostgresClientAlreadyInTransaction(
      options.poolClient,
      options.poolClientIsInTransaction,
    );
  } else {
    const pool = new pg.Pool(options);
    const release = () => pool.end();
    return makeNodePostgresWithPgClient(pool, release);
  }
}
