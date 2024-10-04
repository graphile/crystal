import { TYPES } from "@dataplan/pg";
import { makePgService } from "@dataplan/pg/adaptors/pg";
import { grafast } from "grafast";
import type { ExecutionResult } from "grafast/graphql";
import type { SchemaResult } from "graphile-build";
import type { Pool } from "pg";
import pg from "pg";
import { makeSchema } from "postgraphile";
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { makeV4Preset } from "postgraphile/presets/v4";

import {
  createTestDatabase,
  dropTestDatabase,
} from "../../../grafast/dataplan-pg/__tests__/sharedHelpers.js";
import type { NullsSortMethod } from "../src/index.js";
import { makeAddPgTableOrderByPlugin, orderByAscDesc } from "../src/index.js";

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
    pgPool.end();
    pgPool = null;
    await dropTestDatabase(databaseName);
  }
});

const makePetsPlugin = (nullsSortMethod: NullsSortMethod) =>
  makeAddPgTableOrderByPlugin(
    { schemaName: "graphile_utils", tableName: "users" },
    (build) => {
      const { sql } = build;
      const sqlIdentifier = sql.identifier(Symbol("pet"));

      const customOrderBy = orderByAscDesc(
        "PET_ID_AVERAGE", // this is a ridiculous and unrealistic attribute but it will serve for testing purposes
        ($select) => {
          const orderByFrag = sql`(
            select avg(${sqlIdentifier}.id)
            from graphile_utils.pets as ${sqlIdentifier}
            where ${sqlIdentifier}.user_id = ${$select.alias}.id
          )`;

          return { fragment: orderByFrag, codec: TYPES.int };
        },
        { nulls: nullsSortMethod },
      );

      return customOrderBy;
    },
  );

const getResultingOrderFromUserNodes = (userNodes: { name?: string }[]) =>
  userNodes.map((node) => node.name);

const checkArraysAreEqual = (array1: any[], array2: any[]) =>
  JSON.stringify(array1) === JSON.stringify(array2);

const getSchema = async (nullsSortMethod?: NullsSortMethod) => {
  const schemaResult = await makeSchema({
    extends: [
      PostGraphileAmberPreset,
      makeV4Preset({
        disableDefaultMutations: true,
        simpleCollections: "both",
        appendPlugins: [makePetsPlugin(nullsSortMethod)],
      }),
    ],
    pgServices: [makePgService({ pool: pgPool!, schemas: ["graphile_utils"] })],
  });

  return schemaResult;
};

/**
 * We expect the "pet id average" to be the following for each person:
 * Alice: null (she has no pets, so no average to make);
 * Bob: 1.5 ( = (1 + 2) / 2) -- he gets assigned pets first and has 2
 * Caroline: 4 ( = (3 + 4 + 5) / 3) -- she gets assigned pets second and has 3
 *
 * Note that even if the pet id's increase: the average orders should stay the same
 */
const getAscDescData = async (schemaResult: SchemaResult) => {
  const { schema, resolvedPreset } = schemaResult;
  const { data: dataAsc, errors: errorsAsc } = (await grafast(
    {
      schema,
      source: `
      query {
        allUsers(orderBy: PET_ID_AVERAGE_ASC) {
          nodes {
            nodeId
            id
            name
          }
        }
      }
    `,
    },
    resolvedPreset,
    {},
  )) as ExecutionResult;

  const { data: dataDesc, errors: errorsDesc } = (await grafast(
    {
      schema,
      source: `
      query {
        allUsers(orderBy: PET_ID_AVERAGE_DESC) {
          nodes {
            nodeId
            id
            name
          }
        }
      }
    `,
    },
    resolvedPreset,
    {},
  )) as ExecutionResult;

  const userNodesAsc = (dataAsc?.allUsers as any)?.nodes;
  const userNodesDesc = (dataDesc?.allUsers as any)?.nodes;

  return {
    dataAsc,
    dataDesc,
    errorsAsc,
    errorsDesc,
    userNodesAsc,
    userNodesDesc,
  };
};

it('allows creating a "order by" plugin with DEFAULT asc/desc ordering', async () => {
  const schemaResult = await getSchema();

  const {
    dataAsc,
    dataDesc,
    errorsAsc,
    errorsDesc,
    userNodesAsc,
    userNodesDesc,
  } = await getAscDescData(schemaResult);

  expect(errorsAsc).toBeFalsy();
  expect(errorsDesc).toBeFalsy();

  // by default, the natural order by puts nulls last when using ascending order
  const correctOrderAsc = ["Bob", "Caroline", "Alice"];
  const resultingOrderAsc = getResultingOrderFromUserNodes(userNodesAsc);

  const ascOrdersAreEqual = checkArraysAreEqual(
    correctOrderAsc,
    resultingOrderAsc,
  );

  expect(dataAsc).toBeTruthy();
  expect(ascOrdersAreEqual).toBeTruthy();

  // by default, the natural order by puts nulls FIRST when using descending order
  const correctOrderDesc = ["Alice", "Caroline", "Bob"];
  const resultingOrderDesc = getResultingOrderFromUserNodes(userNodesDesc);

  const descOrdersAreEqual = checkArraysAreEqual(
    correctOrderDesc,
    resultingOrderDesc,
  );

  expect(dataDesc).toBeTruthy();
  expect(descOrdersAreEqual).toBeTruthy();
});

it('allows creating a "order by" plugin with NULLS FIRST asc/desc ordering', async () => {
  const schemaResult = await getSchema("first");
  const {
    dataAsc,
    dataDesc,
    errorsAsc,
    errorsDesc,
    userNodesAsc,
    userNodesDesc,
  } = await getAscDescData(schemaResult);

  // nulls first, so Alice, then ascending
  const correctOrderAsc = ["Alice", "Bob", "Caroline"];
  const resultingOrderAsc = getResultingOrderFromUserNodes(userNodesAsc);

  const ascOrdersAreEqual = checkArraysAreEqual(
    correctOrderAsc,
    resultingOrderAsc,
  );

  expect(errorsAsc).toBeFalsy();
  expect(dataAsc).toBeTruthy();
  expect(ascOrdersAreEqual).toBeTruthy();

  // nulls first, so Alice, then descending
  const correctOrderDesc = ["Alice", "Caroline", "Bob"];
  const resultingOrderDesc = getResultingOrderFromUserNodes(userNodesDesc);

  const descOrdersAreEqual = checkArraysAreEqual(
    correctOrderDesc,
    resultingOrderDesc,
  );

  expect(errorsDesc).toBeFalsy();
  expect(dataDesc).toBeTruthy();
  expect(descOrdersAreEqual).toBeTruthy();
});

it('allows creating a "order by" plugin with NULLS LAST asc/desc ordering', async () => {
  const schemaResult = await getSchema("last");
  const {
    dataAsc,
    dataDesc,
    errorsAsc,
    errorsDesc,
    userNodesAsc,
    userNodesDesc,
  } = await getAscDescData(schemaResult);

  // nulls last, so ascending, then Alice
  const correctOrderAsc = ["Bob", "Caroline", "Alice"];
  const resultingOrderAsc = getResultingOrderFromUserNodes(userNodesAsc);

  const ascOrdersAreEqual = checkArraysAreEqual(
    correctOrderAsc,
    resultingOrderAsc,
  );

  expect(errorsAsc).toBeFalsy();
  expect(dataAsc).toBeTruthy();
  expect(ascOrdersAreEqual).toBeTruthy();

  // nulls last, so descending, then Alice
  const correctOrderDesc = ["Caroline", "Bob", "Alice"];
  const resultingOrderDesc = getResultingOrderFromUserNodes(userNodesDesc);

  const descOrdersAreEqual = checkArraysAreEqual(
    correctOrderDesc,
    resultingOrderDesc,
  );

  expect(errorsDesc).toBeFalsy();
  expect(dataDesc).toBeTruthy();
  expect(descOrdersAreEqual).toBeTruthy();
});

it('allows creating a "order by" plugin with NULLS FIRST IFF ASCENDING asc/desc ordering', async () => {
  const schemaResult = await getSchema("first-iff-ascending");

  const {
    dataAsc,
    dataDesc,
    errorsAsc,
    errorsDesc,
    userNodesAsc,
    userNodesDesc,
  } = await getAscDescData(schemaResult);

  // nulls first, so Alice, then ascending
  const correctOrderAsc = ["Alice", "Bob", "Caroline"];
  const resultingOrderAsc = getResultingOrderFromUserNodes(userNodesAsc);

  const ascOrdersAreEqual = checkArraysAreEqual(
    correctOrderAsc,
    resultingOrderAsc,
  );

  expect(errorsAsc).toBeFalsy();
  expect(dataAsc).toBeTruthy();
  expect(ascOrdersAreEqual).toBeTruthy();

  // nulls last, so descending, then Alice
  const correctOrderDesc = ["Caroline", "Bob", "Alice"];
  const resultingOrderDesc = getResultingOrderFromUserNodes(userNodesDesc);

  const descOrdersAreEqual = checkArraysAreEqual(
    correctOrderDesc,
    resultingOrderDesc,
  );

  expect(errorsDesc).toBeFalsy();
  expect(dataDesc).toBeTruthy();
  expect(descOrdersAreEqual).toBeTruthy();
});

it('allows creating a "order by" plugin with NULLS LAST IFF ASCENDING asc/desc ordering', async () => {
  const schemaResult = await getSchema("last-iff-ascending");
  const {
    dataAsc,
    dataDesc,
    errorsAsc,
    errorsDesc,
    userNodesAsc,
    userNodesDesc,
  } = await getAscDescData(schemaResult);

  // nulls last, so ascending, then Alice
  const correctOrderAsc = ["Bob", "Caroline", "Alice"];
  const resultingOrderAsc = getResultingOrderFromUserNodes(userNodesAsc);

  const ascOrdersAreEqual = checkArraysAreEqual(
    correctOrderAsc,
    resultingOrderAsc,
  );

  expect(errorsAsc).toBeFalsy();
  expect(dataAsc).toBeTruthy();
  expect(ascOrdersAreEqual).toBeTruthy();

  // nulls first, so Alice, then descending
  const correctOrderDesc = ["Alice", "Caroline", "Bob"];
  const resultingOrderDesc = getResultingOrderFromUserNodes(userNodesDesc);

  const descOrdersAreEqual = checkArraysAreEqual(
    correctOrderDesc,
    resultingOrderDesc,
  );

  expect(errorsDesc).toBeFalsy();
  expect(dataDesc).toBeTruthy();
  expect(descOrdersAreEqual).toBeTruthy();
});
