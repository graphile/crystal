const { subscribe } = require("graphql");
const { withTransactionlessPgClient } = require("../helpers");
const { createPostGraphileSchema } = require("../..");
const { default: SubscriptionsLDS } = require("@graphile/subscriptions-lds");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const v = parseFloat(process.env.PGVERSION);

exports.skipLDSTests = v && v < 10;

let schema;
exports.resetDatabase = async function resetDatabase() {
  await withTransactionlessPgClient(pgClient =>
    pgClient.query("delete from live_test.users")
  );
};

exports.createSchema = async function createSchema() {
  await withTransactionlessPgClient(async pgClient => {
    schema = await createPostGraphileSchema(pgClient, "live_test", {
      live: true,
      ownerConnectionString: process.env.TEST_DATABASE_URL,
      simpleCollections: "both",
      graphileBuildOptions: {
        ldsSleepDuration: 50, // Run tighter LDS loops to reduce test time
      },
      appendPlugins: [SubscriptionsLDS],
    });
  });
};

exports.releaseSchema = function releaseSchema() {
  // Release the LDS source
  if (
    schema &&
    schema.__pgLdsSource &&
    typeof schema.__pgLdsSource.close === "function"
  ) {
    schema.__pgLdsSource.close();
  }
};

exports.liveTest = (query, variables, cb) => {
  if (!cb) {
    cb = variables;
    variables = null;
  }
  return withTransactionlessPgClient(async pgClient => {
    const iterator = await subscribe(
      schema,
      query,
      null,
      { pgClient },
      variables
    );
    if (iterator.errors) {
      // Not actually an iterator
      throw iterator.errors[0].originalError || iterator.errors[0];
    }
    let changes = [];
    let ended = false;
    let error = null;
    function getChanges() {
      let values = changes;
      changes = [];
      return {
        values,
        ended,
        error,
      };
    }
    (async () => {
      try {
        /*
        for await (const value of iterator) {
          changes.push(value);
        }
        */
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { value, done } = await iterator.next();
          if (done) {
            break;
          } else {
            changes.push(value);
          }
        }
      } catch (e) {
        error = e;
      }
      ended = true;
    })();
    try {
      await cb(pgClient, getChanges);
    } finally {
      iterator.return();
    }
    // Assert there's no more data
    while (!ended) {
      await sleep(10);
    }
    if (changes.length) {
      throw new Error(
        changes.length + " more values found after test completed!"
      );
    }
  });
};

exports.sleep = sleep;

exports.next = async function next(getLatest, duration = 5000) {
  const start = Date.now();
  while (Date.now() - start <= duration) {
    const { values, ended, error } = getLatest();
    if (error) throw error;
    if (ended) throw new Error("Iterator has ended");
    if (values.length > 0) {
      expect(values).toHaveLength(1);
      return values[0];
    }
    await sleep(10);
  }
  throw new Error("Timeout");
};

exports.expectNoChange = async function next(getLatest, duration = 250) {
  const start = Date.now();
  while (Date.now() - start <= duration) {
    const { values, ended, error } = getLatest();
    if (error) throw error;
    if (ended) throw new Error("Iterator has ended");
    if (values.length) {
      throw new Error("Found an unexpected change " + JSON.stringify(values));
    }
    await sleep(10);
  }
};
