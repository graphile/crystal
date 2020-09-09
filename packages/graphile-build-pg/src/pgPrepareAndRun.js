//@flow
import { createHash } from "crypto";
import LRU from "@graphile/lru";
import type { PoolClient } from "pg";

const cacheSizeFromEnv = parseInt(
  process.env.POSTGRAPHILE_PREPARED_STATEMENT_CACHE_SIZE,
  10
);
const POSTGRAPHILE_PREPARED_STATEMENT_CACHE_SIZE =
  !!cacheSizeFromEnv || cacheSizeFromEnv === 0 ? cacheSizeFromEnv : 100;

let lastString: string;
let lastHash: string;
const hash = (str: string): string => {
  if (str !== lastString) {
    lastString = str;
    lastHash = createHash("sha1").update(str).digest("base64");
  }
  return lastHash;
};

export default function pgPrepareAndRun(
  pgClient: PoolClient,
  text: string,
  // eslint-disable-next-line flowtype/no-weak-types
  values: any
) {
  const connection = pgClient.connection;
  if (
    !values ||
    POSTGRAPHILE_PREPARED_STATEMENT_CACHE_SIZE < 2 ||
    !connection ||
    !connection.parsedStatements
  ) {
    return pgClient.query(text, values);
  } else {
    const name = hash(text);
    if (!connection._graphilePreparedStatementCache) {
      connection._graphilePreparedStatementCache = new LRU({
        maxLength: POSTGRAPHILE_PREPARED_STATEMENT_CACHE_SIZE,
        dispose(key) {
          if (connection.parsedStatements[key]) {
            pgClient
              .query(`deallocate ${pgClient.escapeIdentifier(key)}`)
              .then(() => {
                delete connection.parsedStatements[key];
              })
              .catch(e => {
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
    return pgClient.query({
      name,
      text,
      values,
    });
  }
}
