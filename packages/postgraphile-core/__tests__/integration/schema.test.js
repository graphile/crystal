// TODO: There may be some excessive waste, if we could somehow filter what
// these guys see, that would be great 👍

const printSchemaOrdered = require("../printSchemaOrdered");
const { withPgClient } = require("../helpers");
const { createPostGraphileSchema } = require("../..");

// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;

let testResults;

const testFixtures = [
  {
    name: "prints a schema with the default options",
    createSchema: client => createPostGraphileSchema(client, ["a", "b", "c"]),
  },
  {
    name: "prints a schema with Relay 1 style ids",
    createSchema: client =>
      createPostGraphileSchema(client, "c", {
        classicIds: true,
        setofFunctionsContainNulls: false,
      }),
  },
  {
    name: "prints a schema with a JWT generating mutation",
    createSchema: client =>
      createPostGraphileSchema(client, "b", {
        jwtSecret: "secret",
        jwtPgTypeIdentifier: "b.jwt_token",
      }),
  },
  {
    name: "prints a schema without default mutations",
    createSchema: client =>
      createPostGraphileSchema(client, "c", {
        disableDefaultMutations: true,
        setofFunctionsContainNulls: false,
      }),
  },
  {
    name: "prints a schema without posts headlines",
    createSchema: client =>
      createPostGraphileSchema(client, "a", {
        pgColumnFilter: attr => attr.name !== "headline",
        setofFunctionsContainNulls: false,
      }),
  },
  {
    name:
      "prints a schema without parsing tags and with legacy relations omitted",
    createSchema: client =>
      createPostGraphileSchema(client, "c", {
        enableTags: false,
        legacyRelations: "omit",
        setofFunctionsContainNulls: false,
      }),
  },
  {
    name: "prints a schema without new relations and with legacy type names",
    createSchema: client =>
      createPostGraphileSchema(client, "c", {
        legacyRelations: "only",
        enableTags: false,
        legacyJsonUuid: true,
        setofFunctionsContainNulls: false,
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
