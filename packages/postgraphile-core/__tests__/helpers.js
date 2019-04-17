const pg = require("pg");
const { readFile } = require("fs");
const pgConnectionString = require("pg-connection-string");

// Reduce throttling on CI
process.env.LIVE_THROTTLE = "100";

// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60;

function readFilePromise(filename, encoding) {
  return new Promise((resolve, reject) => {
    readFile(filename, encoding, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

const withTransactionlessPgClient = async (url, fn) => {
  if (!fn) {
    fn = url;
    url = process.env.TEST_DATABASE_URL;
  }
  const pgPool = new pg.Pool(pgConnectionString.parse(url));
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
};

const withPgClient = (url, fn) => {
  if (!fn) {
    fn = url;
    url = process.env.TEST_DATABASE_URL;
  }
  return withTransactionlessPgClient(url, async client => {
    await client.query("begin");
    try {
      await client.query("set local timezone to '+04:00'");
      return await fn(client);
    } finally {
      await client.query("rollback");
    }
  });
};

const transactionlessQuery = (query, variables) => {
  return withTransactionlessPgClient(pgClient =>
    pgClient.query(query, variables)
  );
};

const withDbFromUrl = async (url, fn) => {
  return withPgClient(url, async client => {
    try {
      await client.query("BEGIN ISOLATION LEVEL SERIALIZABLE;");
      return fn(client);
    } finally {
      await client.query("COMMIT;");
    }
  });
};

const withRootDb = fn => withDbFromUrl(process.env.TEST_DATABASE_URL, fn);

let prepopulatedDBKeepalive;

const populateDatabase = async client => {
  await client.query(
    await readFilePromise(`${__dirname}/kitchen-sink-data.sql`, "utf8")
  );
  return {};
};

const withPrepopulatedDb = async fn => {
  if (!prepopulatedDBKeepalive) {
    throw new Error("You must call setup and teardown to use this");
  }
  const { client, vars } = prepopulatedDBKeepalive;
  if (!vars) {
    throw new Error("No prepopulated vars");
  }
  let err;
  try {
    await fn(client, vars);
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
};

withPrepopulatedDb.setup = done => {
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
  withRootDb(async client => {
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

exports.withRootDb = withRootDb;
exports.withPrepopulatedDb = withPrepopulatedDb;
exports.withPgClient = withPgClient;
exports.withTransactionlessPgClient = withTransactionlessPgClient;
exports.transactionlessQuery = transactionlessQuery;
