#!/usr/bin/env node
import { readFile } from "fs/promises";
import glob from "glob";
import { grafast } from "grafast";
import { isAsyncIterable } from "iterall";
import JSON5 from "json5";
import { strict as assert } from "node:assert";
import pg from "pg";

import { schema } from "./exampleSchemaExport.mjs";

const pool = new pg.Pool({
  connectionString: process.env.TEST_DATABASE_URL || "graphile_crystal",
});

function noop() {
  /*noop*/
}

function newCrystalPgClient(client, txLevel = 0) {
  let queue = null;
  const addToQueue = (callback) => {
    const result = queue ? queue.then(callback) : callback();
    let newQueue = result.then(noop);
    queue = newQueue;
    queue.then(() => {
      // Clear queue unless it has moved on
      if (queue === newQueue) {
        queue = null;
      }
    });
    return result;
  };
  return {
    withTransaction(callback) {
      // Transactions always queue; creating queue if need be
      return addToQueue(async () => {
        if (txLevel === 0) {
          await client.query("begin");
        } else {
          await client.query(`savepoint tx${txLevel}`);
        }
        try {
          const newClient = newCrystalPgClient(client, txLevel + 1);
          const innerResult = await callback(newClient);
          if (txLevel === 0) {
            await client.query("commit");
          } else {
            await client.query(`release savepoint tx${txLevel}`);
          }
          return innerResult;
        } catch (e) {
          try {
            if (txLevel === 0) {
              await client.query("rollback");
            } else {
              await client.query(`rollback savepoint tx${txLevel}`);
            }
          } catch (e2) {
            console.error(`Error occurred whilst rolling back: ${e}`);
          }
          throw e;
        }
      });
    },
    query(...args) {
      // Queries only need to queue if there's a queue already
      if (queue) {
        return addToQueue(() => this.query(...args));
      } else {
        return client.query(...args);
      }
    },
  };
}

async function runTestQuery(basePath) {
  const source = await readFile(`${basePath}.test.graphql`, "utf8");
  const expectedData = JSON5.parse(await readFile(`${basePath}.json5`, "utf8"));

  const withPgClient = async (pgSettings, callback) => {
    const client = await pool.connect();
    const pairs = Object.entries(pgSettings);
    if (pairs.length) {
      const sets = [];
      const values = [];
      for (const [key, value] of pairs) {
        sets.push(
          `set_config($${values.push(key)}, $${values.push(value)}, false)`,
        );
      }
      await client.query(`select ${sets.join(",")};`, values);
    }
    try {
      const crystalPgClient = newCrystalPgClient(client);
      return await callback(crystalPgClient);
    } finally {
      await client.query(`reset all`);
      client.release();
    }
  };

  const result = await grafast({
    schema,
    source,
    contextValue: {
      pgSettings: {
        timezone: "UTC",
      },
      withPgClient,
    },
  });
  const operationType = "query";

  const errorMatches = source.match(
    /^## expect\(errors\)\.toHaveLength\(([0-9]+)\)/m,
  );
  const expectErrors = errorMatches ? parseInt(errorMatches[1], 10) : 0;

  // Very much taken from grafast/dataplan-pg/__tests__/helpers.ts
  if (isAsyncIterable(result)) {
    let errors = undefined;
    // hasNext changes based on payload order; remove it.
    const originalPayloads = [];
    const promise = (async () => {
      for await (const entry of result) {
        const { hasNext, ...rest } = entry;
        if (Object.keys(rest).length > 0 || hasNext) {
          // Do not add the trailing `{hasNext: false}` entry to the snapshot
          originalPayloads.push(rest);
        }
        if (entry.errors) {
          if (!errors) {
            errors = [];
          }
          errors.push(...entry.errors);
        }
      }
    })();
    if (operationType === "subscription") {
      const iterator = result[Symbol.asyncIterator]();
      // Terminate the subscription
      iterator.return?.();
    }
    // Now wait for all payloads to have been collected
    await promise;
    const sortPayloads = (payload1, payload2) => {
      const ONE_AFTER_TWO = 1;
      const ONE_BEFORE_TWO = -1;
      if (!payload1.path) {
        return 0;
      }
      if (!payload2.path) {
        return 0;
      }

      // Make it so we can assume payload1 has the longer (or equal) path
      if (payload2.path.length > payload1.path.length) {
        return -sortPayloads(payload2, payload1);
      }

      for (let i = 0, l = payload1.path.length; i < l; i++) {
        let key1 = payload1.path[i];
        let key2 = payload2.path[i];
        if (key2 === undefined) {
          return ONE_AFTER_TWO;
        }
        if (key1 === key2) {
          /* continue */
        } else if (typeof key1 === "number" && typeof key2 === "number") {
          const res = key1 - key2;
          if (res !== 0) {
            return res;
          }
        } else if (typeof key1 === "string" && typeof key2 === "string") {
          const res = key1.localeCompare(key2);
          if (res !== 0) {
            return res;
          }
        } else {
          throw new Error("Type mismatch");
        }
      }
      // We should do canonical JSON... but whatever.
      return JSON.stringify(payload1).localeCompare(JSON.stringify(payload2));
    };
    const payloads = [
      originalPayloads[0],
      ...originalPayloads.slice(1).sort(sortPayloads),
    ];
    assert.deepEqual(
      JSON.parse(JSON.stringify(payloads)),
      expectedData,
      "Expected the stream data to match the test data",
    );
    console.log("STREAM DATA MATCHES!");
    return true;
  } else {
    const { data, errors } = result;

    if (expectErrors > 0) {
      if (errors.length !== expectErrors) {
        console.log(
          `WRONG ERRORS - expected ${expectErrors} but found ${errors.length}`,
        );
        console.dir(errors);
        process.exit(1);
      }
    } else if (errors) {
      console.log("ERRORS!");
      console.dir(errors);
      process.exit(1);
    }
    assert.deepEqual(
      JSON.parse(JSON.stringify(data)),
      expectedData,
      "Expected the data to match the test data",
    );
    console.log("DATA MATCHES!");
    return true;
  }
}

try {
  const matches =
    process.argv.length > 2
      ? process.argv.slice(2)
      : glob.sync("__tests__/queries/*/*.test.graphql");

  for (const match of matches) {
    const basePath = match.replace(/\.test\.graphql$/, "");
    console.log(basePath);
    await runTestQuery(basePath);
  }
} finally {
  pool.end();
}
