import pg from "pg";
import { graphql } from "graphql";
import { createPostGraphileSchema } from "postgraphile-core";
import {
  makeExtendSchemaPlugin,
  gql,
  embed,
  makeAddPgTableConditionPlugin,
} from "../node8plus";

const clean = data => {
  if (Array.isArray(data)) {
    return data.map(clean);
  } else if (data && typeof data === "object") {
    return Object.keys(data).reduce((memo, key) => {
      const value = data[key];
      if (key === "id" && typeof value === "number") {
        memo[key] = "[id]";
      } else if (key === "nodeId" && typeof value === "string") {
        memo[key] = "[nodeId]";
      } else {
        memo[key] = clean(value);
      }
      return memo;
    }, {});
  } else {
    return data;
  }
};

let pgPool;

beforeAll(() => {
  pgPool = new pg.Pool({
    connectionString: process.env.TEST_DATABASE_URL,
  });
});

afterAll(() => {
  if (pgPool) {
    pgPool.end();
    pgPool = null;
  }
});

const PetsCountPlugin = makeAddPgTableConditionPlugin(
  "graphile_utils",
  "users",
  "petCountAtLeast",
  build => ({
    description: "Filters users to those that have at least this many pets",
    type: build.graphql.GraphQLInt,
  }),
  (value, helpers, build) => {
    expect(build.graphql).toBeTruthy();
    const { sqlTableAlias, sql } = helpers;
    return sql.fragment`(select count(*) from graphile_utils.pets where pets.user_id = ${sqlTableAlias}.id) >= ${sql.value(
      value
    )}`;
  }
);

it("allows adding a condition to a Relay connection", async () => {
  const schema = await createPostGraphileSchema(pgPool, ["graphile_utils"], {
    disableDefaultMutations: true,
    appendPlugins: [PetsCountPlugin],
  });
  expect(schema).toMatchSnapshot();
  const pgClient = await pgPool.connect();
  try {
    const { data, errors } = await graphql(
      schema,
      `
        query {
          allUsers(condition: { petCountAtLeast: 3 }) {
            nodes {
              nodeId
              id
              name
              email
              bio
            }
          }
        }
      `,
      null,
      { pgClient },
      {}
    );
    expect(errors).toBeFalsy();
    expect(data).toBeTruthy();
    expect(data.allUsers).toBeTruthy();
    expect(data.allUsers.nodes).toBeTruthy();
    expect(data.allUsers.nodes.length).toEqual(1);
    expect(data.allUsers.nodes[0].email).toEqual("caroline@example.com");
  } finally {
    await pgClient.release();
  }
});

it("allows adding a condition to a simple collection", async () => {
  const schema = await createPostGraphileSchema(pgPool, ["graphile_utils"], {
    disableDefaultMutations: true,
    simpleCollections: "both",
    appendPlugins: [PetsCountPlugin],
  });
  expect(schema).toMatchSnapshot();
  const pgClient = await pgPool.connect();
  try {
    const { data, errors } = await graphql(
      schema,
      `
        query {
          allUsersList(condition: { petCountAtLeast: 3 }) {
            nodeId
            id
            name
            email
            bio
          }
        }
      `,
      null,
      { pgClient },
      {}
    );
    expect(errors).toBeFalsy();
    expect(data).toBeTruthy();
    expect(data.allUsersList).toBeTruthy();
    expect(data.allUsersList.length).toEqual(1);
    expect(data.allUsersList[0].email).toEqual("caroline@example.com");
  } finally {
    await pgClient.release();
  }
});
