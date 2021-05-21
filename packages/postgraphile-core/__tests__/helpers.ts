import { promises as fsp } from "fs";
import pg, { PoolClient, QueryResult } from "pg";

// Reduce throttling on CI
process.env.LIVE_THROTTLE = "100";

// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60;

type WithPgClientCallback<T> = (client: PoolClient) => Promise<T>;

export function withTransactionlessPgClient<T>(
  fn: WithPgClientCallback<T>,
): Promise<T>;
export function withTransactionlessPgClient<T>(
  url: string | undefined,
  fn: WithPgClientCallback<T>,
): Promise<T>;
export async function withTransactionlessPgClient<T>(
  urlOrFn: string | undefined | WithPgClientCallback<T>,
  maybeFn?: WithPgClientCallback<T>,
): Promise<T> {
  const fn: WithPgClientCallback<T> =
    typeof maybeFn === "function"
      ? maybeFn
      : typeof urlOrFn === "function"
      ? urlOrFn
      : (urlOrFn as never);
  const url: string | undefined =
    typeof urlOrFn === "string" ? urlOrFn : process.env.TEST_DATABASE_URL;
  const pgPool = new pg.Pool({ connectionString: url });
  try {
    const client = await pgPool.connect();
    try {
      return await fn(client);
    } finally {
      await client.release();
    }
  } finally {
    await pgPool.end();
  }
}

export function withPgClient<T>(fn: WithPgClientCallback<T>): Promise<T>;
export function withPgClient<T>(
  url: string | undefined,
  fn: WithPgClientCallback<T>,
): Promise<T>;
export async function withPgClient<T>(
  urlOrFn: string | undefined | WithPgClientCallback<T>,
  maybeFn?: WithPgClientCallback<T>,
): Promise<T> {
  const fn: WithPgClientCallback<T> =
    typeof maybeFn === "function"
      ? maybeFn
      : typeof urlOrFn === "function"
      ? urlOrFn
      : (urlOrFn as never);
  const url =
    typeof urlOrFn === "string" ? urlOrFn : process.env.TEST_DATABASE_URL;
  return withTransactionlessPgClient(url, async (client) => {
    client.setMaxListeners(100);
    await client.query("begin");
    try {
      await client.query("set local timezone to '+04:00'");
      return await fn(client);
    } finally {
      await client.query("rollback");
    }
  });
}

export function transactionlessQuery<T = any>(
  query: string,
  variables: any[] = [],
) {
  return withTransactionlessPgClient<QueryResult<T>>((pgClient) =>
    pgClient.query<T>(query, variables),
  );
}

async function withDbFromUrl<T>(
  url: string | undefined,
  fn: (client: PoolClient) => T,
) {
  return withPgClient<T>(url, async (client) => {
    try {
      await client.query("BEGIN ISOLATION LEVEL SERIALIZABLE;");
      return fn(client);
    } finally {
      await client.query("COMMIT;");
    }
  });
}

export async function withRootDb<T>(fn: (client: PoolClient) => T): Promise<T> {
  return withDbFromUrl<T>(process.env.TEST_DATABASE_URL, fn);
}

let prepopulatedDBKeepalive: any;

const populateDatabase = async (client: PoolClient) => {
  await client.query(
    await fsp.readFile(`${__dirname}/kitchen-sink-data.sql`, "utf8"),
  );
  return {};
};

export async function withPrepopulatedDb<T>(
  fn: (client: PoolClient, vars: typeof prepopulatedDBKeepalive["vars"]) => T,
): Promise<T> {
  if (!prepopulatedDBKeepalive) {
    throw new Error("You must call setup and teardown to use this");
  }
  const { client, vars } = prepopulatedDBKeepalive;
  if (!vars) {
    throw new Error("No prepopulated vars");
  }
  let err;
  let result: T;
  try {
    result = await fn(client, vars);
  } catch (e) {
    err = e;
  }
  try {
    await client.query("ROLLBACK TO SAVEPOINT pristine;");
  } catch (e) {
    err = err || e;
    console.error("ERROR ROLLING BACK", e.message); // eslint-disable-line no-console
  }
  if (err) {
    throw err;
  }
  return result!;
}

withPrepopulatedDb.setup = (done: (e?: Error) => void) => {
  if (prepopulatedDBKeepalive) {
    throw new Error("There's already a prepopulated DB running");
  }
  let res;
  let rej;
  prepopulatedDBKeepalive = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });
  prepopulatedDBKeepalive.resolve = res;
  prepopulatedDBKeepalive.reject = rej;
  withRootDb(async (client) => {
    prepopulatedDBKeepalive.client = client;
    try {
      prepopulatedDBKeepalive.vars = await populateDatabase(client);
    } catch (e) {
      console.error("FAILED TO PREPOPULATE DB!", e.message); // eslint-disable-line no-console
      return done(e);
    }
    await client.query("SAVEPOINT pristine;");
    done();
    return prepopulatedDBKeepalive;
  });
};

withPrepopulatedDb.teardown = () => {
  if (!prepopulatedDBKeepalive) {
    throw new Error("Cannot tear down null!");
  }
  prepopulatedDBKeepalive.resolve(); // Release DB transaction
  prepopulatedDBKeepalive = null;
};

export async function getServerVersionNum(pgClient: PoolClient) {
  const versionResult = await pgClient.query("show server_version_num;");
  return parseInt(versionResult.rows[0].server_version_num, 10);
}
