import { TYPES } from "@dataplan/pg";
import { makePgService } from "@dataplan/pg/adaptors/pg";
import { grafast } from "grafast";
import type { ExecutionResult } from "grafast/graphql";
import { lexicographicSortSchema } from "grafast/graphql";
import type { Pool } from "pg";
import pg from "pg";
import { makeSchema } from "postgraphile";
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { makeV4Preset } from "postgraphile/presets/v4";

import {
  createTestDatabase,
  dropTestDatabase,
} from "../../../grafast/dataplan-pg/__tests__/sharedHelpers.js";
import { makeAddPgTableConditionPlugin } from "../src/index.js";

const clean = (data: any): any => {
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

let pgPool: Pool | null = null;
let connectionString = "";
let databaseName = "";

beforeAll(async () => {
  ({ connectionString, databaseName } = await createTestDatabase());
  pgPool = new pg.Pool({
    connectionString,
  });
  pgPool.on("connect", (client) => {
    client.on("error", () => {});
    client.query(`set TimeZone to '+04:00'`).catch(() => {});
  });
  pgPool.on("error", (e) => {
    console.error("Pool error:", e);
  });
});

afterAll(async () => {
  if (pgPool) {
    await pgPool.end();
    pgPool = null;
    await dropTestDatabase(databaseName);
  }
});

const PetsCountPlugin = makeAddPgTableConditionPlugin(
  { schemaName: "graphile_utils", tableName: "users" },
  "petCountAtLeast",
  (build) => ({
    description: "Filters users to those that have at least this many pets",
    type: build.graphql.GraphQLInt,
  }),
  (value, helpers) => {
    expect(helpers.build.graphql).toBeTruthy();
    const { sqlTableAlias, sql, $condition } = helpers;
    const val = value.get();
    return sql.fragment`(select count(*) from graphile_utils.pets where pets.user_id = ${sqlTableAlias}.id) >= ${$condition.placeholder(
      val,
      TYPES.int,
    )}`;
  },
);

it("allows adding a condition to a Relay connection", async () => {
  const preset: GraphileConfig.Preset = {
    extends: [
      PostGraphileAmberPreset,
      makeV4Preset({
        disableDefaultMutations: true,
      }),
    ],
    plugins: [PetsCountPlugin],
    pgServices: [
      makePgService({
        pool: pgPool!,
        schemas: ["graphile_utils"],
      }),
    ],
  };
  const { schema, resolvedPreset } = await makeSchema(preset);
  expect(lexicographicSortSchema(schema)).toMatchSnapshot();
  const result = await grafast(
    {
      schema,
      source: /* GraphQL */ `
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
    },
    resolvedPreset,
    {},
  );
  const { data, errors } = result as ExecutionResult;
  expect(errors).toBeFalsy();
  expect(data).toBeTruthy();
  expect(data!.allUsers).toBeTruthy();
  expect((data!.allUsers as any).nodes).toBeTruthy();
  expect((data!.allUsers as any).nodes.length).toEqual(1);
  expect((data!.allUsers as any).nodes[0].email).toEqual(
    "caroline@example.com",
  );
});

it("allows adding a condition to a simple collection", async () => {
  const preset: GraphileConfig.Preset = {
    extends: [
      PostGraphileAmberPreset,
      makeV4Preset({
        simpleCollections: "both",
        disableDefaultMutations: true,
      }),
    ],
    plugins: [PetsCountPlugin],
    pgServices: [
      makePgService({
        pool: pgPool!,
        schemas: ["graphile_utils"],
      }),
    ],
  };
  const { schema, resolvedPreset } = await makeSchema(preset);
  expect(lexicographicSortSchema(schema)).toMatchSnapshot();
  const result = await grafast(
    {
      schema,
      source: `
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
    },
    resolvedPreset,
    {},
  );
  const { data, errors } = result as ExecutionResult;
  expect(errors).toBeFalsy();
  expect(data).toBeTruthy();
  expect(data!.allUsersList as any).toBeTruthy();
  expect((data!.allUsersList as any).length).toEqual(1);
  expect((data!.allUsersList as any)[0].email).toEqual("caroline@example.com");
});
