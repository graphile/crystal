const { resolve: resolvePath } = require("path");
const { readdirSync, readFile: rawReadFile } = require("fs");
const { graphql } = require("graphql");
const { withPgClient } = require("../helpers");
const { createPostGraphileSchema } = require("../..");

function readFile(filename, encoding) {
  return new Promise((resolve, reject) => {
    rawReadFile(filename, encoding, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

async function getServerVersionNum(pgClient) {
  const versionResult = await pgClient.query("show server_version_num;");
  return parseInt(versionResult.rows[0].server_version_num, 10);
}

// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;

const kitchenSinkData = () =>
  readFile(`${__dirname}/../kitchen-sink-data.sql`, "utf8");

const dSchemaComments = () =>
  readFile(`${__dirname}/../kitchen-sink-d-schema-comments.sql`, "utf8");

const mutationsDir = `${__dirname}/../fixtures/mutations`;
const mutationFileNames = readdirSync(mutationsDir);
let mutationResults = [];

beforeAll(() => {
  // Get a GraphQL schema instance that we can query.
  const gqlSchemaPromise = withPgClient(async pgClient => {
    // A selection of omit/rename comments on the d schema
    await pgClient.query(await dSchemaComments());
    const serverVersionNum = await getServerVersionNum(pgClient);
    const [gqlSchema, dSchema, pg10Schema] = await Promise.all([
      createPostGraphileSchema(pgClient, ["a", "b", "c"]),
      createPostGraphileSchema(pgClient, ["d"]),
      serverVersionNum >= 100000
        ? createPostGraphileSchema(pgClient, ["pg10"])
        : null,
    ]);
    // Now for RBAC-enabled tests
    await pgClient.query("set role postgraphile_test_authenticator");
    const [rbacSchema] = await Promise.all([
      createPostGraphileSchema(pgClient, ["a", "b", "c"], {}),
    ]);
    return {
      gqlSchema,
      dSchema,
      pg10Schema,
      rbacSchema,
    };
  });

  // Execute all of the mutations in parallel. We will not wait for them to
  // resolve or reject. The tests will do that.
  //
  // All of our mutations get there own Postgres client instance. Queries share
  // a client instance.
  mutationResults = mutationFileNames.map(async fileName => {
    // Wait for the schema to resolve. We need the schema to be introspected
    // before we can do anything else!
    let { gqlSchema, dSchema, pg10Schema, rbacSchema } = await gqlSchemaPromise;
    // Get a new Postgres client and run the mutation.
    return await withPgClient(async pgClient => {
      // Read the mutation from the file system.
      const mutation = await readFile(
        resolvePath(mutationsDir, fileName),
        "utf8"
      );

      // Add data to the client instance we are using.
      await pgClient.query(await kitchenSinkData());

      let schemaToUse;
      if (fileName.startsWith("d.")) {
        schemaToUse = dSchema;
      } else if (fileName.startsWith("pg10.")) {
        const serverVersionNum = await getServerVersionNum(pgClient);
        if (serverVersionNum < 100000) {
          // eslint-disable-next-line
          console.log("Skipping test as PG version is less than 10");
          return;
        }
        schemaToUse = pg10Schema;
      } else if (fileName.startsWith("rbac.")) {
        await pgClient.query(
          "select set_config('role', 'postgraphile_test_visitor', true), set_config('jwt.claims.user_id', '3', true)"
        );
        schemaToUse = rbacSchema;
      } else {
        schemaToUse = gqlSchema;
      }

      const matches = mutation.match(/(?:^|\n)#!variables!({[\s\S]*?\n#})!\n/);
      const variables = matches
        ? JSON.parse(matches[1].replace(/\n#/g, "\n"))
        : null;

      // Return the result of our GraphQL query.
      const result = await graphql(
        schemaToUse,
        mutation,
        null,
        {
          pgClient: pgClient,
        },
        variables
      );
      if (result.errors) {
        // eslint-disable-next-line no-console
        console.log(result.errors.map(e => e.originalError));
      }
      return result;
    });
  });
});

for (let i = 0; i < mutationFileNames.length; i++) {
  test(mutationFileNames[i], async () => {
    expect(await mutationResults[i]).toMatchSnapshot();
  });
}
