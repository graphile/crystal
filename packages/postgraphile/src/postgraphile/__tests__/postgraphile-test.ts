jest.mock("pg");
jest.mock("pg-connection-string");
jest.mock("postgraphile-core");
jest.mock("../http/createPostGraphileHttpRequestHandler");

import { GraphQLInt, GraphQLObjectType, GraphQLSchema } from "graphql";
import { Pool } from "pg";

import { createPostGraphileSchema, watchPostGraphileSchema } from "..";
import createPostGraphileHttpRequestHandler from "../http/createPostGraphileHttpRequestHandler";
import postgraphile from "../postgraphile";

type MockHack<T extends (...args: any[]) => any> = jest.Mock<ReturnType<T>>;

const mockedCreatePostGraphileSchema = createPostGraphileSchema as MockHack<
  typeof createPostGraphileSchema
>;
const mockedWatchPostGraphileSchema = watchPostGraphileSchema as MockHack<
  typeof watchPostGraphileSchema
>;
const mockedCreatePostGraphileHttpRequestHandler =
  createPostGraphileHttpRequestHandler as MockHack<
    typeof createPostGraphileHttpRequestHandler
  >;

const blankSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      _: {
        type: GraphQLInt,
      },
    },
  }),
});
mockedWatchPostGraphileSchema.mockImplementation((a, b, c, d) => {
  d(blankSchema);
  return Promise.resolve(() => Promise.resolve());
});

mockedCreatePostGraphileHttpRequestHandler.mockImplementation(
  ({ getGqlSchema }): any => Promise.resolve(getGqlSchema()).then(() => null),
);

test("will use a connected client from the pool, the schemas, and options to create a GraphQL schema", async () => {
  mockedCreatePostGraphileSchema.mockClear();
  mockedCreatePostGraphileHttpRequestHandler.mockClear();
  const pgPool = new Pool();
  const schemas = [Symbol("schemas")];
  const options = { $options: Symbol("options") };
  await postgraphile(pgPool, schemas as any, options as any);
  expect(mockedCreatePostGraphileSchema.mock.calls).toEqual([
    [pgPool, schemas, options],
  ]);
});

test("will use a connected client from the pool, the default schema, and options to create a GraphQL schema", async () => {
  mockedCreatePostGraphileSchema.mockClear();
  mockedCreatePostGraphileHttpRequestHandler.mockClear();
  const pgPool = new Pool();
  const options = { $options: Symbol("options") };
  await postgraphile(pgPool, options as any);
  expect(mockedCreatePostGraphileSchema.mock.calls).toEqual([
    [pgPool, ["public"], options],
  ]);
});

test("will use a created GraphQL schema to create the HTTP request handler and pass down options", async () => {
  mockedCreatePostGraphileSchema.mockClear();
  mockedCreatePostGraphileHttpRequestHandler.mockClear();
  const pgPool = new Pool();
  const gqlSchema = Symbol("gqlSchema");
  const options = { a: 1, b: 2, c: 3 };
  mockedCreatePostGraphileSchema.mockReturnValueOnce(
    Promise.resolve(gqlSchema) as any,
  );
  await postgraphile(pgPool, [], options as any);
  expect(mockedCreatePostGraphileHttpRequestHandler.mock.calls.length).toBe(1);
  expect(mockedCreatePostGraphileHttpRequestHandler.mock.calls[0].length).toBe(
    1,
  );
  expect(
    Object.keys(mockedCreatePostGraphileHttpRequestHandler.mock.calls[0][0]),
  ).toEqual(["a", "b", "c", "getGqlSchema", "pgPool", "_emitter"]);
  expect(
    mockedCreatePostGraphileHttpRequestHandler.mock.calls[0][0].pgPool,
  ).toBe(pgPool);
  expect(mockedCreatePostGraphileHttpRequestHandler.mock.calls[0][0].a).toBe(
    options.a,
  );
  expect(mockedCreatePostGraphileHttpRequestHandler.mock.calls[0][0].b).toBe(
    options.b,
  );
  expect(mockedCreatePostGraphileHttpRequestHandler.mock.calls[0][0].c).toBe(
    options.c,
  );
  expect(
    await mockedCreatePostGraphileHttpRequestHandler.mock.calls[0][0].getGqlSchema(),
  ).toBe(gqlSchema);
});

test("will watch Postgres schemas when `watchPg` is true", async () => {
  mockedCreatePostGraphileSchema.mockClear();
  mockedWatchPostGraphileSchema.mockClear();
  const pgPool = new Pool();
  const pgSchemas = [Symbol("a"), Symbol("b"), Symbol("c")];
  await postgraphile(pgPool, pgSchemas as any, { watchPg: false });
  await postgraphile(pgPool, pgSchemas as any, { watchPg: true });
  expect(mockedCreatePostGraphileSchema.mock.calls).toEqual([
    [pgPool, pgSchemas, { watchPg: false }],
  ]);

  expect(mockedWatchPostGraphileSchema.mock.calls.length).toBe(1);
  expect(mockedWatchPostGraphileSchema.mock.calls[0].length).toBe(4);
  expect(mockedWatchPostGraphileSchema.mock.calls[0][0]).toEqual(pgPool);
  expect(mockedWatchPostGraphileSchema.mock.calls[0][1]).toEqual(pgSchemas);
  expect(mockedWatchPostGraphileSchema.mock.calls[0][2]).toEqual({
    watchPg: true,
  });
  expect(typeof mockedWatchPostGraphileSchema.mock.calls[0][3]).toBe(
    "function",
  );
});

test("will not error if jwtSecret is provided without jwtPgTypeIdentifier", async () => {
  const pgPool = new Pool();
  const spy = jest.spyOn(console, "warn").mockImplementation(() => {});
  expect(() => postgraphile(pgPool, [], { jwtSecret: "test" })).not.toThrow();
  expect(spy.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "WARNING: jwtSecret provided, however jwtPgTypeIdentifier (token identifier) not provided.",
      ],
    ]
  `);
});

test("will throw on undefined positional arguments", async () => {
  const pgPool = new Pool();
  const options = { $options: Symbol("options") };

  mockedCreatePostGraphileSchema.mockClear();
  expect(() => postgraphile(pgPool, null as any, options as any)).not.toThrow();
  expect(() => postgraphile(pgPool, options as any)).not.toThrow();
  expect(mockedCreatePostGraphileSchema.mock.calls).toEqual([
    [pgPool, ["public"], options],
    [pgPool, ["public"], options],
  ]);

  expect(() => postgraphile(null as any)).not.toThrow();
  expect(() => postgraphile(pgPool, null as any)).not.toThrow();
  expect(() => postgraphile(null as any, "public")).not.toThrow();

  expect(() => postgraphile(undefined)).toThrow();
  expect(() => postgraphile(pgPool, undefined)).toThrow();
  expect(() => postgraphile(undefined, "public")).toThrow();
});
