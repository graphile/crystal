#!/usr/bin/env node
import { strict as assert } from "node:assert";

import { PgContextPlugin } from "@dataplan/pg";
import { makePgService } from "@dataplan/pg/adaptors/pg";
import { readFile } from "fs/promises";
import { sync as globSync } from "glob";
import { grafast } from "grafast";
import { resolvePresets } from "graphile-config";
import { isAsyncIterable } from "iterall";
import JSON5 from "json5";

import { schema } from "./exampleSchemaExport.mjs";

const connectionString =
  process.env.TEST_DATABASE_URL || "postgres:///graphile_crystal";
const pgService = makePgService({ connectionString });
const preset = {
  plugins: [PgContextPlugin],
  pgServices: [pgService],
  grafast: {
    context() {
      return {
        pgSettings: {
          timezone: "UTC",
        },
      };
    },
  },
};
const resolvedPreset = resolvePresets([preset]);

async function runTestQuery(basePath) {
  const source = await readFile(`${basePath}.test.graphql`, "utf8");
  const expectedData = JSON5.parse(await readFile(`${basePath}.json5`, "utf8"));

  const result = await grafast({
    schema,
    source,
    resolvedPreset,
    requestContext: {},
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
          const res = key1.localeCompare(key2, "en-US");
          if (res !== 0) {
            return res;
          }
        } else {
          throw new Error("Type mismatch");
        }
      }
      // We should do canonical JSON... but whatever.
      return JSON.stringify(payload1).localeCompare(
        JSON.stringify(payload2),
        "en-US",
      );
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
      : globSync("__tests__/queries/*/*.test.graphql");

  for (const match of matches) {
    const basePath = match.replace(/\.test\.graphql$/, "");
    console.log(basePath);
    await runTestQuery(basePath);
  }
} finally {
  await pgService.release?.();
}
