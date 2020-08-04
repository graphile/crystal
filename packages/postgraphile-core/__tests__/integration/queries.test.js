const { graphql } = require("graphql");
const { withPgClient, getServerVersionNum } = require("../helpers");
const { createPostGraphileSchema } = require("../..");
const { readdirSync, readFile: rawReadFile } = require("fs");
const { resolve: resolvePath } = require("path");
const { printSchema } = require("graphql/utilities");
const debug = require("debug")("graphile-build:schema");
const { makeExtendSchemaPlugin, gql } = require("graphile-utils");
const ToyCategoriesPlugin = require("./ToyCategoriesPlugin");

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
const testsToSkip = [];
let queryResults = [];

const kitchenSinkData = () =>
  readFile(`${__dirname}/../kitchen-sink-data.sql`, "utf8");

const pg10Data = () => readFile(`${__dirname}/../pg10-data.sql`, "utf8");

const dSchemaComments = () =>
  readFile(`${__dirname}/../kitchen-sink-d-schema-comments.sql`, "utf8");

beforeAll(() => {
  // Get a few GraphQL schema instance that we can query.
  const gqlSchemasPromise = withPgClient(async pgClient => {
    const serverVersionNum = await getServerVersionNum(pgClient);
    if (serverVersionNum < 90500) {
      // Remove tests not supported by PG9.4
      testsToSkip.push("json-overflow.graphql");
    }

    // A selection of omit/rename comments on the d schema
    await pgClient.query(await dSchemaComments());

    // Different fixtures need different schemas with different configurations.
    // Make all of the different schemas with different configurations that we
    // need and wait for them to be created in parallel.
    const [
      normal,
      classicIds,
      dynamicJson,
      pgColumnFilter,
      viewUniqueKey,
      dSchema,
      simpleCollections,
      orderByNullsLast,
      smartCommentRelations,
      largeBigint,
      useCustomNetworkScalars,
      pg10UseCustomNetworkScalars,
      namedQueryBuilder,
      enumTables,
    ] = await Promise.all([
      createPostGraphileSchema(pgClient, ["a", "b", "c"], {
        subscriptions: true,
        appendPlugins: [
          makeExtendSchemaPlugin({
            typeDefs: gql`
              extend type Query {
                extended: Boolean
              }
            `,
            resolvers: {
              Query: {
                extended: () => true,
              },
            },
          }),
        ],
      }),
      createPostGraphileSchema(pgClient, ["a", "b", "c"], {
        subscriptions: true,
        classicIds: true,
      }),
      createPostGraphileSchema(pgClient, ["a", "b", "c"], {
        subscriptions: true,
        dynamicJson: true,
        setofFunctionsContainNulls: null,
      }),
      createPostGraphileSchema(pgClient, ["a", "b", "c"], {
        subscriptions: true,
        pgColumnFilter: attr => attr.name !== "headline",
        setofFunctionsContainNulls: false,
      }),
      createPostGraphileSchema(pgClient, ["a", "b", "c"], {
        subscriptions: true,
        viewUniqueKey: "testviewid",
        setofFunctionsContainNulls: true,
      }),
      createPostGraphileSchema(pgClient, ["d"], {}),
      createPostGraphileSchema(pgClient, ["a", "b", "c"], {
        subscriptions: true,
        simpleCollections: "both",
      }),
      createPostGraphileSchema(pgClient, ["a"], {
        subscriptions: true,
        graphileBuildOptions: {
          orderByNullsLast: true,
        },
      }),
      createPostGraphileSchema(pgClient, ["smart_comment_relations"], {}),
      createPostGraphileSchema(pgClient, ["large_bigint"], {}),
      createPostGraphileSchema(pgClient, ["network_types"], {
        graphileBuildOptions: {
          pgUseCustomNetworkScalars: true,
        },
      }),
      serverVersionNum >= 100000
        ? createPostGraphileSchema(pgClient, ["pg10"], {
            graphileBuildOptions: {
              pgUseCustomNetworkScalars: true,
            },
          })
        : null,
      createPostGraphileSchema(pgClient, ["named_query_builder"], {
        subscriptions: true,
        appendPlugins: [ToyCategoriesPlugin],
      }),
      createPostGraphileSchema(pgClient, ["enum_tables"], {
        subscriptions: true,
      }),
    ]);
    // Now for RBAC-enabled tests
    await pgClient.query("set role postgraphile_test_authenticator");
    const [rbac] = await Promise.all([
      createPostGraphileSchema(pgClient, ["a", "b", "c"], {
        ignoreRBAC: false,
      }),
    ]);
    debug(printSchema(normal));
    return {
      normal,
      classicIds,
      dynamicJson,
      pgColumnFilter,
      viewUniqueKey,
      dSchema,
      simpleCollections,
      orderByNullsLast,
      rbac,
      smartCommentRelations,
      largeBigint,
      useCustomNetworkScalars,
      pg10UseCustomNetworkScalars,
      namedQueryBuilder,
      enumTables,
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
      const serverVersionNum = await getServerVersionNum(pgClient);
      if (serverVersionNum >= 100000) {
        await pgClient.query(await pg10Data());
      }
      // Run all of our queries in parallel.
      const results = [];
      for (const filename of queryFileNames) {
        if (testsToSkip.indexOf(filename) >= 0) {
          results.push(Promise.resolve());
          continue;
        }
        const process = async fileName => {
          if (fileName.startsWith("pg10.")) {
            if (serverVersionNum < 100000) {
              console.log("Skipping test as PG version is less than 10");
              return;
            }
          }
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
            "dynamic-json.condition-json-field-variable.graphql":
              gqlSchemas.dynamicJson,
            "view.graphql": gqlSchemas.viewUniqueKey,
            "badlyBehavedFunction.graphql": gqlSchemas.viewUniqueKey,
            "simple-collections.graphql": gqlSchemas.simpleCollections,
            "simple-relations-head-tail.graphql": gqlSchemas.simpleCollections,
            "simple-relations-tail-head.graphql": gqlSchemas.simpleCollections,
            "simple-procedure-computed-fields.graphql":
              gqlSchemas.simpleCollections,
            "simple-procedure-query.graphql": gqlSchemas.simpleCollections,
            "types.graphql": gqlSchemas.simpleCollections,
            "orderByNullsLast.graphql": gqlSchemas.orderByNullsLast,
            "network_types.graphql": gqlSchemas.useCustomNetworkScalars,
            "pg10.network_types.graphql":
              gqlSchemas.pg10UseCustomNetworkScalars,
          };
          let gqlSchema = schemas[fileName];
          if (!gqlSchema) {
            if (fileName.startsWith("d.")) {
              gqlSchema = gqlSchemas.dSchema;
            } else if (fileName.startsWith("rbac.")) {
              gqlSchema = gqlSchemas.rbac;
            } else if (fileName.startsWith("smart_comment_relations.")) {
              gqlSchema = gqlSchemas.smartCommentRelations;
            } else if (fileName.startsWith("large_bigint")) {
              gqlSchema = gqlSchemas.largeBigint;
            } else if (fileName.startsWith("named_query_builder")) {
              gqlSchema = gqlSchemas.namedQueryBuilder;
            } else if (fileName.startsWith("enum_tables.")) {
              gqlSchema = gqlSchemas.enumTables;
            } else {
              gqlSchema = gqlSchemas.normal;
            }
          }

          await pgClient.query("savepoint test");
          if (gqlSchema === gqlSchemas.rbac) {
            await pgClient.query(
              "select set_config('role', 'postgraphile_test_visitor', true), set_config('jwt.claims.user_id', '3', true)"
            );
          }

          try {
            // Return the result of our GraphQL query.
            const result = await graphql(gqlSchema, query, null, {
              pgClient: pgClient,
            });
            if (result.errors) {
              // eslint-disable-next-line no-console
              console.log(result.errors.map(e => e.originalError || e));
            }
            return result;
          } finally {
            await pgClient.query("rollback to savepoint test");
          }
        };
        results.push(await process(filename));
      }
      return results;
    });
  })();

  // Flatten out the query results promise.
  queryResults = queryFileNames.map(async (_, i) => {
    return await (await queryResultsPromise)[i];
  });
});

for (let i = 0; i < queryFileNames.length; i++) {
  const filename = queryFileNames[i];
  test(filename, async () => {
    if (testsToSkip.indexOf(filename) >= 0) {
      // eslint-disable-next-line no-console
      console.log(`SKIPPED '${filename}'`);
      // Technically this will never be ran because we handle it in scripts/test
    } else {
      expect(await queryResults[i]).toMatchSnapshot();
    }
  });
}
