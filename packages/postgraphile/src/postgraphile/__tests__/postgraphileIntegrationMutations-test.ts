jest.unmock("postgraphile-core");

import { resolve as resolvePath } from "path";
import { readFile, readdirSync } from "fs";
import { graphql } from "graphql";
import withPgClient from "../../__tests__/utils/withPgClient";
import { $$pgClient } from "../../postgres/inventory/pgClientFromContext";
import { createPostGraphileSchema } from "..";

// When running jest from the root of the monorepo, the directory is the
// repository root, so all the file paths are incorrect. I couldn't find a way
// to have jest automatically `process.chdir` for each test suite.
process.chdir(__dirname + "/../../..");

// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;

const kitchenSinkData = new Promise<string>((resolve, reject) => {
  readFile("examples/kitchen-sink/data.sql", (error, data) => {
    if (error) reject(error);
    else resolve(data.toString().replace(/begin;|commit;/g, ""));
  });
});

const mutationsDir = resolvePath(__dirname, "fixtures/mutations");
const mutationFileNames = readdirSync(mutationsDir);

// TODO: rewrite me into separate test files
let mutationResults: any[] = [];

beforeAll(() => {
  // Get a GraphQL schema instance that we can query.
  const gqlSchemaPromise = withPgClient(async (pgClient) => {
    return await createPostGraphileSchema(pgClient, ["a", "b", "c"]);
  })();

  // Execute all of the mutations in parallel. We will not wait for them to
  // resolve or reject. The tests will do that.
  //
  // All of our mutations get there own Postgres client instance. Queries share
  // a client instance.
  mutationResults = mutationFileNames.map(async (fileName) => {
    // Wait for the schema to resolve. We need the schema to be introspected
    // before we can do anything else!
    let gqlSchema = await gqlSchemaPromise;
    // Get a new Postgres client and run the mutation.
    return await withPgClient(async (pgClient) => {
      // Read the mutation from the file system.
      const mutation = await new Promise<string>((resolve, reject) => {
        readFile(resolvePath(mutationsDir, fileName), "utf8", (error, data) => {
          if (error) reject(error);
          else resolve(data);
        });
      });

      // Add data to the client instance we are using.
      await pgClient.query(await kitchenSinkData);

      // Return the result of our GraphQL query.
      return await graphql(gqlSchema, mutation, null, {
        [$$pgClient]: pgClient,
      });
    })();
  });
});

for (let i = 0; i < mutationFileNames.length; i++) {
  test(mutationFileNames[i], async () => {
    expect(await mutationResults[i]).toMatchSnapshot();
  });
}
