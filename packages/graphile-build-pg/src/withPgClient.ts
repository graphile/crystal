import * as pg from "pg";
import debugFactory from "debug";

const debug = debugFactory("graphile-build-pg");

function constructorName(obj: unknown): string | null {
  return (
    (typeof obj === "object" &&
      obj &&
      typeof obj.constructor === "function" &&
      obj.constructor.name) ||
    null
  );
}

// Some duck-typing

function quacksLikePgClient(pgConfig: unknown): boolean {
  // A diagnosis of exclusion
  if (typeof pgConfig !== "object" || !pgConfig) return false;
  if (constructorName(pgConfig) !== "Client") return false;
  if (typeof pgConfig["connect"] !== "function") return false;
  if (typeof pgConfig["end"] !== "function") return false;
  if (typeof pgConfig["escapeLiteral"] !== "function") return false;
  if (typeof pgConfig["escapeIdentifier"] !== "function") return false;
  return true;
}

export function quacksLikePgPool(pgConfig: unknown): boolean {
  // A diagnosis of exclusion
  if (typeof pgConfig !== "object" || !pgConfig) return false;
  if (
    constructorName(pgConfig) !== "Pool" &&
    constructorName(pgConfig) !== "BoundPool"
  ) {
    return false;
  }
  if (!pgConfig["Client"]) return false;
  if (!pgConfig["options"]) return false;
  if (typeof pgConfig["connect"] !== "function") return false;
  if (typeof pgConfig["end"] !== "function") return false;
  if (typeof pgConfig["query"] !== "function") return false;
  return true;
}

export const getPgClientAndReleaserFromConfig = async (
  pgConfig: pg.PoolClient | pg.Pool | string | undefined = process.env
    .DATABASE_URL
) => {
  let releasePgClient = () => {};
  let pgClient: pg.PoolClient | pg.Client;
  if (pgConfig instanceof pg.Client || quacksLikePgClient(pgConfig)) {
    pgClient = pgConfig as pg.PoolClient;
    if (!pgClient.release) {
      throw new Error(
        "We only support PG clients from a PG pool (because otherwise the `await` call can hang indefinitely if an error occurs and there's no error handler)"
      );
    }
  } else if (pgConfig instanceof pg.Pool || quacksLikePgPool(pgConfig)) {
    const pgPool = pgConfig as pg.Pool;
    const client = await pgPool.connect();
    pgClient = client;
    releasePgClient = () => client.release();
  } else if (pgConfig === undefined || typeof pgConfig === "string") {
    const client = new pg.Client(pgConfig);
    pgClient = client;
    client.on("error", e => {
      debug("pgClient error occurred: %s", e);
    });
    releasePgClient = () =>
      new Promise<undefined>((resolve, reject) =>
        client.end(err => (err ? reject(err) : resolve()))
      );

    await new Promise((resolve, reject) =>
      client.connect(err => (err ? reject(err) : resolve()))
    );
  } else {
    throw new Error(
      "You must provide either a pg.Pool or pg.Client instance or a PostgreSQL connection string."
    );
  }
  return { pgClient, releasePgClient };
};

const withPgClient = async (
  pgConfig: pg.PoolClient | pg.Pool | string | undefined,
  fn: (pgClient: pg.PoolClient | pg.Client) => any
) => {
  if (!fn) {
    throw new Error("Nothing to do!");
  }
  const { pgClient, releasePgClient } = await getPgClientAndReleaserFromConfig(
    pgConfig
  );

  const errorHandler = (e: Error) => {
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
