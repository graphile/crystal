jest.unmock("postgraphile-core");

import "mock-fs";
import withPgClient from "../../__tests__/utils/withPgClient";
import { createPostGraphileSchema } from "..";
import exportPostGraphileSchema from "../schema/exportPostGraphileSchema";
import mockFs from "mock-fs";
import { readFileSync, existsSync } from "fs";

// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;

const gqlSchemaPromise = withPgClient(async (pgClient) => {
  return await createPostGraphileSchema(pgClient, ["a", "b", "c"]);
})();

afterEach(() => mockFs.restore());

test("exports a schema as JSON", async () => {
  mockFs();
  const gqlSchema = await gqlSchemaPromise;
  await exportPostGraphileSchema(gqlSchema, {
    exportJsonSchemaPath: "/schema.json",
  });
  expect(readFileSync("/schema.json", "utf8").toMatchSnapshot());
  mockFs.restore();
});

test("exports a schema as GQL", async () => {
  mockFs();
  const gqlSchema = await gqlSchemaPromise;
  await exportPostGraphileSchema(gqlSchema, {
    exportGqlSchemaPath: "/schema.gql",
  });
  expect(readFileSync("/schema.gql", "utf8").toMatchSnapshot());
});

test("exports a sorted schema as GQL", async () => {
  mockFs();
  const gqlSchema = await gqlSchemaPromise;
  await exportPostGraphileSchema(gqlSchema, {
    exportGqlSchemaPath: "/schema.gql",
    sortExport: true,
  });
  expect(readFileSync("/schema.gql", "utf8").toMatchSnapshot());
});

test("does not export a schema when not enabled", async () => {
  mockFs();
  const gqlSchema = await gqlSchemaPromise;
  await exportPostGraphileSchema(gqlSchema);
  expect(existsSync("/schema.gql")).toBe(false);
  expect(existsSync("/schema.json")).toBe(false);
});
