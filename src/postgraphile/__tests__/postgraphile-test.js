jest.mock("pg");
jest.mock("pg-connection-string");
jest.mock("postgraphile-core");
jest.mock("../http/createPostGraphileHttpRequestHandler");

import { Pool } from "pg";
import { parse as parsePgConnectionString } from "pg-connection-string";
import { createPostGraphileSchema, watchPostGraphileSchema } from "..";
import createPostGraphileHttpRequestHandler from "../http/createPostGraphileHttpRequestHandler";
import postgraphile from "../postgraphile";

const chalk = require("chalk");

createPostGraphileHttpRequestHandler.mockImplementation(({ getGqlSchema }) =>
  Promise.resolve(getGqlSchema()).then(() => null)
);

test("will use a connected client from the pool, the schemas, and options to create a GraphQL schema", async () => {
  createPostGraphileSchema.mockClear();
  createPostGraphileHttpRequestHandler.mockClear();
  const pgPool = new Pool();
  const schemas = [Symbol("schemas")];
  const options = Symbol("options");
  await postgraphile(pgPool, schemas, options);
  expect(createPostGraphileSchema.mock.calls).toEqual([
    [pgPool, schemas, options],
  ]);
});

test("will use a connected client from the pool, the default schema, and options to create a GraphQL schema", async () => {
  createPostGraphileSchema.mockClear();
  createPostGraphileHttpRequestHandler.mockClear();
  const pgPool = new Pool();
  const options = Symbol("options");
  const pgClient = { release: jest.fn() };
  await postgraphile(pgPool, options);
  expect(createPostGraphileSchema.mock.calls).toEqual([
    [pgPool, ["public"], options],
  ]);
});

test("will use a created GraphQL schema to create the HTTP request handler and pass down options", async () => {
  createPostGraphileSchema.mockClear();
  createPostGraphileHttpRequestHandler.mockClear();
  const pgPool = new Pool();
  const gqlSchema = Symbol("gqlSchema");
  const options = { a: 1, b: 2, c: 3 };
  createPostGraphileSchema.mockReturnValueOnce(Promise.resolve(gqlSchema));
  await postgraphile(pgPool, [], options);
  expect(createPostGraphileHttpRequestHandler.mock.calls.length).toBe(1);
  expect(createPostGraphileHttpRequestHandler.mock.calls[0].length).toBe(1);
  expect(
    Object.keys(createPostGraphileHttpRequestHandler.mock.calls[0][0])
  ).toEqual(["a", "b", "c", "getGqlSchema", "pgPool", "_emitter"]);
  expect(createPostGraphileHttpRequestHandler.mock.calls[0][0].pgPool).toBe(
    pgPool
  );
  expect(createPostGraphileHttpRequestHandler.mock.calls[0][0].a).toBe(
    options.a
  );
  expect(createPostGraphileHttpRequestHandler.mock.calls[0][0].b).toBe(
    options.b
  );
  expect(createPostGraphileHttpRequestHandler.mock.calls[0][0].c).toBe(
    options.c
  );
  expect(
    await createPostGraphileHttpRequestHandler.mock.calls[0][0].getGqlSchema()
  ).toBe(gqlSchema);
});

test("will watch Postgres schemas when `watchPg` is true", async () => {
  createPostGraphileSchema.mockClear();
  watchPostGraphileSchema.mockClear();
  const pgPool = new Pool();
  const pgSchemas = [Symbol("a"), Symbol("b"), Symbol("c")];
  await postgraphile(pgPool, pgSchemas, { watchPg: false });
  await postgraphile(pgPool, pgSchemas, { watchPg: true });
  expect(createPostGraphileSchema.mock.calls).toEqual([
    [pgPool, pgSchemas, { watchPg: false }],
  ]);

  expect(watchPostGraphileSchema.mock.calls.length).toBe(1);
  expect(watchPostGraphileSchema.mock.calls[0].length).toBe(4);
  expect(watchPostGraphileSchema.mock.calls[0][0]).toEqual(pgPool);
  expect(watchPostGraphileSchema.mock.calls[0][1]).toEqual(pgSchemas);
  expect(watchPostGraphileSchema.mock.calls[0][2]).toEqual({ watchPg: true });
  expect(typeof watchPostGraphileSchema.mock.calls[0][3]).toBe("function");
});

test("will not error if jwtSecret is provided without jwtPgTypeIdentifier", async () => {
  const pgPool = new Pool();
  expect(() => postgraphile(pgPool, [], { jwtSecret: "test" })).not.toThrow();
});
