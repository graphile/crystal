jest.unmock("postgraphile-core");

import "mock-fs";
import withPgClient from "../../__tests__/utils/withPgClient";
import { createPostGraphileSchema } from "..";
import exportPostGraphileSchema from "../schema/exportPostGraphileSchema";
import mockFs from "mock-fs";
import { readFileSync, existsSync } from "fs";

// When running jest from the root of the monorepo, the directory is the
// repository root, so all the file paths are incorrect. I couldn't find a way
// to have jest automatically `process.chdir` for each test suite.
process.chdir(__dirname + "/../../..");

// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;

const gqlSchemaPromise = withPgClient(async (pgClient) => {
  return await createPostGraphileSchema(pgClient, ["a", "b", "c"]);
})();

afterEach(() => mockFs.restore());

test("exports a schema as JSON", async () => {
  const gqlSchema = await gqlSchemaPromise;
  mockFs();
  await exportPostGraphileSchema(gqlSchema, {
    exportJsonSchemaPath: "/schema.json",
  });
  const schemaJson = readFileSync("/schema.json", "utf8");
  mockFs.restore();
  expect(schemaJson).toMatchSnapshot();
});

test("exports a schema as GQL", async () => {
  const gqlSchema = await gqlSchemaPromise;
  mockFs();
  await exportPostGraphileSchema(gqlSchema, {
    exportGqlSchemaPath: "/schema.gql",
  });
  const schemaGql = readFileSync("/schema.gql", "utf8");
  mockFs.restore();
  expect(schemaGql).toMatchSnapshot();
});

test("exports a sorted schema as GQL", async () => {
  const gqlSchema = await gqlSchemaPromise;
  mockFs();
  await exportPostGraphileSchema(gqlSchema, {
    exportGqlSchemaPath: "/schema.gql",
    sortExport: true,
  });
  const schemaGql = readFileSync("/schema.gql", "utf8");
  mockFs.restore();
  expect(schemaGql).toMatchSnapshot();
});

test("does not export a schema when not enabled", async () => {
  const gqlSchema = await gqlSchemaPromise;
  mockFs();
  await exportPostGraphileSchema(gqlSchema);
  expect(existsSync("/schema.gql")).toBe(false);
  expect(existsSync("/schema.json")).toBe(false);
  mockFs.restore();
});
