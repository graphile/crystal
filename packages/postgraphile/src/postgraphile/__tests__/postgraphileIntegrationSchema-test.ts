// TODO: There may be some excessive waste, if we could somehow filter what
// these guys see, that would be great 👍

jest.unmock("postgraphile-core");

import { GraphQLSchema } from "graphql";
import { PoolClient } from "pg";

import printSchemaOrdered from "../../__tests__/utils/printSchemaOrdered";
import withPgClient from "../../__tests__/utils/withPgClient";
import { createPostGraphileSchema } from "..";

// When running jest from the root of the monorepo, the directory is the
// repository root, so all the file paths are incorrect. I couldn't find a way
// to have jest automatically `process.chdir` for each test suite.
process.chdir(__dirname + "/../../..");

// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;

// TODO: rewrite me into separate test files
let testResults: any[];

const testFixtures: Array<{
  name: string;
  createSchema: (client: PoolClient) => Promise<GraphQLSchema>;
}> = [
  {
    name: "prints a schema with the default options",
    createSchema: (client) => createPostGraphileSchema(client, ["a", "b", "c"]),
  },
  {
    name: "prints a schema with Relay 1 style ids",
    createSchema: (client) =>
      createPostGraphileSchema(client, "c", { classicIds: true }),
  },
  {
    name: "prints a schema with a JWT generating mutation",
    createSchema: (client) =>
      createPostGraphileSchema(client, "b", {
        jwtSecret: "secret",
        jwtPgTypeIdentifier: "b.jwt_token",
      }),
  },
  {
    name: "prints a schema without default mutations",
    createSchema: (client) =>
      createPostGraphileSchema(client, "c", { disableDefaultMutations: true }),
  },
  {
    name: "prints a schema with nulls reduced and old Json, Uuid",
    createSchema: (client) =>
      createPostGraphileSchema(client, ["a", "b", "c"], {
        setofFunctionsContainNulls: false,
        legacyJsonUuid: true,
      }),
  },
];

beforeAll(() => {
  testResults = testFixtures.map((testFixture) =>
    withPgClient(async (client) => {
      return await testFixture.createSchema(client);
    })(),
  );
});

for (let i = 0; i < testFixtures.length; i++) {
  test(testFixtures[i].name, async () => {
    expect(printSchemaOrdered(await testResults[i])).toMatchSnapshot();
  });
}
