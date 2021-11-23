import * as assert from "assert";
import { readFile } from "fs/promises";
import { graphql } from "graphql";
import JSON5 from "json5";
import pg from "pg";

import { schema } from "./exampleSchemaExport.mjs";

const pool = new pg.Pool({
  connectionString: process.env.TEST_DATABASE_URL || "graphile_crystal",
});

async function runTestQuery(basePath) {
  const source = await readFile(`${basePath}.test.graphql`, "utf8");
  const expectedData = JSON5.parse(await readFile(`${basePath}.json5`, "utf8"));

  const withPgClient = async (_pgSettings, callback) => {
    const client = await pool.connect();
    try {
      return await callback(client);
    } finally {
      client.release();
    }
  };

  const { errors, data } = await graphql({
    schema,
    source,
    contextValue: {
      pgSettings: {},
      withPgClient,
    },
  });
  if (errors) {
    console.log("ERRORS!");
    console.dir(errors);
    process.exit(1);
  }
  assert.deepEqual(
    data,
    expectedData,
    "Expected the data to match the test data",
  );
  console.log("DATA MATCHES!");
}

runTestQuery(
  `__tests__/queries/interfaces-relational/nested-more-fragments`,
).finally(() => {
  pool.end();
});
