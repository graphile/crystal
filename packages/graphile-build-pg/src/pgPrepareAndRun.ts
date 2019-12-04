import { createHash } from "crypto";
import LRU from "@graphile/lru";
import { PoolClient } from "pg";

const POSTGRAPHILE_PREPARED_STATEMENT_CACHE_SIZE =
  parseInt(process.env.POSTGRAPHILE_PREPARED_STATEMENT_CACHE_SIZE || "", 10) ||
  100;

let lastString: string;
let lastHash: string;
const hash = (str: string): string => {
  if (str !== lastString) {
    lastString = str;
    lastHash = createHash("sha1")
      .update(str)
      .digest("base64");
  }
  return lastHash;
};

const PARSED_STATEMENTS = "parsedStatements";
const GRAPHILE_PREPARED_STATEMENT_CACHE = "_graphilePreparedStatementCache";

export default function pgPrepareAndRun(
  pgClient: PoolClient,
  text: string,
  values: any
) {
  const connection: unknown = pgClient["connection"];
  if (
    !values ||
    POSTGRAPHILE_PREPARED_STATEMENT_CACHE_SIZE < 1 ||
    typeof connection !== "object" ||
    !connection ||
    typeof connection[PARSED_STATEMENTS] !== "object" ||
    !connection[PARSED_STATEMENTS]
  ) {
    return pgClient.query(text, values);
  } else {
    const name = hash(text);
    if (!connection[GRAPHILE_PREPARED_STATEMENT_CACHE]) {
      connection[GRAPHILE_PREPARED_STATEMENT_CACHE] = new LRU({
        maxLength: POSTGRAPHILE_PREPARED_STATEMENT_CACHE_SIZE,
        dispose(key) {
          if (connection[PARSED_STATEMENTS][key]) {
            pgClient
              .query(`deallocate ${pgClient.escapeIdentifier(key)}`)
              .then(() => {
                delete connection[PARSED_STATEMENTS][key];
              })
              .catch(e => {
                // eslint-disable-next-line no-console
                console.error("Error releasing prepared query", e);
              });
          }
        },
      });
    }
    if (!connection[GRAPHILE_PREPARED_STATEMENT_CACHE].get(name)) {
      // We're relying on dispose to clear out the old ones.
      connection[GRAPHILE_PREPARED_STATEMENT_CACHE].set(name, true);
    }
    return pgClient.query({
      name,
      text,
      values,
    });
  }
}
