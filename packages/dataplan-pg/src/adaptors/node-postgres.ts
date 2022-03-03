// TODO: don't import this, it should not be a dependency.
// ALTERNATIVELY: make this only importable from direct path.
import LRU from "@graphile/lru";
import type { Pool, QueryArrayConfig, QueryConfig } from "pg";

import type { PgClient, PgClientQuery, WithPgClient } from "../executor";

// Set `DATAPLAN_PG_PREPARED_STATEMENT_CACHE_SIZE=0` to disable prepared statements
const cacheSizeFromEnv = process.env.DATAPLAN_PG_PREPARED_STATEMENT_CACHE_SIZE
  ? parseInt(process.env.DATAPLAN_PG_PREPARED_STATEMENT_CACHE_SIZE, 10)
  : null;
const PREPARED_STATEMENT_CACHE_SIZE =
  !!cacheSizeFromEnv || cacheSizeFromEnv === 0 ? cacheSizeFromEnv : 100;

export function makeNodePostgresWithPgClient(pool: Pool): WithPgClient {
  return async (pgSettings, callback) => {
    const pgClient = await pool.connect();
    /** Transaction level; 0 = no transaction; 1 = begin; 2,... = savepoint */
    let txLevel = 0;
    const pgSettingsEntries = pgSettings ? Object.entries(pgSettings) : [];

    try {
      const client: PgClient = {
        async query<TData>(opts: PgClientQuery) {
          const needsTx = txLevel === 0 && pgSettingsEntries.length > 0;
          try {
            if (needsTx) {
              await this.startTransaction();
            }
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

            const result = await pgClient.query<TData>(queryObj);

            if (needsTx) {
              await this.commitTransaction();
            }
            return result;
          } catch (e) {
            if (needsTx) {
              await this.rollbackTransaction();
            }
            throw e;
          }
        },
        async startTransaction() {
          if (txLevel === 0) {
            await pgClient.query("begin");
            if (pgSettingsEntries.length > 0) {
              await pgClient.query({
                text: "select set_config(el->>0, el->>1, true) from json_array_elements($1::json)",
                values: [pgSettingsEntries],
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
          } else {
            await pgClient.query({ text: `release savepoint tx${txLevel}` });
          }
        },
        async rollbackTransaction() {
          txLevel--;
          if (txLevel === 0) {
            await pgClient.query({ text: "rollback" });
          } else {
            await pgClient.query({
              text: `rollback to savepoint tx${txLevel}`,
            });
          }
        },
      };
      return await callback(client);
    } finally {
      pgClient.release();
    }
  };
}
