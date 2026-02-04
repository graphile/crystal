import { makePgService } from "@dataplan/pg/adaptors/pg";
import { GraphQLObjectType } from "grafast/graphql";
import type { Pool } from "pg";
import pg from "pg";
import { makeSchema } from "postgraphile";
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { makeV4Preset } from "postgraphile/presets/v4";

import {
  createTestDatabase,
  dropTestDatabase,
} from "../../../grafast/dataplan-pg/__tests__/sharedHelpers.ts";
import { jsonPgSmartTags, pgSmartTags } from "../src/index.ts";
import { pgSmartTagRulesFromJSON } from "../src/makePgSmartTagsPlugin.ts";

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

const makePreset = (plugin: GraphileConfig.Plugin): GraphileConfig.Preset => ({
  extends: [
    PostGraphileAmberPreset,
    makeV4Preset({
      disableDefaultMutations: true,
    }),
  ],
  plugins: [plugin],
  pgServices: [
    makePgService({
      pool: pgPool!,
      schemas: ["graphile_utils"],
    }),
  ],
});

it("pgSmartTags applies table descriptions", async () => {
  const UsersDescriptionPlugin = pgSmartTags({
    kind: "class",
    match: "graphile_utils.users",
    description: "Users table via pgSmartTags",
  });
  const { schema } = await makeSchema(makePreset(UsersDescriptionPlugin));
  const userType = schema.getType("User") as GraphQLObjectType;
  expect(userType.description).toEqual("Users table via pgSmartTags");
});

it("pgSmartTags does not leak matches across classes", async () => {
  const DESC = "Users table via pgSmartTags";
  const UsersDescriptionPlugin = pgSmartTags({
    kind: "class",
    match: "graphile_utils.users",
    description: DESC,
  });
  const { schema } = await makeSchema(makePreset(UsersDescriptionPlugin));
  const userType = schema.getType("User") as GraphQLObjectType;
  const petType = schema.getType("Pet") as GraphQLObjectType;
  expect(userType.description).toEqual(DESC);
  expect(petType).toBeDefined();
  expect(petType.description).not.toEqual(DESC);
});

it("jsonPgSmartTags applies JSON-based rules", async () => {
  const UsersDescriptionPlugin = jsonPgSmartTags({
    version: 1,
    config: {
      class: {
        "graphile_utils.users": {
          description: "Users table via jsonPgSmartTags",
        },
      },
    },
  });
  const { schema } = await makeSchema(makePreset(UsersDescriptionPlugin));
  const userType = schema.getType("User") as GraphQLObjectType;
  expect(userType.description).toEqual("Users table via jsonPgSmartTags");
});

it("pgSmartTagRulesFromJSON validates version", () => {
  expect(() =>
    pgSmartTagRulesFromJSON({ version: 2, config: {} } as any),
  ).toThrow(/only supports the version 1 smart tags JSON format/);
});
