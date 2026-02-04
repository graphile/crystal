import { makePgService } from "@dataplan/pg/adaptors/pg";
import { GraphQLObjectType } from "grafast/graphql";
import type { Pool } from "pg";
import pg from "pg";
import type {
  Introspection,
  PgAttribute,
  PgConstraint,
  PgNamespace,
  PgProc,
  PgType,
} from "pg-introspection";
import { makeSchema } from "postgraphile";
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { makeV4Preset } from "postgraphile/presets/v4";

import {
  createTestDatabase,
  dropTestDatabase,
} from "../../../grafast/dataplan-pg/__tests__/sharedHelpers.ts";
import { jsonPgSmartTags, pgSmartTags } from "../src/index.ts";
import {
  type PgSmartTagRule,
  pgSmartTagRulesFromJSON,
} from "../src/makePgSmartTagsPlugin.ts";

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

const makePreset = (
  plugins: GraphileConfig.Plugin[],
): GraphileConfig.Preset => ({
  extends: [
    PostGraphileAmberPreset,
    makeV4Preset({
      disableDefaultMutations: true,
    }),
  ],
  plugins,
  pgServices: [
    makePgService({
      pool: pgPool!,
      schemas: ["graphile_utils"],
    }),
  ],
});

const getIntrospectionWithSmartTags = async (
  rule: PgSmartTagRule,
  options?: {
    setupSql?: string[];
    teardownSql?: string[];
  },
): Promise<Introspection> => {
  let captured: Introspection | null = null;
  const InspectSmartTagsPlugin: GraphileConfig.Plugin = {
    name: "InspectSmartTagsPlugin",
    after: ["smart-tags"],
    gather: {
      hooks: {
        pgIntrospection_introspection(_info, event) {
          captured = event.introspection;
        },
      },
    },
  };
  if (options?.setupSql?.length) {
    await pgPool!.query(options.setupSql.join("\n"));
  }
  try {
    await makeSchema(makePreset([pgSmartTags(rule), InspectSmartTagsPlugin]));
  } finally {
    if (options?.teardownSql?.length) {
      await pgPool!.query(options.teardownSql.join("\n"));
    }
  }
  expect(captured).toBeTruthy();
  return captured!;
};

const findAttribute = (
  introspection: Introspection,
  schemaName: string,
  tableName: string,
  attributeName: string,
): PgAttribute => {
  const attribute = introspection.attributes.find((attr) => {
    if (attr.attname !== attributeName) return false;
    const rel = attr.getClass();
    if (!rel || rel.relname !== tableName) return false;
    const nsp = rel.getNamespace();
    return nsp?.nspname === schemaName;
  });
  expect(attribute).toBeDefined();
  return attribute!;
};

const findConstraint = (
  introspection: Introspection,
  schemaName: string,
  tableName: string,
  constraintName: string,
): PgConstraint => {
  const constraint = introspection.constraints.find((con) => {
    if (con.conname !== constraintName) return false;
    const rel = con.getClass();
    if (!rel || rel.relname !== tableName) return false;
    const nsp = rel.getNamespace();
    return nsp?.nspname === schemaName;
  });
  expect(constraint).toBeDefined();
  return constraint!;
};

const findProc = (
  introspection: Introspection,
  schemaName: string,
  procName: string,
): PgProc => {
  const proc = introspection.procs.find((proc) => {
    if (proc.proname !== procName) return false;
    const nsp = proc.getNamespace();
    return nsp?.nspname === schemaName;
  });
  expect(proc).toBeDefined();
  return proc!;
};

const findType = (
  introspection: Introspection,
  schemaName: string,
  typeName: string,
): PgType => {
  const type = introspection.types.find((type) => {
    if (type.typname !== typeName) return false;
    const nsp = type.getNamespace();
    return nsp?.nspname === schemaName;
  });
  expect(type).toBeDefined();
  return type!;
};

const findNamespace = (
  introspection: Introspection,
  schemaName: string,
): PgNamespace => {
  const namespace = introspection.namespaces.find(
    (nsp) => nsp.nspname === schemaName,
  );
  expect(namespace).toBeDefined();
  return namespace!;
};

it("pgSmartTags applies table descriptions", async () => {
  const UsersDescriptionPlugin = pgSmartTags({
    kind: "class",
    match: "graphile_utils.users",
    description: "Users table via pgSmartTags",
  });
  const { schema } = await makeSchema(makePreset([UsersDescriptionPlugin]));
  const userType = schema.getType("User") as GraphQLObjectType;
  expect(userType.description).toEqual("Users table via pgSmartTags");
});

it("pgSmartTags does not leak matches across classes", async () => {
  const USERS_DESC = "Users table via pgSmartTags";
  const PETS_DESC = "Pets table via pgSmartTags";
  const UsersDescriptionPlugin = pgSmartTags([
    {
      kind: "class",
      match: "graphile_utils.users",
      description: USERS_DESC,
    },
    {
      kind: "class",
      match: "graphile_utils.pets",
      description: PETS_DESC,
    },
  ]);
  const { schema } = await makeSchema(makePreset([UsersDescriptionPlugin]));
  const userType = schema.getType("User") as GraphQLObjectType;
  const petType = schema.getType("Pet") as GraphQLObjectType;
  expect(userType.description).toEqual(USERS_DESC);
  expect(petType).toBeDefined();
  expect(petType.description).toEqual(PETS_DESC);
});

it("pgSmartTags does not leak matches across attributes", async () => {
  const DESC = "Users name via pgSmartTags";
  const introspection = await getIntrospectionWithSmartTags({
    kind: "attribute",
    match: "graphile_utils.users.name",
    description: DESC,
  });
  const usersName = findAttribute(
    introspection,
    "graphile_utils",
    "users",
    "name",
  );
  const petsName = findAttribute(
    introspection,
    "graphile_utils",
    "pets",
    "name",
  );
  expect(usersName.getTagsAndDescription().description).toEqual(DESC);
  expect(petsName.getTagsAndDescription().description).not.toEqual(DESC);
});

it("pgSmartTags does not leak matches across constraints", async () => {
  const DESC = "Users pkey via pgSmartTags";
  const introspection = await getIntrospectionWithSmartTags({
    kind: "constraint",
    match: "graphile_utils.users.users_pkey",
    description: DESC,
  });
  const usersPkey = findConstraint(
    introspection,
    "graphile_utils",
    "users",
    "users_pkey",
  );
  const petsPkey = findConstraint(
    introspection,
    "graphile_utils",
    "pets",
    "pets_pkey",
  );
  expect(usersPkey.getTagsAndDescription().description).toEqual(DESC);
  expect(petsPkey.getTagsAndDescription().description).not.toEqual(DESC);
});

it("pgSmartTags does not leak matches across procedures", async () => {
  const DESC = "Proc one via pgSmartTags";
  const introspection = await getIntrospectionWithSmartTags(
    {
      kind: "procedure",
      match: "graphile_utils.test_proc_one",
      description: DESC,
    },
    {
      setupSql: [
        "create function graphile_utils.test_proc_one() returns int language sql as $$ select 1 $$;",
        "create function graphile_utils.test_proc_two() returns int language sql as $$ select 2 $$;",
      ],
      teardownSql: [
        "drop function if exists graphile_utils.test_proc_one();",
        "drop function if exists graphile_utils.test_proc_two();",
      ],
    },
  );
  const procOne = findProc(introspection, "graphile_utils", "test_proc_one");
  const procTwo = findProc(introspection, "graphile_utils", "test_proc_two");
  expect(procOne.getTagsAndDescription().description).toEqual(DESC);
  expect(procTwo.getTagsAndDescription().description).not.toEqual(DESC);
});

it("pgSmartTags does not leak matches across types", async () => {
  const DESC = "Complex type via pgSmartTags";
  const introspection = await getIntrospectionWithSmartTags({
    kind: "type",
    match: "graphile_utils.complex",
    description: DESC,
  });
  const complexType = findType(introspection, "graphile_utils", "complex");
  const usersType = findType(introspection, "graphile_utils", "users");
  expect(complexType.getTagsAndDescription().description).toEqual(DESC);
  expect(usersType.getTagsAndDescription().description).not.toEqual(DESC);
});

it("pgSmartTags does not leak matches across namespaces", async () => {
  const DESC = "Graphile utils namespace via pgSmartTags";
  const introspection = await getIntrospectionWithSmartTags({
    kind: "namespace",
    match: "graphile_utils",
    description: DESC,
  });
  const graphileUtils = findNamespace(introspection, "graphile_utils");
  const graphileUtils2 = findNamespace(introspection, "graphile_utils_2");
  expect(graphileUtils.getTagsAndDescription().description).toEqual(DESC);
  expect(graphileUtils2.getTagsAndDescription().description).not.toEqual(DESC);
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
  const { schema } = await makeSchema(makePreset([UsersDescriptionPlugin]));
  const userType = schema.getType("User") as GraphQLObjectType;
  expect(userType.description).toEqual("Users table via jsonPgSmartTags");
});

it("pgSmartTagRulesFromJSON validates version", () => {
  expect(() =>
    pgSmartTagRulesFromJSON({ version: 2, config: {} } as any),
  ).toThrow(/only supports the version 1 smart tags JSON format/);
});
