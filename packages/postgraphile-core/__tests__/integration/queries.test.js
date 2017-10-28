const { graphql } = require("graphql");
const { withPgClient } = require("../helpers");
const { createPostGraphQLSchema } = require("../..");
const { readdirSync, readFile: rawReadFile } = require("fs");
const { resolve: resolvePath } = require("path");
const { printSchema } = require("graphql/utilities");
const debug = require("debug")("graphile-build:schema");

function readFile(filename, encoding) {
  return new Promise((resolve, reject) => {
    rawReadFile(filename, encoding, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

const queriesDir = `${__dirname}/../fixtures/queries`;
const queryFileNames = readdirSync(queriesDir);
let queryResults = [];

const kitchenSinkData = () =>
  readFile(`${__dirname}/../kitchen-sink-data.sql`, "utf8");

beforeAll(() => {
  // Get a few GraphQL schema instance that we can query.
  const gqlSchemasPromise = withPgClient(async pgClient => {
    // Different fixtures need different schemas with different configurations.
    // Make all of the different schemas with different configurations that we
    // need and wait for them to be created in parallel.
    const [normal, classicIds, dynamicJson, viewUniqueKey] = await Promise.all([
      createPostGraphQLSchema(pgClient, ["a", "b", "c"]),
      createPostGraphQLSchema(pgClient, ["a", "b", "c"], { classicIds: true }),
      createPostGraphQLSchema(pgClient, ["a", "b", "c"], { dynamicJson: true }),
      createPostGraphQLSchema(pgClient, ["a", "b", "c"], {
        pgColumnFilter: attr => attr.name !== "headline",
      }),
      createPostGraphQLSchema(pgClient, ["a", "b", "c"], {
        viewUniqueKey: "testviewid",
      }),
    ]);
    debug(printSchema(normal));
    return {
      normal,
      classicIds,
      dynamicJson,
      viewUniqueKey,
    };
  });

  // Execute all of the queries in parallel. We will not wait for them to
  // resolve or reject. The tests will do that.
  //
  // All of our queries share a single client instance.
  const queryResultsPromise = (async () => {
    // Wait for the schema to resolve. We need the schema to be introspected
    // before we can do anything else!
    const gqlSchemas = await gqlSchemasPromise;
    // Get a new Postgres client instance.
    return await withPgClient(async pgClient => {
      // Add data to the client instance we are using.
      await pgClient.query(await kitchenSinkData());
      // Run all of our queries in parallel.
      return await Promise.all(
        queryFileNames.map(async fileName => {
          // Read the query from the file system.
          const query = await readFile(
            resolvePath(queriesDir, fileName),
            "utf8"
          );
          // Get the appropriate GraphQL schema for this fixture. We want to test
          // some specific fixtures against a schema configured slightly
          // differently.
          const schemas = {
            "classic-ids.graphql": gqlSchemas.classicIds,
            "dynamic-json.graphql": gqlSchemas.dynamicJson,
            "view.graphql": gqlSchemas.viewUniqueKey,
          };
          const gqlSchema = schemas[fileName]
            ? schemas[fileName]
            : gqlSchemas.normal;

          // Return the result of our GraphQL query.
          const result = await graphql(gqlSchema, query, null, {
            pgClient: pgClient,
          });
          if (result.errors) {
            console.log(result.errors.map(e => e.originalError));
          }
          return result;
        })
      );
    });
  })();

  // Flatten out the query results promise.
  queryResults = queryFileNames.map(async (_, i) => {
    return await (await queryResultsPromise)[i];
  });
});

for (let i = 0; i < queryFileNames.length; i++) {
  test(queryFileNames[i], async () => {
    expect(await queryResults[i]).toMatchSnapshot();
  });
}
