import { graphql } from "graphql";
import { withPgClient } from "../helpers";
import { createPostGraphileSchema } from "../..";
import { promises as fsp } from "fs";
//import { printSchema } from "graphql/utilities";
//import debugFactory from "debug";
//const debug = debugFactory("graphile-build:schema");
import jwt from "jsonwebtoken";

let queryResults: any[] = [];

const kitchenSinkData = () =>
  fsp.readFile(`${__dirname}/../kitchen-sink-data.sql`, "utf8");

const jwtSecret =
  "This is static for the tests, use a better one if you set one!";

const tests = [
  {
    name: "jwt normal",
    query: `mutation {
      authenticate(input: {a: 1, b: "2", c: "3"}) {
        jwtToken {
          role
          exp
          a
          b
          c
        }
      }
    }`,
    schema: "normal",
  },
  {
    name: "jwt pgJwtTypeIdentifier",
    query: `mutation {
      authenticate(input: {a: 1, b: "2", c: "3"}) {
        jwtToken
      }
    }`,
    schema: "withJwt",
    process: ({
      data: {
        authenticate: { jwtToken: str },
      },
    }: any) => {
      return Object.assign(jwt.verify(str, jwtSecret), {
        iat: "[timestamp]",
      });
    },
  },
  {
    name: "jwt pgJwtTypeIdentifier, big numbers",
    query: `mutation {
      authenticate(input: {a: 1, b: "1234567890123456789.123456789", c: "987654321098765432"}) {
        jwtToken
      }
    }`,
    schema: "withJwt",
    process: ({
      data: {
        authenticate: { jwtToken: str },
      },
    }: any) => {
      return Object.assign(jwt.verify(str, jwtSecret), {
        iat: "[timestamp]",
      });
    },
  },
  {
    name: "jwt authenticate fail",
    query: `mutation {
      authenticateFail(input: {}) {
        jwtToken
      }
    }`,
    schema: "withJwt",
  },
  {
    name: "jwt pgJwtTypeIdentifier with payload",
    query: `mutation {
      authenticatePayload(input: {a: 1, b: "2", c: "3"}) {
        authPayload {
          jwt
          id
          admin
          personById {
            id
            name
          }
        }
        personById {
          id
          name
        }
      }
    }`,
    schema: "withJwt",
    process: ({ data: { authenticatePayload } }: any) => {
      const { jwt: str } = authenticatePayload.authPayload;
      return {
        ...authenticatePayload,
        authPayload: {
          ...authenticatePayload.authPayload,
          jwt: Object.assign(jwt.verify(str, jwtSecret), {
            iat: "[timestamp]",
          }),
        },
      };
    },
  },
];

beforeAll(() => {
  // Get a few GraphQL schema instance that we can query.
  const gqlSchemasPromise = withPgClient(async (pgClient) => {
    // Different fixtures need different schemas with different configurations.
    // Make all of the different schemas with different configurations that we
    // need and wait for them to be created in parallel.
    const [normal, withJwt] = await Promise.all([
      createPostGraphileSchema(pgClient, ["a", "b", "c"]),
      createPostGraphileSchema(pgClient, ["a", "b", "c"], {
        jwtPgTypeIdentifier: `"b"."jwt_token"`,
        jwtSecret: jwtSecret,
      }),
    ]);
    //debug(printSchema(withJwt));
    return {
      normal,
      withJwt,
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
    return await withPgClient(async (pgClient) => {
      // Add data to the client instance we are using.
      await pgClient.query(await kitchenSinkData());
      // Run all of our queries in parallel.
      return await Promise.all(
        tests.map(async ({ query, schema: schemaName }) => {
          const gqlSchema = gqlSchemas[schemaName] || gqlSchemas.normal;
          // Return the result of our GraphQL query.
          const result = await graphql(gqlSchema, query, null, {
            pgClient: pgClient,
          });
          if (result.errors && result.errors.length) {
            // eslint-disable-next-line no-console
            console.log(result.errors.map((e) => e.originalError || e));
          }
          return result;
        }),
      );
    });
  })();

  // Flatten out the query results promise.
  queryResults = tests.map(async (_, i) => {
    return await (await queryResultsPromise)[i];
  });
});

for (let i = 0; i < tests.length; i++) {
  const { name, process = (_) => _ } = tests[i];
  test(name, async () => {
    expect(process(await queryResults[i])).toMatchSnapshot();
  });
}
