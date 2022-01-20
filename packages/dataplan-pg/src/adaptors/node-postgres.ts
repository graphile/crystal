// TODO: don't import this, it should not be a dependency.
// ALTERNATIVELY: make this only importable from direct path.
import type { Pool } from "pg";

import type { PgClient, PgClientQuery, WithPgClient } from "../executor";

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
            const queryObj = opts.arrayMode
              ? { ...opts, rowMode: "array" }
              : opts;
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
