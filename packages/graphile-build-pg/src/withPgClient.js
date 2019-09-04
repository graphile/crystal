// @flow
import pg from "pg";
import debugFactory from "debug";

const debug = debugFactory("graphile-build-pg");

function constructorName(obj) {
  return obj && typeof obj.constructor === "function" && obj.constructor.name;
}

// Some duck-typing

function quacksLikePgClient(pgConfig: mixed): boolean {
  // A diagnosis of exclusion
  if (!pgConfig || typeof pgConfig !== "object") return false;
  if (constructorName(pgConfig) !== "Client") return false;
  if (typeof pgConfig.connect !== "function") return false;
  if (typeof pgConfig.end !== "function") return false;
  if (typeof pgConfig.escapeLiteral !== "function") return false;
  if (typeof pgConfig.escapeIdentifier !== "function") return false;
  return true;
}

export function quacksLikePgPool(pgConfig: mixed): boolean {
  // A diagnosis of exclusion
  if (!pgConfig || typeof pgConfig !== "object") return false;
  if (
    constructorName(pgConfig) !== "Pool" &&
    constructorName(pgConfig) !== "BoundPool"
  ) {
    return false;
  }
  if (!pgConfig.Client) return false;
  if (!pgConfig.options) return false;
  if (typeof pgConfig.connect !== "function") return false;
  if (typeof pgConfig.end !== "function") return false;
  if (typeof pgConfig.query !== "function") return false;
  return true;
}

export const getPgClientAndReleaserFromConfig = async (
  pgConfig: pg.Client | pg.Pool | string = process.env.DATABASE_URL
) => {
  let releasePgClient = () => {};
  let pgClient: pg.Client;
  if (pgConfig instanceof pg.Client || quacksLikePgClient(pgConfig)) {
    pgClient = (pgConfig: pg.Client);
    if (!pgClient.release) {
      throw new Error(
        "We only support PG clients from a PG pool (because otherwise the `await` call can hang indefinitely if an error occurs and there's no error handler)"
      );
    }
  } else if (pgConfig instanceof pg.Pool || quacksLikePgPool(pgConfig)) {
    const pgPool = (pgConfig: pg.Pool);
    pgClient = await pgPool.connect();
    releasePgClient = () => pgClient.release();
  } else if (pgConfig === undefined || typeof pgConfig === "string") {
    pgClient = new pg.Client(pgConfig);
    pgClient.on("error", e => {
      debug("pgClient error occurred: %s", e);
    });
    releasePgClient = () =>
      new Promise<void>((resolve, reject) =>
        pgClient.end(err => (err ? reject(err) : resolve()))
      );
    await new Promise((resolve, reject) =>
      pgClient.connect(err => (err ? reject(err) : resolve()))
    );
  } else {
    throw new Error(
      "You must provide either a pg.Pool or pg.Client instance or a PostgreSQL connection string."
    );
  }
  return { pgClient, releasePgClient };
};

const withPgClient = async (
  pgConfig: pg.Client | pg.Pool | string | void,
  fn: (pgClient: pg.Client) => *
) => {
  if (!fn) {
    throw new Error("Nothing to do!");
  }
  const { pgClient, releasePgClient } = await getPgClientAndReleaserFromConfig(
    pgConfig
  );
  const errorHandler = e => {
    // eslint-disable-next-line no-console
    console.error("withPgClient client error:", e.message);
  };
  pgClient.on("error", errorHandler);
  try {
    return await fn(pgClient);
  } finally {
    pgClient.removeListener("error", errorHandler);
    try {
      await releasePgClient();
    } catch (e) {
      // Failed to release, assuming success
    }
  }
};

export default withPgClient;
