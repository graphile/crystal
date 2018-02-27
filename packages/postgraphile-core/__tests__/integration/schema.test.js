// TODO: There may be some excessive waste, if we could somehow filter what
// these guys see, that would be great 👍

const printSchemaOrdered = require("../printSchemaOrdered");
const { withPgClient } = require("../helpers");
const { createPostGraphQLSchema } = require("../..");

// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;

let testResults;

const testFixtures = [
  {
    name: "prints a schema with the default options",
    createSchema: client => createPostGraphQLSchema(client, ["a", "b", "c"]),
  },
  {
    name: "prints a schema with Relay 1 style ids",
    createSchema: client =>
      createPostGraphQLSchema(client, "c", { classicIds: true }),
  },
  {
    name: "prints a schema with a JWT generating mutation",
    createSchema: client =>
      createPostGraphQLSchema(client, "b", {
        jwtSecret: "secret",
        jwtPgTypeIdentifier: "b.jwt_token",
      }),
  },
  {
    name: "prints a schema without default mutations",
    createSchema: client =>
      createPostGraphQLSchema(client, "c", { disableDefaultMutations: true }),
  },
  {
    name: "prints a schema without posts headlines",
    createSchema: client =>
      createPostGraphQLSchema(client, "a", {
        pgColumnFilter: attr => attr.name !== "headline",
      }),
  },
  {
    name:
      "prints a schema without parsing tags and with legacy relations omitted",
    createSchema: client =>
      createPostGraphQLSchema(client, "c", {
        enableTags: false,
        legacyRelations: "omit",
      }),
  },
  {
    name: "prints a schema without new relations and with legacy type names",
    createSchema: client =>
      createPostGraphQLSchema(client, "c", {
        legacyRelations: "only",
        enableTags: false,
        legacyJsonUuid: true,
      }),
  },
];

beforeAll(() => {
  testResults = testFixtures.map(testFixture =>
    withPgClient(async client => {
      return await testFixture.createSchema(client);
    })
  );
});

for (let i = 0; i < testFixtures.length; i++) {
  test(testFixtures[i].name, async () => {
    expect(printSchemaOrdered(await testResults[i])).toMatchSnapshot();
  });
}
