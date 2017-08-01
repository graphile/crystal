// @flow
import pg from "pg";
import debugFactory from "debug";
const debug = debugFactory("graphile-build-pg");

const withPgClient = async (
  pgConfig: pg.Client | pg.Pool | string = process.env.DATABASE_URL,
  fn: (pgClient: pg.Client) => Promise<void>
) => {
  if (!fn) {
    throw new Error("Nothing to do!");
  }
  let releasePgClient = () => {};
  let pgClient;
  let result;
  try {
    if (pgConfig instanceof pg.Client) {
      pgClient = pgConfig;
      if (!pgClient.release) {
        throw new Error(
          "We only support PG clients from a PG pool (because otherwise the `await` call can hang indefinitely if an error occurs and there's no error handler)"
        );
      }
    } else if (pgConfig instanceof pg.Pool) {
      pgClient = await pgConfig.connect();
      releasePgClient = () => pgClient.release();
    } else if (pgConfig === undefined || typeof pgConfig === "string") {
      pgClient = new pg.Client(pgConfig);
      pgClient.on("error", e => {
        debug("pgClient error occurred: %s", e);
      });
      releasePgClient = () =>
        new Promise((resolve, reject) =>
          pgClient.end(err => (err ? reject(err) : resolve()))
        );
      await new Promise((resolve, reject) =>
        pgClient.connect(err => (err ? reject(err) : resolve()))
      );
    } else {
      throw new Error("You must provide a valid PG client configuration");
    }
    result = await fn(pgClient);
  } finally {
    try {
      await releasePgClient();
    } catch (e) {
      // Failed to release, assuming success
    }
  }
  return result;
};

export default withPgClient;
