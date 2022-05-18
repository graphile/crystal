/**
 * This is an adaptor for the `pg` module.
 */

// TODO: don't import 'pg' or '@graphile/lru', we don't want these to be dependencies of @dataplan/pg.
// TODO: This file should only be available via direct (path) import, it should not be included in the main package exports.

import LRU from "@graphile/lru";
import type { PromiseOrDirect } from "dataplanner";
import type { Pool, QueryArrayConfig, QueryConfig, QueryResultRow } from "pg";
import * as pg from "pg";

import type { PgClient, PgClientQuery, WithPgClient } from "../executor.js";

// TODO: security sensitive, review this.
function escapeIdentifier(str: string): string {
  return '"' + str.replace(/"/g, '""') + '"';
}

declare global {
  namespace DataPlanner {
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
    /** Transaction level; 0 = no transaction; 1 = begin; 2,... = savepoint */
    let txLevel = 0;
    const pgSettingsEntries = pgSettings
      ? Object.entries(pgSettings).map(([k, v]) => [k, String(v)])
      : [];
    /** If transactions become unpaired, prevent any further usage */
    let catastrophicFailure: Error | null = null;

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
    pgClient.on("notification", notificationCallback);

    try {
      const client: PgClient = {
        async query<TData>(opts: PgClientQuery) {
          if (catastrophicFailure !== null) {
            throw catastrophicFailure;
          }
          const needsTx = txLevel === 0 && pgSettingsEntries.length > 0;
          if (needsTx) {
            // NOTE: this is **NOT** inside the 'try' because if we fail to start
            // the transaction then we must not release it.
            await this.startTransaction();
          }
          try {
            const { text, name, values, arrayMode } = opts;
            // TODO: support named queries.
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
            const result = await pgClient.query<
              TData extends QueryResultRow ? TData : never
            >(queryObj);

            if (needsTx) {
              await this.commitTransaction();
            }
            return result;
          } catch (e) {
            if (needsTx) {
              try {
                await this.rollbackTransaction();
              } catch (rollbackError) {
                console.error(
                  `Error occurred during rollback: ${rollbackError.message}`,
                );
                throw e;
              }
            }
            throw e;
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

        async startTransaction() {
          if (catastrophicFailure !== null) {
            throw catastrophicFailure;
          }
          if (txLevel === 0) {
            await pgClient.query("begin");
            if (pgSettingsEntries.length > 0) {
              await pgClient.query({
                text: "select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el",
                values: [JSON.stringify(pgSettingsEntries)],
              });
            }
          } else {
            await pgClient.query({ text: `savepoint tx${txLevel}` });
          }
          txLevel++;
        },
        async commitTransaction() {
          txLevel--;
          if (txLevel === 0) {
            await pgClient.query({ text: "commit" });
          } else if (txLevel > 0) {
            await pgClient.query({ text: `release savepoint tx${txLevel}` });
          } else {
            catastrophicFailure = new Error(
              `Catastrophic failure: txLevel is ${txLevel}; you have unbalanced startTransaction/commitTransaction/rollbackTransaction calls. Unsafe to continue; this Postgres client is now inactivated.`,
            );
            throw catastrophicFailure;
          }
        },
        async rollbackTransaction() {
          txLevel--;
          if (txLevel === 0) {
            await pgClient.query({ text: "rollback" });
          } else if (txLevel > 0) {
            await pgClient.query({
              text: `rollback to savepoint tx${txLevel}`,
            });
          } else {
            catastrophicFailure = new Error(
              `Catastrophic failure: txLevel is ${txLevel}; you have unbalanced startTransaction/commitTransaction/rollbackTransaction calls. Unsafe to continue; this Postgres client is now inactivated.`,
            );
            throw catastrophicFailure;
          }
        },
      };
      return await callback(client);
    } finally {
      pgClient.removeListener("notification", notificationCallback);
      pgClient.release();
    }
  };

  return Object.assign(withPgClient, { release });
}

export interface NodePostgresAdaptorOptions {
  connectionString?: string;
  pool?: Pool;
}

export function createWithPgClient(
  options: NodePostgresAdaptorOptions,
): WithPgClient {
  if (options.pool) {
    return makeNodePostgresWithPgClient(options.pool);
  } else {
    const pool = new pg.Pool(options);
    const release = () => pool.end();
    return makeNodePostgresWithPgClient(pool, release);
  }
}
